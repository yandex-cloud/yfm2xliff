/* eslint-disable no-return-assign */
const {
    compose,
    addIndex,
    map,
    chain,
    prop,
    ifElse,
    cond,
    equals,
    always,
    identity,
    anyPass,
} = require('ramda');

const {lift} = require('../../common/transformers');
const {notNil} = require('../../common/predicates');
const {
    inline: {isInline},
    link: {link},
    leaf: {isLeaf},
    token: {childrenLens},
} = require('../tokens');

const mapIndexed = addIndex(map);

const group = (children) => {
    let li = null;

    const isOpen = compose(equals('link_open'), prop('type'));
    const handleOpen = (child, i, chs) => (chs[(li = i)] = link(child));

    const isClose = compose(equals('link_close'), prop('type'));
    const handleClose = ifElse(
        isClose,
        () => (li = null),
        (child, i, chs) => chs[li].children.push(child) && child,
    );

    const isInside = () => notNil(li);
    const handleInside = compose(always([]), handleClose);

    const fmap = cond([
        [isOpen, handleOpen],
        [isInside, handleInside],
        [always(true), identity],
    ]);

    return mapIndexed(fmap)(children);
};

const predicate = anyPass([isInline, isLeaf]);

const token = ifElse(isInline, compose(group, childrenLens), identity);

const inline = chain(lift(predicate)(childrenLens)(token));

module.exports = {
    inline,
};
