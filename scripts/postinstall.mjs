import {promises} from 'fs';
import {join} from 'path';
import {render} from './template.js';

const {readdir, readFile, writeFile} = promises;

const EXPECTED_DIRNAME = 'expected';

console.info('bootstrapping mock data...');

const CWD = process.cwd();

const expectedpath = join(CWD, EXPECTED_DIRNAME);

const expectedlist = await readdir(expectedpath);

const templates = await Promise.all(
  expectedlist.map(name =>
    readFile(join(expectedpath, name, `${name}.xlf.template`), 'utf8')));

const replaced = templates.map(template => render(template, {root: CWD}));

await Promise.all(expectedlist.map((name, i) =>
  writeFile(join(expectedpath, name, `${name}.xlf`), replaced[i])));

console.info('mock data ready');
