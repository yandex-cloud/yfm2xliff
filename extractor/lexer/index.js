const {bold} = require('chalk');
const MDParser = require('markdown-it');

// base plugins
const meta = require('@doc-tools/transform/lib/plugins/meta');
const deflist = require('@doc-tools/transform/lib/plugins/deflist');
const cut = require('@doc-tools/transform/lib/plugins/cut');
const notes = require('@doc-tools/transform/lib/plugins/notes');
const anchors = require('@doc-tools/transform/lib/plugins/anchors');
const tabs = require('@doc-tools/transform/lib/plugins/tabs');
const code = require('@doc-tools/transform/lib/plugins/code');
const imsize = require('@doc-tools/transform/lib/plugins/imsize');
const sup = require('@doc-tools/transform/lib/plugins/sup');
const video = require('@doc-tools/transform/lib/plugins/video');
const monospace = require('@doc-tools/transform/lib/plugins/monospace');
const table = require('@doc-tools/transform/lib/plugins/table');
const attrs = require('markdown-it-attrs');

// custom plugins
const escape = require('./plugins/escape');
const log = require('./log');

const lexer = (options) => (input) => {
    const {
        path,
        extractTitle: extractTitleOption,
        disableLiquid = true,
        allowHTML = true,
        linkify = false,
        leftDelimiter = '{',
        rightDelimiter = '}',
        breaks = true,
        vars = {},
        plugins = [
            meta,
            deflist,
            cut,
            notes,
            anchors,
            tabs,
            code,
            imsize,
            sup,
            video,
            monospace,
            table,
        ],
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
    lexer: lexer,
};
