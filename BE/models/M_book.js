const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function removeVietnameseTones(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
}

const booksSchema = new Schema({
    name: { type: String, required: true, unique: true},
    name_unsigned: {type: String},
    img:{ type: String, required:true},
    file: { type: String, required: true},
    catalog:{ type: Schema.Types.ObjectId, ref: 'catalogs'}
});

booksSchema.pre('save', function (next) {
    this.name_unsigned = removeVietnameseTones(this.name);
    next();
});

const Book = mongoose.model('books', booksSchema);
module.exports = Book;
