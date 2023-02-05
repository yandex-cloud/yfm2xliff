const countCollisions = (md) => (texts) => {
    const collisions = {};

    for (const text of texts) {
        let cursor = 0,
            occurences = 0;

        const firstOccurenceIdx = md.indexOf(text, cursor);
        const textLength = text.length;

        while ((cursor = md.indexOf(text, cursor)) > -1) {
            cursor += textLength;
            occurences++;
        }

        if (!(text.startsWith('`') && text.endsWith('`'))) {
            // eslint-disable-next-line no-param-reassign
            md = md.slice(firstOccurenceIdx + textLength);
        }

        if (occurences <= 1) {
            continue;
        }

        collisions[text] = occurences;
    }

    return collisions;
};

module.exports = {
    countCollisions,
};
