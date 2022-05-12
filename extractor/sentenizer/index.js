const {trim, compose, chain, filter} = require('ramda');
const {splitLines, splitSentences} = require('../common');
const {notEmpty} = require('../../common/predicates');

const sentences = compose(filter(notEmpty), chain(trim), chain(splitSentences), chain(splitLines));

module.exports = {
    sentences,
};
