/* eslint-disable handle-callback-err, new-cap  */
const {
    apply,
    toPairs,
    chain,
    join,
    prop,
    defaultTo,
    tap,
    tryCatch,
    compose,
    map,
    filter,
    test,
    cond,
    equals,
    always,
} = require('ramda');
const highlighter = require('highlight.js');
const {lift} = require('../../common/transformers');
const {notEmpty} = require('../../common/predicates');
const {
    comment: {commentRgxpGlobal},
    token: {contentLens},
    fence: {langLens},
} = require('../tokens');
const {splitLines, stripPunct} = require('../common');
const {commentBody} = require('./comment');

const {highlight, highlightAuto} = highlighter;

const registerLanguages = compose(map(apply(highlighter.registerLanguage)), toPairs);

const isMarkdown = compose(equals('markdown'), langLens);

const markdown = compose(
    map(commentBody),
    filter(test(commentRgxpGlobal)),
    splitLines,
    contentLens,
);

const isLangSet = compose(notEmpty, langLens);

// use one of the available inner interfaces of the hightlight.js
const commentsParserEmptyVal = () => ({
    _emitter: {rootNode: {children: []}},
    emitter: {rootNode: {children: []}},
    language: '',
});

const commentsParserErrLogger = tap((err) =>
    console.info('error occured parsing comments from fence block\n', err),
);

const commentsParserErrHandler = compose(commentsParserEmptyVal, commentsParserErrLogger);

const commentsParser = (token) => {
    const parser = isLangSet(token)
        ? highlight.bind(this, contentLens(token), {language: langLens(token)})
        : highlightAuto.bind(this, contentLens(token));

    return tryCatch(parser, commentsParserErrHandler);
};

const childrenLens = compose(defaultTo([]), prop('children'));

const kindLens = prop('kind');

const isComment = compose(equals('comment'), kindLens);

const comment = compose(join(''), childrenLens);

const liftComments = lift(isComment)(childrenLens)(comment);

const parseComments = (token) => {
    const parse = commentsParser(token);

    // use one of the available inner interfaces of the hightlight.js
    const parsed = parse();

    const children = [parsed?.emitter?.rootNode?.children, parsed?._emitter?.rootNode?.children];

    return children[0] ?? children[1];
};

const other = compose(chain(stripPunct), chain(splitLines), liftComments, parseComments);

const fence = (languages) => {
    registerLanguages(languages ?? {});

    return cond([
        [isMarkdown, markdown],
        [always(true), other],
    ]);
};

module.exports = {fence};
