const {promises: {readFile, readdir, lstat}} = require('fs');
const {join} = require('path');
const composeP = require('@ramda/composep');
const {
  length,
  isNil,
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

const read = compose(curry, flip)(readFile);

const {visible} = require('../utils');

const filterIndexed = addIndex(filter);

const unwrapPromises = bind(Promise.all, Promise);

const asyncify = fn => compose(bind(Promise.resolve, Promise), fn);

const isdir = compose(asyncify, invoker)(0, 'isDirectory');

const walk = async (dir) => {
  const prependDir = p => join(dir, p);

  const ls = composeP(unwrapPromises, map(prependDir), filter(visible), readdir);

  const list = await ls(dir);

  const dirmap = await Promise.all(map(composeP(isdir, lstat), list));

  const isFile = (e, i) => !dirmap[i];

  const isDir = (e, i) => dirmap[i];

  const directories = compose(filterIndexed(isDir));

  const files = compose(filterIndexed(isFile));

  const go = compose(unwrapPromises, concat(files(list)), map(walk), directories);

  return go(list);
}

const stripFilename = path => path.slice(0, path.lastIndexOf('/'));

const failures = compose(length, filter(Boolean)); 
const successes = compose(length, filter(isNil));

module.exports = {
  readFile: read,
  stripFilename,
  walk,
  unwrapPromises,
  asyncify,
  failures,
  successes,
};
