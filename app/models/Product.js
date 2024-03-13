const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    label: String,
    price: Number,
    quantity: Number,
    type: String,
    refundable: Boolean
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };