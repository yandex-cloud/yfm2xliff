import {promises} from 'fs';
import {join} from 'path';
import {render} from './template.js';
import {fileVisible} from '../common/filters.js';
import {promiseAll, composeP} from '../common/promises.js';
import {zip, curry, filter, map, compose, flip} from 'ramda';

const {readdir, readFile, writeFile} = promises;

const {cwd} = process;
const inputPath = join(cwd(), '__tests__/extract/data/input');
const expectedPath = join(cwd(), '__tests__/extract/data/expected');

console.info('bootstrapping mock data...');

const templateFilepath = (name) => join(expectedPath, name, `${name}.xlf.template`);
const replacedFilepath = (name) => join(expectedPath, name, `${name}.xlf`);

const renderer = curry(flip(render))({input: inputPath});
const reader = flip(readFile)('utf8');
const writer = compose(
    ([content, path]) => writeFile(path, content),
    ([content, name]) => [content, replacedFilepath(name)],
);

const folders = composeP(filter(fileVisible), readdir);
const templates = composeP(promiseAll, map(reader), map(templateFilepath), folders);
const expected = composeP(map(renderer), templates);

const [replaced, names] = await Promise.all([expected(expectedPath), folders(expectedPath)]);

const go = composeP(promiseAll, map(writer), zip);

await go(replaced, names);

console.info('mock data ready');
