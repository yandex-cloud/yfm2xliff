const {bind, composeWith} = require('ramda');

const promiseAll = bind(Promise.all, Promise);

const resolve = bind(Promise.resolve, Promise);

const composeP = (...args) =>
    composeWith((f, v) =>
        v && v.then
            ? v.then(f)
            : Array.isArray(v) && v.length && v[0] && v[0].then
            ? promiseAll(v).then(f)
            : f(v),
    )(args);

module.exports = {
    composeP,
    promiseAll,
    resolve,
};
