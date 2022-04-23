/* eslint-disable no-shadow */
const {
    promises: {writeFile, mkdir},
} = require('fs');
const path = require('path');
const composeP = require('@ramda/composep');
const {
    zip,
    length,
    ifElse,
    identity,
    compose,
    transpose,
    map,
    filter,
    flatten,
    test,
} = require('ramda');

const reconstruct = require('../md2xliff-fork/xliff-reconstruct');

const {
    DEBUG,
    logname,
    mdSuffixRgxp,
    sklSuffixRgxp,
    xlfSuffixRgxp,
    mdSuffix,
    sklSuffix,
    xlfSuffix,
    walk,
    readFile,
    logger,
    failed,
    failures,
    successes,
    asyncify,
    stripPath,
    stripFilename,
    flattenResults,
    unwrapPromises,
} = require('./common');

const files = composeP(unwrapPromises, flatten, walk);
const xlfFilenames = composeP(filter(test(xlfSuffixRgxp)), files);
const sklFilenames = composeP(filter(test(sklSuffixRgxp)), files);

const sklStrings = composeP(unwrapPromises, map(readFile('utf8')), sklFilenames);
const xlfStrings = composeP(unwrapPromises, map(readFile('utf8')), xlfFilenames);

const generator = async ([xliff, skeleton, path]) =>
    reconstruct(xliff, skeleton, (err, generated) => {
        if (err && DEBUG) {
            console.error(err);

            return ['', path, true];
        } else if (err) {
            throw err;
        }

        return [generated, path, false];
    });

const assemble = composeP(unwrapPromises, map(generator), asyncify(transpose));

const _folders = async ([md, path, failed]) => {
    await mkdir(stripFilename(path), {recursive: true});

    return [md, path, failed];
};

const folders = ifElse(failed, asyncify(identity), _folders);

const _touch = async ([md, path, failed]) => Promise.all([writeFile(path, md), failed]);

const touch = ifElse(failed, asyncify(identity), _touch);

const write = composeP(unwrapPromises, touch, folders);

const composer = async (input, output) => {
    const inputRgxp = RegExp(`^${input}`, 'g');
    const outputRgxp = RegExp(`^${output}`, 'g');

    const prependInput = (p) => path.join(input, p);
    const prependOutput = (p) => path.join(output, p);

    const outputPath = compose(prependOutput, stripPath(inputRgxp, sklSuffixRgxp));

    const mdFilenames = composeP(map(compose((s) => s + mdSuffix, outputPath)), sklFilenames);

    const jobs = await Promise.all([xlfStrings(input), sklStrings(input), mdFilenames(input)]);

    const go = composeP(unwrapPromises, map(write), assemble);

    const results = await go(jobs);

    const inputPath = compose(prependInput, stripPath(outputRgxp, mdSuffixRgxp));

    const sklPath = compose((s) => s + sklSuffix, inputPath);

    const xlfPath = compose((s) => s + xlfSuffix, inputPath);

    const failedSkl = compose(map(sklPath), flattenResults, failures);

    const failedXlf = compose(map(xlfPath), flattenResults, failures);

    const failedInput = compose(flatten, zip);

    const logPath = path.join(output, logname);
    const logFailures = logger(logPath);

    console.info('composition done');
    console.info('successes:', length(successes(results)));
    console.info('failures:', length(failures(results)));

    if (length(failures(results))) {
        const [xlf, skl] = [failedXlf(results), failedSkl(results)];

        await logFailures(failedInput(xlf, skl));

        console.info('logged failures into:', logPath);
    }
};

module.exports = {
    composer,
};
