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
const images = require('@doc-tools/transform/lib/plugins/images');
const includes = require('@doc-tools/transform/lib/plugins/includes');
// todo: investigate appropriate plugin usage
//       although resolving links are not really needed here >.<
// const links = require('@doc-tools/transform/lib/plugins/links');

const sub = require('markdown-it-sub');
const ins = require('markdown-it-ins');
const foot = require('markdown-it-footnote');
const checkbox = require('markdown-it-checkbox');

const defaultPlugins = [
    meta,
    deflist,
    includes,
    cut,
    // links,
    images,
    notes,
    anchors,
    tabs,
    code,
    imsize,
    sup,
    video,
    monospace,
    table,
];

const extraPlugins = [sub, ins, foot, checkbox];

module.exports = {defaultPlugins, extraPlugins};
