const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catalogsSchema = new Schema({
    name: { type: String, required: true, unique: true},
    desc: { type: String, required: true},
});

const Catalog = mongoose.model('catalogs', catalogsSchema);
module.exports = Catalog;