/* eslint-disable security/detect-non-literal-regexp */
const {replace, trim, compose, chain, filter} = require('ramda');
const {sentenize} = require('@doc-tools/sentenizer');

const {splitLines} = require('../common');
const {notEmpty} = require('../../common/predicates');

const {DELIMITERS} = require('./constants');

const leadingDelimitersPattern = `^[${DELIMITERS}]+`;
const leadingDelimitersFlags = 'gmu';
const leadingDelimitersRegExp = new RegExp(leadingDelimitersPattern, leadingDelimitersFlags);

const trimLeadingDelimiters = replace(leadingDelimitersRegExp, '');

const sentences = compose(
    filter(notEmpty),
    chain(trim),
    chain(sentenize),
    chain(trimLeadingDelimiters),
    chain(splitLines),
);

module.exports = {
    sentences,
};
