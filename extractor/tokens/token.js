const {compose, defaultTo, prop} = require('ramda');

const childrenLens = compose(defaultTo([]), prop('children'));

const contentLens = prop('content');

const typeLens = prop('type');

const attrsLens = compose(defaultTo([]), prop('attrs'));

module.exports = {childrenLens, typeLens, contentLens, attrsLens};
