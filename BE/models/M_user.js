const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    phonenumber:{ type: String, required:true,unique: true},// mongo bị mất số 0 đầu str
    password: { type: String, required: true },
    role: { type: Number, required: true ,default:0 }
});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next(); 
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;