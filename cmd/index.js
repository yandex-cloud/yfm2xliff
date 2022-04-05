#!/usr/bin/env node
const yargs = require('yargs/yargs');
const {existsSync} = require('fs');
const {compose, map, anyPass, equals, view, lensProp} = require('ramda');

const {extractor} = require('./extractor');
const {composer} = require('./composer');

const commands = [
  ['compose', 'compose translated markup from xliff'],
  ['extract', 'extract text tokens from markup to xliff'],
];

const options = [
  [['i', 'input'], 'input_dir/'],
  [['o', 'output'], 'output_dir/'],
];

const args = ([executor, name, ...rest]) => rest;

const argv = view(lensProp('argv'));

const setHelp = args =>
  args.help('h')
      .alias('h', 'help');

const setDemands = args =>
  args.demandCommand(1)
      .demandOption(['i', 'o']);

const setExample = ([cmd, desc]) => args =>
  args.example(`$0 ${cmd} ${options[0][0][0]} ${options[0][1]}\
                          ${options[1][0][0]} ${options[1][1]}`, desc);

const setExamples = map(setExample, commands);

const setOption = ([[option, alias], desc]) => args =>
  args
    .alias(option, alias)
    .nargs(option, 1)
    .describe(option, desc);

const setOptions = map(setOption, options);

const setCommand = ([cmd, desc]) => args => args.command(cmd, desc);

const setCommands = map(setCommand, commands);

const isCmdValid = anyPass(map(([cmd]) => equals(cmd), commands));

const validate = (argv) => {
  const {_:[command], input, output, ...rest} = argv;
  
  if (!isCmdValid(command)) {
    console.error(`command: ${command} not supported`);
    process.exit(1);
  }

  if (!existsSync(input)) {
    console.error(`input: ${input} does not exists`);
    process.exit(1);
  }

  return argv;
}

const parser = compose(
  validate,
  argv,
  setHelp,
  setDemands,
  ...setExamples,
  ...setOptions,
  ...setCommands,
  yargs,
  args);

const {_:[command], input, output, ...rest} = parser(process.argv);

switch (command) {
  case 'extract':
    return extractor(input, output);
  case 'compose':
    return composer(input, output);
  default:
    console.error('not implemented');
}
