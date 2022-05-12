const {compose, chain, ifElse} = require('ramda');

const lift = (predicate) => (depthLense) => (lifteeLense) => {
    const lifter = (node) =>
        ifElse(predicate, lifteeLense, compose(chain(lifter), depthLense))(node);

    return lifter;
};

module.exports = {
    lift,
};
