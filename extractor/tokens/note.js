const {compose, equals, clone, assoc} = require('ramda');
const {typeLens} = require('./token');

const isNoteTitle = compose(equals('note_title'), typeLens);

const title = compose(clone, assoc('children', []), assoc('type', 'note_title'));

module.exports = {isNoteTitle, title};
