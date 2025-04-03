const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const dburl = process.env.MONGO_URL;
mongoose.connect(dburl);
module.exports = mongoose;