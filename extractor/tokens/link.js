const {compose, map, join, anyPass, equals, prop, clone, assoc} = require('ramda');
const {typeLens, contentLens, childrenLens} = require('./token');

const isLink = compose(equals('link'), typeLens);

const link = compose(clone, assoc('children', []), assoc('type', 'link'));

const isLinkAuto = compose(equals('autolink'), prop('markup'));

const linkAuto = assoc('type', 'link_auto');

const isLinkImplicit = anyPass([
    compose(equals('{#T}'), join(''), map(contentLens), childrenLens),
    compose(equals('link_implicit'), typeLens),
]);

const linkImplicit = assoc('type', 'link_implicit');

module.exports = {
    isLink,
    link,
    isLinkAuto,
    linkAuto,
    isLinkImplicit,
    linkImplicit,
};
