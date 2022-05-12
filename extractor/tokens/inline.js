const {compose, equals} = require('ramda');
const {typeLens} = require('./token');

const isInline = compose(equals('inline'), typeLens);

module.exports = {isInline};
