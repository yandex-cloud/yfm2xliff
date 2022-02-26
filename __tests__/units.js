const {promises: { readdir, readFile, writeFile }, readdirSync, readFileSync} = require('fs');
const {join} = require('path');
const {compose} = require('ramda');

const {visible} = require('utils.js');
const lexer = require('yfm-transform-fork/lexer.js');
const extract = require('md2xliff-fork/extract.js');

const {cwd} = process;

const inputPath = join(cwd(), 'mock');
const expectedPath = join(cwd(), 'expected');

const logger = data => { console.log(JSON.stringify(data, null, 4)); return data; };

const units = readdirSync(expectedPath).filter(visible);

units.map(compose(xliff, skeleton, data));

function data(name) {
  const sklInputPath = join(inputPath, name, `${name}.skl.md`);
  const xlfInputPath = join(inputPath, name, `${name}.xlf`);
  const mdInputPath = join(inputPath, name, `${name}.md`);
  const input = readFileSync(mdInputPath, 'utf8');

  const xlfExpectedPath = join(expectedPath, name, `${name}.xlf`);
  const xlfExpected = readFileSync(xlfExpectedPath, 'utf8');

  const sklExpectedPath = join(expectedPath, name, `${name}.skl.md`);
  const sklExpected = readFileSync(sklExpectedPath, 'utf8');

  return {
    name,
    input,
    expected: {
      xlf: xlfExpected,
      skl: sklExpected, 
    },
    path: {
      input: {
        md: mdInputPath,
        skl: sklInputPath,
        xlf: xlfInputPath,
      },
      expected: {
        xlf: xlfExpectedPath,
        skl: sklExpectedPath, 
      },
    }
  };
}

function xliff(data) {
  const {name, input, path: {input: {md, skl}}, expected: {xlf}} = data;

  test(`${name} xliff`, () => {
    const {xliff} = extract(input, md, skl, null, null, {lexer});

    expect(xliff).toBe(xlf);
  });

  return data;
};

function skeleton(data) {
  const {name, input, path: {input: {md, skl}}, expected} = data;

  test(`${name} skeleton`, () => {
    const {skeleton} = extract(input, md, skl, null, null, {lexer});

    expect(skeleton).toBe(expected.skl);
  });

  return data;
};
