const {compose, equals, prop} = require('ramda');
const {typeLens} = require('./token');

const markupLens = prop('markup');

const isCodeInline = compose(equals('code_inline'), typeLens);

module.exports = {isCodeInline, markupLens};
