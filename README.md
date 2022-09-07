# yfm2xliff
helps you translate your [yfm](https://ydocs.tech/en/) files.

## installation library
```bash
npm install @doc-tools/yfm2xliff --save
```

```typescript
const {compose, extract} = require('@doc-tools/yfm2xliff');
```

## installation cli
```bash
git clone git@github.com:yandex-cloud/yfm2xliff.git yfm2xliff
cd yfm2xliff
npm install
npm link
```

## dependencies
library has peer dependency `@doc-tools/transform`

```
npm install @doc-tools/transform
```

## usage library

### api

note: types are provided for educational purposes, there is no typings available for the library for now.

#### extract

```typescript
type ExtractParameters = {
  // source string in the format language-LOCALE, example: ru-RU, en-US
  source: string;
  // target string in the format language-LOCALE, example ru-RU, en-US
  target: string;
  // input yfm/markdown string to extract text segments from
  md: string;
  // path to the markdown markdown string comes from, note: crucial for valid xliff file generation
  mdPath: string;
  // path to where generated skeleton file will be stored(by you), note: crucial for valid xliff file generation
  sklPath: string
  // options to pass to yfm-transform
  options: {
    // array of yfm-transform plugins
    plugings: [];
    ...
  }
}

type ExtractOutput = {
  skeleton: string;
  xliff: string;
  data: {
    // see Parameters.mdPath
    markdownFileName: string;
    // see Parameters.sklPath
    skeletonFilename: string;
    // see Paramters.source
    srcLang: string;
    // see Parameters.target
    trgLang: string;
    // extracted text segments
    units: string[]
  }
}

extract(ExtractParameters) => ExtractOutput
```

#### compose

```typescript
// xliff file string
type Xliff = string;

// skeleton file string
type Skeleton = string;

// callback function which will recieve results in the form of the composed markdown/yfm file string
type CallBack = <T>(err: Error, generated: ComposeOutput) => CallBackOutput

// callback function output
type CallbackOutput = any;

compose(xliff: Xliff, skeleton: Skeleton, cb: CallBack) => CallbackOutput
```

### example

#### extract

refer to [cli extractor](cmd/extractor.js), [extract tests](__tests__/extract/units.js) for usage examples.

#### compose

refer to [cli composer](cmd/composer.js) for usage example.

## usage cli
supports:
  * extraction of the text tokens from markup to the xliff format.
  * their composition in the translated markup document.

### environment variables
supported by all commands

* `DEBUG` - enables failures logging to the filesystem
            `output_dir/.yfm2xliff.failures.log`.
            continues to `extract/compose` even if some failures occured in the process.

### commands
* extract
* compose

#### extract
extract text tokens for translation from all of the markup files inside the given directory into xliff.

##### options
* -i/input - input directory to get markup files from
* -o/output - output directory to persist extracted tokens in the xliff format (preserves original file path)

##### example
```bash
yfm2xliff extract -i cloud-docs/ru -o cloud-docs-extracted
```

#### compose
compose translated text units from all of the xliff files inside the given directory into translated markup.

##### environment variables
* `USE_SOURCE` - uses originally extracted text tokens instead of the translated ones, thus giving you original non translated markup.

##### options
* -i/input - input directory to get translated units from xliff files.
* -o/output - output directory to persist translated markup (preserves original file path)

##### example
```
yfm2xliff compose -i cloud-docs-extracted -o cloud-docs-translated
```
