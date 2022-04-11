const {promises: {writeFile, mkdir, readdir, lstat}} = require('fs');
const {join} = require('path');
const composeP = require('@ramda/composep');
const {
  length,
  ifElse,
  isEmpty,
  isNil,
  identity,
  compose,
  transpose,
  map,
  filter,
  flatten,
  test,
  replace
} = require('ramda');

const reconstruct = require('../md2xliff-fork/xliff-reconstruct');

const {
  walk,
  readFile,
  failures,
  successes,
  asyncify,
  stripFilename,
  unwrapPromises,
} = require('./common');

const xlfSuffixRgxp = /\.xlf$/g;
const sklSuffixRgxp = /\.skl\.md$/g;

const mdSuffix = '.md';

const files = composeP(unwrapPromises, flatten, walk);
const xlfFilenames = composeP(filter(test(xlfSuffixRgxp)), files);
const sklFilenames = composeP(filter(test(sklSuffixRgxp)), files);

const sklStrings = composeP(unwrapPromises, map(readFile('utf8')), sklFilenames);
const xlfStrings = composeP(unwrapPromises, map(readFile('utf8')), xlfFilenames);

const generator = async ([xliff, skeleton, path]) =>
  reconstruct(xliff, skeleton, (ctx, reconstructed) => [reconstructed, path]);

const assemble = composeP(unwrapPromises, map(generator), asyncify(transpose));

const notAssembled = ([md]) => isEmpty(md);

const _folders = async ([md, path]) => {
  await mkdir(stripFilename(path), {recursive: true});

  return [md, path];
}

const folders = ifElse(
  notAssembled,
  asyncify(identity),
  _folders,
);

const _touch = async ([md, path]) => writeFile(path, md);

const touch = ifElse(
  notAssembled,
  asyncify(identity),
  _touch,
);

const write = composeP(touch, folders);

const composer = async (input, output) => {
  const inputRgxp = RegExp(`^${input}`, 'g'); 

  const prependOutput = p => join(output, p);

  const mdFilenames = composeP(
    map(compose(
      replace(sklSuffixRgxp, mdSuffix),
      prependOutput,
      replace(inputRgxp, ''))),
    sklFilenames);

  const jobs = await Promise.all([
    xlfStrings(input),
    sklStrings(input),
    mdFilenames(input),
  ]);

  const go = composeP(flatten, unwrapPromises, map(write), assemble);

  const results = await go(jobs);

  console.info('composition done');
  console.info('successes:', successes(results));
  console.info('failures:', failures(results));
}

module.exports = {
  composer,
}
