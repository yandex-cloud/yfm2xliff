/* eslint-disable no-return-assign */
const {map, equals, cond, always, compose, identity} = require('ramda');
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

const close = () => {
    const merged = noteTitle.explicit ? noteTitle : null;

    noteTitle = null;

    return merged;
};

const transform = cond([
    [isOpen, open],
    [isClose, close],
    [isInside, inside],
    [always(true), identity],
]);

const note = map(transform);

module.exports = {note};
