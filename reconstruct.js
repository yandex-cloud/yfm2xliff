const {promises: {readdir, readFile, writeFile, mkdir}} = require('fs');
const {join} = require('path');
const composeP = require('@ramda/composep');

const {visible} = require('./utils.js');
const reconstruct = require('./md2xliff-fork/xliff-reconstruct.js');

const inputPath = join(process.cwd(), 'mock');

const outputPath = join(process.cwd(), 'translated');

const main = async () => {
  const units = (await readdir(inputPath)).filter(visible);

  const process = composeP(write, compose, read);

  await Promise.all(units.map(process));
}

const read = async (name) => {
  const md = join(outputPath, name, `${name}.md`);
  const skl = join(inputPath, name, `${name}.skl.md`);
  const xlf = join(inputPath, name, `${name}.xlf`);
  
  const [xliff, skeleton] = await Promise.all([
    readFile(xlf, 'utf8'),
    readFile(skl, 'utf8'),
  ]);

  return {
    data: {
      xliff,
      skeleton,
    },
    path: {
      md,
    }
  };
}

const compose = async ({data:{xliff, skeleton}, path}) =>
  reconstruct(xliff, skeleton, (ctx, reconstructed) => ({
    data: {
      md: reconstructed,
      xliff,
      skeleton,
    },
    path,
  }));

const _mkdir = async ({data, path}) => {
  const folder = path.md.slice(0, path.md.lastIndexOf('/'));

  await mkdir(folder, {recursive: true});

  return {data, path};
}

const _writeFile = async ({data, path}) =>
  await writeFile(path.md, data.md);

const write = composeP(_writeFile, _mkdir);

main();
