const {compose, not, isNil, isEmpty} = require('ramda');

const notNil = compose(not, isNil);
const notEmpty = compose(not, isEmpty);

module.exports = {
    notNil,
    notEmpty,
};
