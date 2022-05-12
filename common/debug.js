const {tap, bind, compose} = require('ramda');

const log = bind(console.log, console);

const stringify = bind(JSON.stringify, JSON);

const prettify = (data, spacing = 4) => stringify(data, null, spacing);

const logger = tap(compose(log, prettify));

module.exports = {
    logger,
    stringify,
};
