const {compose, isNil, prop} = require('ramda');

const isLeaf = compose(isNil, prop('children'));

module.exports = {isLeaf};
