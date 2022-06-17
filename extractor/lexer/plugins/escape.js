'use strict';

function isSpace(code) {
    switch (code) {
        case 0x09:
        case 0x20:
            return true;
    }
    return false;
}

const ESCAPED = [];

for (let i = 0; i < 256; i++) {
    ESCAPED.push(0);
}

'!"#$%&\'()*+,./:;<=>?@[]^_`{|}~-'.split('').forEach(function (ch) {
    ESCAPED[ch.charCodeAt(0)] = 1;
});

module.exports = function escape(state, silent) {
    let ch,
        pos = state.pos,
        max = state.posMax;

    if (state.src.charCodeAt(pos) !== 0x5c /* \ */) {
        return false;
    }

    pos++;

    if (pos < max) {
        ch = state.src.charCodeAt(pos);

        if (ch < 256 && ESCAPED[ch] !== 0) {
            if (!silent) {
                state.pending += String.fromCharCode(0x5c) + state.src[pos];
            }

            state.pos += 2;
            return true;
        }

        if (ch === 0x0a) {
            if (!silent) {
                state.push('hardbreak', 'br', 0);
            }

            pos++;

            // skip leading whitespaces
            while (pos < max) {
                ch = state.src.charCodeAt(pos);
                if (!isSpace(ch)) {
                    break;
                }
                pos++;
            }

            state.pos = pos;
            return true;
        }
    }

    if (!silent) {
        state.pending += '\\';
    }
    state.pos++;
    return true;
};
