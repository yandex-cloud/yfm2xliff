const {compose, chain, cond, anyPass, find, prop, propEq, equals, always} = require('ramda');
const {parseFragment} = require('parse5');
const {lift} = require('../../common/transformers');
const {splitLines, stripPunct} = require('../common');

const {
    token: {contentLens},
} = require('../tokens');

const typeLens = prop('nodeName');
const childrenLens = prop('childNodes');

const isText = compose(equals('#text'), typeLens);
const isComment = compose(equals('#comment'), typeLens);
const isImg = compose(equals('img'), typeLens);

const predicate = anyPass([isText, isComment, isImg]);

const commentLens = prop('data');
const textLens = prop('value');
const imgLens = compose(prop('value'), find(propEq('name', 'alt')), prop('attrs'));

const lifteeLens = cond([
    [isComment, commentLens],
    [isText, textLens],
    [isImg, imgLens],
    [always(true), () => ''],
]);

const liftText = lift(predicate)(childrenLens)(lifteeLens);

const html = compose(chain(stripPunct), chain(splitLines), liftText, parseFragment, contentLens);

module.exports = {html};
