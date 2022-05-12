const {compose, equals} = require('ramda');
const {typeLens} = require('./token');

const isHTML = compose(equals('html_block'), typeLens);

module.exports = {isHTML};
