const {compose, equals, prop, assoc} = require('ramda');

const {typeLens} = require('./token');

const langLens = prop('info');

const isFence = compose(equals('fence'), typeLens);

const fence = (token) => assoc('info', (token.info ?? '').trim())(token);

module.exports = {isFence, langLens, fence};
