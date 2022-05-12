/* eslint-disable no-shadow */
const {compose, map, filter, not, addIndex, prop} = require('ramda');
const escapeHTML = require('escape-html');

const mapi = addIndex(map);

const replaceAfter = (str, idx, src, replaceFn) =>
    str.slice(0, idx) + str.slice(idx).replace(src, replaceFn);

const hash = (id) => `%%%${id}%%%`;

const skeletonUnits = (sentences) => {
    let skipped = 0;

    const unit = (sentence, id) => {
        const skip = sentence.startsWith('`') && sentence.endsWith('`');
        skipped = skip ? skipped + 1 : skipped;

        return {
            id: id + 1 - skipped,
            content: sentence,
            skip,
        };
    };

    return mapi(unit)(sentences);
};

const skeleton = (markdown) => (sentences) => {
    const units = skeletonUnits(sentences);

    let skeleton = markdown;
    let offset = 0;

    for (const {content, id, skip} of units) {
        const replacement = hash.bind(this, id);
        const next = skip ? skeleton : replaceAfter(skeleton, offset, content, replacement);

        offset = skip ? next.indexOf(content) + content.length : offset;
        skeleton = next;
    }

    return skeleton;
};

/*
 *  const languages = ['ru-RU', 'en-EN'] as const
 *  type Language = typeof languages[number]
 *
 *  type Template = {
 *    source: {
 *      lang: Language
 *    },
 *    target: {
 *      lang: Language
 *    }
 *  }
 *
 */
const units = (template) => (sentences) => {
    const keep = compose(not, prop('skip'));

    const unit = ({content, id}) => ({
        id,
        source: {
            content: escapeHTML(content),
            lang: template.source.lang,
        },
        target: {
            lang: template.target.lang,
        },
    });

    const pipeline = compose(map(unit), filter(keep), skeletonUnits);

    return pipeline(sentences);
};

module.exports = {
    skeleton,
    units,
};
