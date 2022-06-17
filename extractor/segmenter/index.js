const {
    compose,
    filter,
    flatten,
    map,
    chain,
    juxt,
    tap,
    cond,
    find,
    equals,
    always,
    defaultTo,
    view,
} = require('ramda');

const {
    token: {contentLens, childrenLens, typeLens, attrsLens},
    comment: {isComment},
    codeInline: {isCodeInline},
    image: {isImage},
    fence: {isFence},
    text: {isText},
    link: {isLink},
    html: {isHTML},
} = require('../tokens');
const {notEmpty} = require('../../common/predicates');
const {firstLens, secondLens} = require('../common');
const {codeInline} = require('./code-inline');
const {comment} = require('./comment');
const {fence} = require('./fence');
const {html} = require('./html');

const isTitle = compose(equals('title'), view(firstLens));

const findTitle = compose(defaultTo([]), find(isTitle));

const title = compose(defaultTo(''), view(secondLens), findTitle, attrsLens);

const other = compose(
    tap((type) => {
        throw new Error(`type ${type} not implemented`);
    }),
    typeLens,
);

const segmenter = ({highlight}) => {
    const children = compose(map(handler), childrenLens);

    const childrenTitle = compose(flatten, juxt([children, title]));

    function handler(token) {
        return cond([
            [isCodeInline, codeInline],
            [isLink, childrenTitle],
            [isImage, childrenTitle],
            [isFence, fence(highlight ?? {})],
            [isComment, comment],
            [isText, contentLens],
            [isHTML, html],
            [always(true), other],
        ])(token);
    }

    const segments = compose(filter(notEmpty), chain(handler));

    return segments;
};

module.exports = {segmenter};
