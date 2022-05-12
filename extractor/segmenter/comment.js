const {compose, match, view, defaultTo} = require('ramda');

const {
    token: {contentLens},
    comment: {commentRgxp},
} = require('../tokens');
const {secondLens} = require('../common');

const commentBody = compose(defaultTo(''), view(secondLens), match(commentRgxp));

const comment = compose(commentBody, contentLens);

module.exports = {comment, commentBody};
