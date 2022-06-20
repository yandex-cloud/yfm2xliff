const {readdirSync, readFileSync} = require('fs');
const {join} = require('path');
const {compose, map, filter} = require('ramda');

const {fileVisible} = require('../../common/filters.js');
const {extract} = require('extractor');
const {hcl} = require('../../vendor/hcl');
const {defaultPlugins, extraPlugins} = require('../../extractor/lexer');

const plugins = [...defaultPlugins, ...extraPlugins];

const {cwd} = process;

const inputPath = join(cwd(), '__tests__/extract/data/input');
const expectedPath = join(cwd(), '__tests__/extract/data/expected');

const folders = compose(filter(fileVisible), readdirSync);
const pipeline = compose(getXliff, getSkeleton, getData);
const tests = compose(map(pipeline), folders);

tests(expectedPath);

function getData(name) {
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
        },
    };
}

function getXliff(data) {
    const {
        name,
        input,
        path: {
            input: {md, skl},
        },
        expected: {xlf},
    } = data;

    test(`${name} xliff`, async () => {
        const params = {
            options: {
                plugins,
                highlightLangs: {
                    hcl,
                },
            },
            md: input,
            mdPath: md,
            sklPath: skl,
        };

        const {xliff} = await extract(params);

        expect(xliff).toBe(xlf);
    });

    return data;
}

function getSkeleton(data) {
    const {
        name,
        input,
        path: {
            input: {md, skl},
        },
        expected,
    } = data;

    test(`${name} skeleton`, async () => {
        const params = {
            options: {
                plugins,
                highlightLangs: {
                    hcl,
                },
            },
            md: input,
            md: input,
            mdPath: md,
            sklPath: skl,
        };

        const {skeleton} = await extract(params);

        expect(skeleton).toBe(expected.skl);
    });

    return data;
}
