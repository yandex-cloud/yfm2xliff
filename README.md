# yfm2xliff
helps you translate your [yfm](https://ydocs.tech/en/) files.

## installation
```bash
git clone git@github.com:yandex-cloud/yfm2xliff.git yfm2xliff
cd yfm2xliff
npm install
npm link
```

## usage
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
