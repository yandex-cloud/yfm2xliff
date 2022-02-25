const {promises: {readdir, readFile, writeFile}} = require('fs');
const {join} = require('path');

const {compose, not} = require('ramda');
const composeP = require('@ramda/composep');

const lexer = require('./yfm-transform-fork/lexer.js');
const extractor = require('./md2xliff-fork/extract.js');

const inputPath = join(process.cwd(), 'mock');

const main = async () => {
  const units = (await readdir(inputPath)).filter(visible);

  const process = composeP(write, extract, read);

  await Promise.all(units.map(process));
}

const hidden = path => (/(^|\/)\.[^\/\.]/g).test(path);

const visible = compose(not, hidden);

const read = async (name) => {
  const md = join(inputPath, name, `${name}.md`);
  const skl = join(inputPath, name, `${name}.skl.md`);
  const xlf = join(inputPath, name, `${name}.xlf`);
  
  const input = await readFile(md, 'utf8');

  return {
    input,
    path: {
      md,
      skl,
      xlf,
    }
  };
}

const extract = async ({input, path:{md, skl, xlf}}) => {
  const {xliff, skeleton} = extractor(input, md, skl, null, null, {lexer});

  return {
    input: {
      xliff,
      skeleton,
    },
    path: {
      skl,
      xlf,
    }
  };
}

const write = async ({input: {xliff, skeleton}, path: {skl, xlf}}) =>
  Promise.all([writeFile(skl, skeleton), writeFile(xlf, xliff)]);

main();
