const {bold} = require('chalk');
const MDParser = require('markdown-it');
const attrs = require('markdown-it-attrs');

const escape = require('./plugins/escape');
const log = require('./log');
const {defaultPlugins, extraPlugins} = require('./constants');

const lexer = (options) => (input) => {
    const {
        path = '',
        extractTitle: extractTitleOption,
        disableLiquid = true,
        allowHTML = true,
        linkify = false,
        leftDelimiter = '{',
        rightDelimiter = '}',
        breaks = true,
        vars = {},
        plugins = defaultPlugins,
        ...customOptions
    } = options ?? {};

    const pluginOptions = {
        ...customOptions,
        extractTitle: extractTitleOption,
        disableLiquid,
        path,
        vars,
        log,
    };

    const parser = new MDParser({html: allowHTML, linkify, breaks});

    parser.use(attrs, {leftDelimiter, rightDelimiter});

    for (const plugin of plugins) parser.use(plugin, pluginOptions);

    parser.inline.ruler.at('escape', escape);

    try {
        const env = {};
        return {markup: parser.parse(input, env), meta: parser.meta};
    } catch (err) {
        log.error(`Error occurred${path ? ` in ${bold(path)}` : ''}`);

        throw err;
    }
};

module.exports = {
    lexer,
    defaultPlugins,
    extraPlugins,
};
