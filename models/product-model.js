const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
const { type } = require("os");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({

    title: String,
    product_category_id: {
        type: String,
        default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
})

const Product = mongoose.model('Product', productSchema, 'products');


module.exports = Product; 