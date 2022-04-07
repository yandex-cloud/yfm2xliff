const {promises: {writeFile, mkdir}} = require('fs');
const {join} = require('path');
const composeP = require('@ramda/composep');
const {
  identity,
  isEmpty,
  ifElse,
  filter,
  compose,
  map,
  flatten,
  test,
  transpose,
  replace,
  tryCatch,
} = require('ramda');

const extract = require('../md2xliff-fork/extract');
const lexer = require('../yfm-transform-fork/lexer');

const {
  walk,
  readFile,
  failures,
  successes,
  stripFilename,
  unwrapPromises,
  asyncify
} = require('./common');

const mdSuffixRgxp = /(?<!\.skl)\.md$/g;
const sklSuffixRgxp = /\.skl\.md$/g;

const sklSuffix = '.skl.md';
const xlfSuffix = '.xlf';

const mdFilenames = composeP(unwrapPromises, filter(test(mdSuffixRgxp)), flatten, walk);
const mdStrings = composeP(unwrapPromises, map(readFile('utf8')), mdFilenames);

const xliff = async ([input, md, skl, xlf]) => {
  const errorHandler = (err, val) => {
    console.error('xliff extractor failure');
    console.error('error:', err);
    console.error('file:', md);
    console.error(val);

    return {xliff: '', skeleton: ''};
  };

  const wrapped = tryCatch(extract, errorHandler);

  const {xliff, skeleton} = wrapped(input, md, skl, null, null, {lexer});

  return [xliff, skeleton, xlf, skl];
}

const xliffs = composeP(unwrapPromises, map(xliff), asyncify(transpose));

const xliffNotParsed = ([xliff]) => isEmpty(xliff);

const _files = async ([xliff, skeleton, xlf, skl]) =>
  Promise.all([writeFile(xlf, xliff), writeFile(skl, skeleton)]);

const files = ifElse(
  xliffNotParsed,
  asyncify(identity),
  _files,
);

const _folders = async ([xliff, skeleton, xlf, skl]) => {
  await mkdir(stripFilename(xlf), {recursive: true});

  return [xliff, skeleton, xlf, skl];
}

const folders = ifElse(
  xliffNotParsed,
  asyncify(identity),
  _folders,
);

const write = composeP(unwrapPromises, files, folders);

const extractor = async (input, output) => {
  const inputRgxp = RegExp(`^${input}`, 'g'); 

  const prependOutput = p => join(output, p);

  const sklFilenames = composeP(
    unwrapPromises,
    map(compose(
      replace(mdSuffixRgxp, sklSuffix),
      prependOutput,
      replace(inputRgxp, ''))),
    mdFilenames);

  const xlfFilenames = composeP(
    map(replace(sklSuffixRgxp, xlfSuffix)),
    sklFilenames);

  const jobs = await Promise.all([
    mdStrings(input),
    mdFilenames(input),
    sklFilenames(input),
    xlfFilenames(input)]);

  const go = composeP(flatten, unwrapPromises, map(write), xliffs);

  const results = await go(jobs);
 
  console.info('extraction done');
  console.info('successes:', successes(results));
  console.info('failures:', failures(results));
}

module.exports = {
  extractor,
}
