const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    pages: Number
});

const User = mongoose.model('User', userSchema);

module.exports = { User };