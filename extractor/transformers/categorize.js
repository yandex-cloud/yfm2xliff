const {map, cond, always, identity} = require('ramda');

const {
    text: {isText},
    comment: {isComment, comment},
} = require('../tokens');

const text = cond([
    [isComment, comment],
    [always(true), identity],
]);

const token = cond([
    [isText, text],
    [always(true), identity],
]);

const categorize = map(token);

module.exports = {
    categorize,
};
