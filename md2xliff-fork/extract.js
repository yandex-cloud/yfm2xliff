const escape = require('escape-html');
const isHtml = require('is-html');
const {parseFragment} = require('parse5');
const {highlight, highlightAuto} = require('highlight.js');
const xliffSerialize = require('./xliff-serialize');
const postcss = require('postcss');
const extractComments = require('esprima-extract-comments');
const hideErrors = process.env.HIDE_ERRORS;
const {
  join,
  tryCatch,
  is,
  chain,
  useWith,
  complement,
  equals,
  toLower,
  toUpper,
  replace,
  values,
  compose,
  split,
  trim,
  flatten,
  map,
  filter,
  allPass,
  anyPass,
  find,
  propEq,
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
  type === 'image' ||
  type === 'html_block';

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

    const lift = depthLense => predicate => lifteeLense => {
      const lifter = node =>
        predicate(node)
          ? lifteeLense(node)
          : depthLense(node) && chain(lifter, depthLense(node));

      return lifter;
    }

    const stripPunct = compose(
      // leading non-alphanum
      replace(/^[^a-zA-Zа-яА-ЯёЁ]*/g, ''),
      // trailling non-alphanum
      replace(/[^a-zA-Zа-яА-ЯёЁ]*$/g, ''));

    function handleCode(code, lang) {
      if (lang === 'markdown') {
        return onComment(code);
      }

      const errorHandler = (err, value) => {
        console.info(`language: ${lang} not supported`);
        console.info('failed to parse comments from code block:')
        console.info(code);

        return {_emitter:{rootNode: {children: []}}, language: ''};
      }

      const parser = tryCatch(lang
        ? highlight.bind(this, code, { language: lang })
        : highlightAuto.bind(this, code), errorHandler);

      const { _emitter: {rootNode: children}, language} = parser(); 

      const kindLense = ({ kind }) => kind;

      const iscomment = compose(equals('comment'), kindLense)

      const childrenLense = ({ children }) => children;

      const lifteeLense = compose(join(''), childrenLense);

      const liftComments = compose(
        filter(is(String)),
        lift(childrenLense)(iscomment)(lifteeLense));

      const getComments = compose(
        map(getSegments),
        filter(Boolean),
        map(stripPunct),
        chain(splitLines),
        liftComments);

      getComments(children);
    }

    const propLens = prop => obj => obj[prop];

    function handleHTML(token) {
      const tree = parseFragment(token.content);

      const istext = compose(equals('#text'), propLens('nodeName'));

      const isimg = compose(equals('img'), propLens('nodeName'));

      const filters = anyPass([istext, isimg]);

      const imageLens = compose(
        propLens('value'),
        find(propEq('name', 'alt')),
        propLens('attrs')); 

      const leafLens = (node) => istext(node)
        ? propLens('value')(node)
        : isimg(node)
          ? imageLens(node)
          : "";

      const liftText = compose(
        filter(Boolean),
        map(stripPunct),
        lift(propLens('childNodes'))(filters)(leafLens)); 

      const getHTML = compose(
        map(getSegments),
        liftText,
        parseFragment,
        propLens('content'));

      getHTML(token);
    }

    function handleToken(token) {
        const type = token.type;
        const text = token.content;

        if (type === 'image') return onImage(token);
        if (type === 'html_block') return handleHTML(token);
        if (type === 'image_basic') return onBasicImage(token);
        if (type === 'link') return onLink(token);
        if (type === 'comment') return onComment(text);
        if (type === 'table') return onTable(token);
        if (typeof text === 'undefined') return;
        if (type === 'code') return handleCode(text, token.lang);
        // NOTE: isHtml(text) fails when there's `<script>` in text

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
