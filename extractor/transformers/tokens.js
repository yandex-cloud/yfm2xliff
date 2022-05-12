const {compose} = require('ramda');

const {note} = require('./note');
const {inline} = require('./inline');
const {flatten} = require('./flatten');
const {categorize} = require('./categorize');
const {sift} = require('./sift');

const tokens = compose(sift, categorize, flatten, inline, note);

module.exports = {
    tokens,
};
