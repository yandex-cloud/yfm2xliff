/* eslint-disable no-return-assign, no-shadow */
const {map, equals, cond, always, compose, identity, invoker, tap} = require('ramda');
const {notNil} = require('../../common/predicates');
const {
    token: {typeLens},
    note: {title},
} = require('../tokens');

let noteTitle = null;

const isOpen = compose(equals('yfm_note_title_open'), typeLens);

const isInside = () => notNil(noteTitle);

const isClose = compose(equals('yfm_note_title_close'), typeLens);

const open = (token) => (noteTitle = title(token)) && null;

const inside = (token) => noteTitle.children.push(token) && null;

const attrGet = invoker(1, 'attrGet');

const close = () => {
    const effect = tap(() => (noteTitle = null));

    const title = cond([
        [attrGet('yfm2xliff-explicit'), identity],
        [always(true), always(null)],
    ]);

    const go = compose(effect, title);

    return go(noteTitle);
};

const transform = cond([
    [isOpen, open],
    [isClose, close],
    [isInside, inside],
    [always(true), identity],
]);

const note = map(transform);

module.exports = {note};
