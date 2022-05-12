const {compose, flatten, filter, values, equals, type} = require('ramda');

const {lift} = require('../../common/transformers');
const {
    text: {text},
} = require('../tokens');

const recurse = compose(flatten, filter(Boolean), values);
const predicate = compose(equals('String'), type);
const token = (meta) => text({content: meta});

const meta = lift(predicate)(recurse)(token);

module.exports = {meta};
