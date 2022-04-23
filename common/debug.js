const {bind, compose} = require('ramda');

const log = bind(console.log, console);

const stringify = bind(JSON.stringify, JSON);

const prettify = (data, spacing = 4) => stringify(data, null, spacing);

const logger = compose(log, prettify);

module.exports = {
    logger,
};
