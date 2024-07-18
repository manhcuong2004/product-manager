const Product = require("../../models/product-model")


module.exports.product = async (req, res) => {
    const products = await Product.find({
        deleted: false
    });
    console.log(products)

    res.render('admin/pages/product/index.pug', {
        pageTitle: "Danh sách sản phẩm",
        products: products
    })
}