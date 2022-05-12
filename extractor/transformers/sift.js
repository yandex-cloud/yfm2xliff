const {
    assoc,
    compose,
    map,
    filter,
    ifElse,
    anyPass,
    allPass,
    equals,
    prop,
    always,
} = require('ramda');

const {
    token: {typeLens, childrenLens},
    types: {allowed},
    text: {isText},
} = require('../tokens');

const isAlpha = (text) => text.toUpperCase() !== text.toLowerCase();

const textAlphaSieve = compose(isAlpha, prop('content'));

const alphaSieve = ifElse(isText, textAlphaSieve, always(true));

const allowedSieve = compose(anyPass(map(equals, allowed)), typeLens);

const sieve = allPass([allowedSieve, alphaSieve]);

const sieveChildren = compose(filter(sieve), childrenLens);

const handler = (token) => assoc('children', sieveChildren(token))(token);

const sift = compose(filter(sieve), map(handler));

module.exports = {sift};
