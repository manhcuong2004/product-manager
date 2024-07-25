const ProductCategory = require("../../models/product-category-model");
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")

module.exports.productCategory = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);
    res.render('admin/pages/product-category/index.pug', {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords
    })
}

module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };


    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);
    console.log(newRecords)
    res.render('admin/pages/product-category/create', {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords


    })

}

module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const countProducts = await ProductCategory.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const record = new ProductCategory(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/product-category`)

}