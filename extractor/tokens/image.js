const {compose, equals} = require('ramda');
const {typeLens} = require('./token');

const isImage = compose(equals('image'), typeLens);

module.exports = {isImage};
