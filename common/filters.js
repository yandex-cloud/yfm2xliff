const {compose, not} = require('ramda');

const fileHidden = (path) => /(^|\/)\.[^/.]/g.test(path);

const fileVisible = compose(not, fileHidden);

module.exports = {
    fileHidden,
    fileVisible,
};
