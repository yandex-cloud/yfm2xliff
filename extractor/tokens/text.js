const {compose, equals, assoc} = require('ramda');
const {typeLens} = require('./token');

const isText = compose(equals('text'), typeLens);

const text = assoc('type', 'text');

module.exports = {isText, text};
