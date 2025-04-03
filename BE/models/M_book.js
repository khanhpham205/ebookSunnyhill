const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booksSchema = new Schema({
    name: { type: String, required: true, unique: true},
    img:{ type: String, required:true},
    file: { type: String, required: true},
    catalog:{ type: Schema.Types.ObjectId, ref: 'catalogs'}
});

const Book = mongoose.model('books', booksSchema);
module.exports = Book;