const {chain, cond, anyPass, always, identity} = require('ramda');

const {lift} = require('../../common/transformers');
const {
    token: {childrenLens},
    link: {isLink, isLinkAuto, linkAuto, isLinkImplicit, linkImplicit},
    leaf: {isLeaf},
    image: {isImage},
    fence: {isFence, fence},
} = require('../tokens');

const predicate = anyPass([isLeaf, isImage, isLink, isLinkAuto, isLinkImplicit]);

const token = cond([
    [isLinkAuto, linkAuto],
    [isLinkImplicit, linkImplicit],
    [isFence, fence],
    [always(true), identity],
]);

const flatten = chain(lift(predicate)(childrenLens)(token));

module.exports = {
    flatten,
};
