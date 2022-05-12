/* eslint-disable security/detect-non-literal-regexp */
const {compose, anyPass, equals, test, assoc} = require('ramda');
const {contentLens, typeLens} = require('./token');

const commentRgxp = /(?:\[\/\/\]:)\s(.+)/;
const commentRgxpGlobal = new RegExp(commentRgxp, 'g');

const isComment = anyPass([
    compose(test(commentRgxpGlobal), contentLens),
    compose(equals('comment'), typeLens),
]);

const comment = assoc('type', 'comment');

module.exports = {commentRgxp, commentRgxpGlobal, isComment, comment};
