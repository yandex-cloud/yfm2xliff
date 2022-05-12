const {map, compose, modify, allPass, has, both, all, ifElse, values} = require('ramda');

const xliffSerialize = require('../md2xliff-fork/xliff-serialize.js');
const {notNil} = require('../common/predicates');
const {preprocess, normalize} = require('./preprocessor');
const transformers = require('./transformers');
const {segments} = require('./segmenter');
const {sentences} = require('./sentenizer');
const generator = require('./generator');

const argNames = ['md', 'mdPath', 'sklPath', 'lexer'];

const paramsValid = both(allPass(map(has, argNames)), compose(all(notNil), values));

const implicitArgs = (args) => ({source: 'ru-RU', target: 'en-US', md: '', options: {}, ...args});

const tokenize = (lexer, options) => lexer(options);

const merge = ({meta, markup}) => [...meta, ...markup];

const transform = compose(
    merge,
    modify('markup', transformers.tokens),
    modify('meta', transformers.meta),
);

const extract = async (args) => {
    const {md, mdPath, sklPath, source, target, lexer, options} = implicitArgs(args);

    const units = generator.units({source: {lang: source}, target: {lang: target}});

    const skeleton = compose(generator.skeleton, normalize);

    const pipeline = compose(sentences, segments, transform, tokenize(lexer, options), preprocess);

    const sentences_ = pipeline(md);

    const data = {
        markdownFileName: mdPath,
        skeletonFilename: sklPath,
        srcLang: source,
        trgLang: target,
        units: units(sentences_),
    };

    return {
        skeleton: skeleton(md)(sentences_),
        xliff: xliffSerialize(data),
        data: data,
    };
};

const guard = ifElse(paramsValid, extract, (args) => {
    console.error(args);

    throw new Error('invalid arguments');
});

module.exports = {
    extract: guard,
};
