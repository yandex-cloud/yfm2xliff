const {compose, not} = require('ramda');

const hidden = path => (/(^|\/)\.[^\/\.]/g).test(path);

const visible = compose(not, hidden);

module.exports = {
  hidden,
  visible
};
