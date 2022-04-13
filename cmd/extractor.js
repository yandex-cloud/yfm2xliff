const {promises: {writeFile, mkdir}} = require('fs');
const path = require('path');
const composeP = require('@ramda/composep');
const {
  transpose,
  flatten,
  map,
  filter,
  compose,
  length,
  identity,
  ifElse,
  test,
  replace,
  tryCatch,
} = require('ramda');

const extract = require('../md2xliff-fork/extract');
const lexer = require('../yfm-transform-fork/lexer');

const {
  DEBUG,
  logname,
  mdSuffixRgxp,
  sklSuffixRgxp,
  sklSuffix,
  xlfSuffix,
  mdSuffix,
  failed,
  flattenResults,
  walk,
  readFile,
  writeTo,
  logger,
  failures,
  successes,
  stripPath,
  stripFilename,
  unwrapPromises,
  asyncify
} = require('./common');

const mdFilenames = composeP(unwrapPromises, filter(test(mdSuffixRgxp)), flatten, walk);
const mdStrings = composeP(unwrapPromises, map(readFile('utf8')), mdFilenames);

const xliff = async ([input, md, skl, xlf, failed]) => {
  const errorHandler = (err, val) => {
    const message = `xliff extractor failure\n` +
                    `error: ${err}\n` +
                    `file: ${md}\n`;

    if (DEBUG) {
      console.error(message);
    } else {
      throw new Error(message);
    }

    return {xliff: '', skeleton: ''};
  };

  const wrapped = tryCatch(extract, errorHandler);

  const {xliff, skeleton} = wrapped(input, md, skl, null, null, {lexer});

  return [xliff, skeleton, xlf, skl, !length(xliff)];
}

const xliffs = composeP(unwrapPromises, map(xliff), asyncify(transpose));

const _files = async ([xliff, skeleton, xlf, skl, state]) =>
  Promise.all([writeFile(xlf, xliff), writeFile(skl, skeleton), state]);

const files = ifElse(
  failed,
  asyncify(identity),
  _files,
);

const _folders = async ([xliff, skeleton, xlf, skl, state]) => {
  await mkdir(stripFilename(xlf), {recursive: true});

  return [xliff, skeleton, xlf, skl, state];
}

const folders = ifElse(
  failed,
  asyncify(identity),
  _folders,
);

const write = composeP(unwrapPromises, files, folders);

const extractor = async (input, output) => {
  const inputRgxp = RegExp(`^${input}`, 'g'); 
  const outputRgxp = RegExp(`^${output}`, 'g'); 

  const prependOutput = p => path.join(output, p);
  const prependInput = p => path.join(input, p);

  const outputPath = compose(
    prependOutput,
    stripPath(inputRgxp, mdSuffixRgxp));

  const sklPath = compose(
    s => s + sklSuffix,
    outputPath,
  );

  const sklFilenames = composeP(
    unwrapPromises,
    map(sklPath),
    mdFilenames);

  const xlfPath = compose(
    s => s + xlfSuffix,
    outputPath);

  const xlfFilenames = composeP(
    map(xlfPath),
    mdFilenames);

  const jobs = await Promise.all([
    mdStrings(input),
    mdFilenames(input),
    sklFilenames(input),
    xlfFilenames(input)]);

  const go = composeP(unwrapPromises, map(write), xliffs);
  
  const results = await go(jobs);
  
  const inputPath = compose(
    s => s + mdSuffix,
    prependInput,
    stripPath(outputRgxp, sklSuffixRgxp),
  );

  const failedInput = compose(
    map(inputPath),
    flattenResults,
    failures,
  );

  const logPath = path.join(output, logname);
  const logFailures = logger(logPath);

  console.info('extraction done');
  console.info('successes:', length(successes(results)));
  console.info('failures:', length(failures(results)));

  if (length(failures(results))) {
    await logFailures(failedInput(results));

    console.info('logged failures into:', logPath);

    return; 
  }

  await writeTo(logPath, '');
}

module.exports = {
  extractor,
}
