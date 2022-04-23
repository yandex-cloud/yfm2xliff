/* eslint-disable no-shadow */
const {
    promises: {writeFile, mkdir, readFile, readdir, lstat},
} = require('fs');
const path = require('path');
const composeP = require('@ramda/composep');
const {
    replace,
    flatten,
    dropLast,
    join,
    takeLast,
    endsWith,
    compose,
    filter,
    concat,
    map,
    addIndex,
    invoker,
    curry,
    flip,
    bind,
} = require('ramda');

const DEBUG = process.env.DEBUG;

const logname = '.yfm2xliff.failures.log';

// eslint-disable-next-line
const mdSuffixRgxp = /(?<!\.skl)\.md$/g;
const xlfSuffixRgxp = /\.xlf$/g;
const sklSuffixRgxp = /\.skl\.md$/g;

const sklSuffix = '.skl.md';
const xlfSuffix = '.xlf';
const mdSuffix = '.md';

const read = compose(curry, flip)(readFile);

const {fileVisible} = require('../common/filters');

const filterIndexed = addIndex(filter);

const unwrapPromises = bind(Promise.all, Promise);

const asyncify = (fn) => compose(bind(Promise.resolve, Promise), fn);

const isdir = compose(asyncify, invoker)(0, 'isDirectory');

const walk = async (dir) => {
    const prependDir = (p) => path.join(dir, p);

    const ls = composeP(unwrapPromises, map(prependDir), filter(fileVisible), readdir);

    const list = await ls(dir);

    const dirmap = await Promise.all(map(composeP(isdir, lstat), list));

    const isFile = (e, i) => !dirmap[i];

    const isDir = (e, i) => dirmap[i];

    const directories = compose(filterIndexed(isDir));

    const files = compose(filterIndexed(isFile));

    const go = compose(unwrapPromises, concat(files(list)), map(walk), directories);

    return go(list);
};

const stripFilename = (path) => path.slice(0, path.lastIndexOf('/'));

const stripPath = (prefixRgxp, suffixRgxp) =>
    compose(replace(prefixRgxp, ''), replace(suffixRgxp, ''));

const flattenResults = compose(flatten, map(dropLast(1)));

const failures = compose(filter(endsWith([true])), map(takeLast(2)));
const successes = compose(filter(endsWith([false])), map(takeLast(2)));

const writeTo = async (filepath, content) => {
    const path = stripFilename(filepath);

    await mkdir(path, {recursive: true});
    await writeFile(filepath, content);

    return true;
};

const failed = endsWith([true]);

const logger = (path) => compose(curry(writeTo)(path), join('\n'));

module.exports = {
    readFile: read,
    DEBUG,
    logname,
    mdSuffixRgxp,
    sklSuffixRgxp,
    xlfSuffixRgxp,
    mdSuffix,
    sklSuffix,
    xlfSuffix,
    writeTo,
    failed,
    flattenResults,
    failures,
    successes,
    logger,
    stripFilename,
    stripPath,
    walk,
    unwrapPromises,
    asyncify,
};
