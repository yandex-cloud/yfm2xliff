const {compose, split, replace, lensIndex} = require('ramda');

const firstLens = lensIndex(0);
const secondLens = lensIndex(1);

const splitLines = split(/[\n\r]/);

const splitSentences = split(/([^.!?\\]+[.!?]+(?=\s*[A-ZА-ЯЁ]+))/);

const stripPunct = compose(
    // leading non-alphanum
    replace(/^[^a-zA-Zа-яА-ЯёЁ]*/g, ''),
    // trailling non-alphanum
    replace(/[^a-zA-Zа-яА-ЯёЁ]*$/g, ''),
);

module.exports = {splitLines, splitSentences, stripPunct, firstLens, secondLens};
