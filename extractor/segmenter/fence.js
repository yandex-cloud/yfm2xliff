/* eslint-disable handle-callback-err, new-cap  */
const {
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
const {highlight, highlightAuto} = require('highlight.js');

const {lift} = require('../../common/transformers');
const {notEmpty} = require('../../common/predicates');
const {
    comment: {commentRgxpGlobal},
    token: {contentLens},
    fence: {langLens},
} = require('../tokens');
const {splitLines, stripPunct} = require('../common');
const {commentBody} = require('./comment');

const isMarkdown = compose(equals('markdown'), langLens);

const markdown = compose(
    map(commentBody),
    filter(test(commentRgxpGlobal)),
    splitLines,
    contentLens,
);

const isLangSet = compose(notEmpty, langLens);

const commentsParserEmptyVal = () => ({_emitter: {rootNode: {children: []}}, language: ''});

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

    const {
        _emitter: {rootNode: children},
    } = parse();

    return children;
};

const other = compose(chain(stripPunct), chain(splitLines), liftComments, parseComments);

const fence = cond([
    [isMarkdown, markdown],
    [always(true), other],
]);

module.exports = {fence};
