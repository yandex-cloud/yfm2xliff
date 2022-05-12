const {compose, juxt, join} = require('ramda');
const {
    codeInline: {markupLens},
    token: {contentLens},
} = require('../tokens');

const codeInline = compose(join(''), juxt([markupLens, contentLens, markupLens]));

module.exports = {codeInline};
