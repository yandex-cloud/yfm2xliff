const escape = require('escape-html');
const htmlParser = require('./html-parser');
const isHtml = require('is-html');
const xliffSerialize = require('./xliff-serialize');
const postcss = require('postcss');
const extractComments = require('esprima-extract-comments');
const hideErrors = process.env.HIDE_ERRORS;
const {
  replace,
  values,
  compose,
  split,
  trim,
  flatten,
  map,
  filter,
  allPass,
} = require('ramda');

const traverse = fn => token => {
  fn(token);
  token.type !== 'image' && token.children && token.children.map(traverse(fn));
}

const flatter = (token, i, tokens) => {
  const state = [];

  const {type, explicit} = tokens[i-1] ?? {};

  if (type === 'yfm_note_title_open' && !explicit)
    return state;

  traverse(child => state.push(child))(token);

  return state;
}

const merge = (a, token) => {
  if (token.type === 'link_open') {
    const link = { ...token, type: 'link', content: [] };

    a.merged = [...a.merged, link];

    a.context = 'link';
  } else if (a.context === 'link') {
    const idx = a.merged.length - 1;
    const last = a.merged[idx];

    if (token.content.length) {
      a.merged[idx].content = [
        ...last.content,
        { content: token.content, type: token.type }
      ];

      if (!last.markup.length) {
        a.merged[idx].markup = token.markup;
      }
    }

    if (token.type === 'link_close') {
      if (last.markup === '`') {
        a.merged[idx].type = 'code_inline';

        a.merged[idx].content = last.content.map(({content}) => content).join('');
      }

      a.context = '';
    }
  } else {
    a.merged = [...a.merged, token];
  }

  return a;
}

const flink =({ type, markup, content }) =>
  type !== 'link' || 
  markup !== 'autolink' &&
  content.every(({content}) => content !== '{#T}');

const ftype = ({ type }) =>
  type === 'text' ||
  type === 'fence' ||
  type === 'link' ||
  type === 'image_basic' ||
  type === 'image';

const falpha = ({ content }) => Array.isArray(content)
  ? content.every(({content}) => falpha({content: content}))
  : content.toUpperCase() !== content.toLowerCase();

const filters = allPass([falpha, ftype, flink]);

const CommentsIterator = (text) => {
  const regexp = /(?:\[\/\/\]:)\s([\s\S].*)/g;
  
  return function*() {
      for (;(this.comments = regexp.exec(text));) {
        yield this.comments[1];
      }
  }
};

const ImageIterator = (text) => {
  const regexp = /\!\[(.*)\]\(.*\"(.*)\".*\)/;

  const matches = text.match(regexp)?.slice(1,4) ?? [];

  return function*() {
      for (const match of matches) {
        yield match;
      }
  }
}

const textmap = (token) => {
  const commentsIt = CommentsIterator(token.content);

  if (commentsIt().next().value) {
    token.type = 'comment';
  }

  const imageIt = ImageIterator(token.content);

  if (imageIt().next().value) {
    token.type = 'image_basic';
  }

  return token;
}

const codemap = (token) => {
  token.lang = token.info;
  token.type = 'code';

  return token;
}

const typemap = (token) => {
  switch(token.type) {
    case 'text':
      return textmap(token);
    case 'fence':
      return codemap(token);
    default:
      return token;
  }
}

const logger = (token) => console.log(token) || token;

const gettype = value =>
  !value && typeof value !== 'boolean'
    ? String(value)
    : Array.isArray(value)
      ? 'array'
      : typeof value;


const extractMeta = meta => {
  const extractor = compose(flatten, filter(Boolean), values, map(extractMeta));

  return gettype(meta) === 'string'
    ? { type: 'text', content: meta }
    : extractor(meta);
}

const preprocess = compose(
  // include, code, if, for directives
  replace(/\{%\s(include|code|if|else|endif|for|endfor)\s[^\{]*%\}/g, '\n'),
  // inline LaTex directives
  replace(/\$[\S\$]*\$(?!\d)/g, '\n'),
  // multiline LaTex directives
  replace(/\$\$\\begin[^\$]*?\\end[^\$]*?\$\$/g, '\n'),
  // graphviz directives
  replace(/%%\(graphviz[^%]*?%%/g, '\n'),
  // plantuml directives
  replace(/@startuml[^@]*?@enduml/g, '\n'));

const normalize = compose(
  replace(/\u2424/g, '\n'),
  replace(/\u00a0/g, ' '),
  replace(/\t/g, '    '),
  replace(/\r?\n|\r/g, '\n'));

function extract(md, markdownFileName, skeletonFilename, srcLang, trgLang, options) {
    const tokenize = compose(options.lexer(options), preprocess, normalize);

    let skeleton = normalize(md);
    let links = {};
    let units = [];
    let segmentCounter = 0;
    let position = 0;

    let {tokens, meta} = tokenize(md);

    tokens = [...extractMeta(meta), ...tokens]
      .flatMap(flatter)
      .reduce(merge, { merged: [], context: '' }).merged
      .filter(filters)
      .map(typemap);

    markdownFileName || (markdownFileName = 'source.md');
    skeletonFilename || (skeletonFilename = markdownFileName.split('.').shift() + '.skl.md');
    srcLang || (srcLang = 'ru-RU');
    trgLang || (trgLang = 'en-US');

    // todo: consider pushing refs onto stack and process them in the end
    function addUnit(text) { 
        skeleton = skeleton.replace(text, (str, offset) =>
          '%%%' + ++segmentCounter + '%%%'
        );

        units.push({
            id: segmentCounter,
            source: {
                lang: srcLang,
                content: escape(text)
            },
            target: {
                lang: trgLang
            }
        });
    }

    const onBasicImage = (token) => {
      const imageIt = ImageIterator(token.content);

      for (const chunk of imageIt()) {
        getSegments(chunk);
      }
    }

    const onImage = (token) => {
      const {content, attrs} = token;

      getSegments(content);

      const title = attrs.find(attr => attr[0] === 'title');

      title && getSegments(title[1]);
    }

    const onComment = (text) => {
      const it = CommentsIterator(text);

      for (const value of it()) {
        getSegments(value);
      }
    }

    function onLink(token) {
      let {content, attrs} = token;

      content = Array.isArray(content) ? content : [content];

      content.map(compose(handleToken, textmap));

      const title = attrs.find(attr => attr[0] === 'title');

      title && getSegments(title[1]);
    }

    function onCode(code, lang) {
        let comments;

        if (lang === 'markdown') {
          onComment(code);
        }

        if (lang === 'css') {
            try {
                postcss.parse(code).walkComments(function(comment) {
                    getSegments(comment.text);
                });
            } catch(err) {
                hideErrors || console.log('postCSS was not able to parse comments. Code was saved as is.', err, code);
                getSegments(code);
            }

            return;
        }

        if (lang === 'html') {
            htmlParser(code).forEach(tag => {
                tag.type === 'comment' && getSegments(tag.text);
                // TODO:
                // support tag.type === 'script'
                // support tag.type === 'style'
            });

            return;
        }

        // FIXME: extract for bash
        if (lang !== 'js' && lang !== 'javascript') {
            var genericCommentRegexp = /#\s([\s\S].*)/g;
            while ((comments = genericCommentRegexp.exec(code)) !== null) {
                getSegments(comments[1]);
            }

            return;
        }

        try {
            comments = extractComments.fromString(code);
        } catch(err) {
            try {
                comments = extractComments.fromString('(' + code + ')');
            } catch(err) {
                hideErrors || console.log('Esprima was not able to parse comments. Fallback to regexp', err, code);

                var jsCommentRegexp = /\/\/([\s\S].*)/g;
                while ((comments = jsCommentRegexp.exec(code)) !== null) {
                    getSegments(comments[1]);
                }

                return;
            }
        }

        comments && comments.forEach(function(comment) {
            getSegments(comment.value);
        });
    }

    function onHTML(text) {
        // TODO: divide to block and inline markup first
        htmlParser(text).forEach(tag => {
            if (tag.attrs) {
                ['name', 'src', 'alt'].forEach(item => {
                    tag.attrs[item] && getSegments(tag.attrs[item]);
                });
            };

            if (tag.type === 'text' || tag.type === 'comment' ) {
                getSegments(tag.text);
            }
        });
    }

    function onTable(table) {
        table.header.forEach(function(text) {
            getSegments(text);
        });
        table.cells.forEach(function(row) {
            row.forEach(function(text) {
                getSegments(text);
            });
        });
    }

    function handleToken(token) {
        const type = token.type;
        const text = token.content;

        if (type === 'image') return onImage(token);
        if (type === 'image_basic') return onBasicImage(token);
        if (type === 'link') return onLink(token);
        if (type === 'comment') return onComment(text);
        if (type === 'table') return onTable(token);
        if (typeof text === 'undefined') return;
        if (type === 'code') return onCode(text, token.lang);
        // NOTE: isHtml(text) fails when there's `<script>` in text
        if (type === 'html' || isHtml(text)) return onHTML(text);

        getSegments(text);
    }

    const splitLines = split(/[\n\r]/);

    const splitSentences = split(/([^\.!\?\\]+[\.!\?]+(?=\s*[A-ZА-ЯЁ]+))/);

    const getSentences = compose(
        map(trim),
        flatten,
        map(filter(Boolean)),
        map(splitSentences),
        splitLines);

    const getSegments = compose(map(addUnit), getSentences);

    tokens.forEach(handleToken);

    var data = {
        markdownFileName: markdownFileName,
        skeletonFilename: skeletonFilename,
        srcLang: srcLang,
        trgLang: trgLang,
        units: units
    };

    return {
        skeleton: skeleton,
        xliff: xliffSerialize(data),
        data: data
    };
}

module.exports = extract;
