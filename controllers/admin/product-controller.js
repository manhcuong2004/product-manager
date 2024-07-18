const Product = require("../../models/product-model");

const FilterStatusHelper = require("../../helpers/filterStatus")

const FindProductHelper = require("../../helpers/findProduct")

module.exports.product = async (req, res) => {

    const filterStatus = FilterStatusHelper(req.query);
    let find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    const objectSearch = FindProductHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    const products = await Product.find(find);
    // console.log(products)
    res.render('admin/pages/product/index.pug', {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    })
}