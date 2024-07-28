const ProductCategory = require("../../models/product-category-model");
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree");
const { parse } = require("path");

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

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });
        const records = await ProductCategory.find({
            deleted: false
        });
        const newRecords = createTreeHelper.tree(records);

        console.log(records);
        res.render('admin/pages/product-category/edit', {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/product-category`)

    }

}

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);

    await ProductCategory.updateOne({ _id: id }, req.body);

    res.redirect(`${systemConfig.prefixAdmin}/product-category`)
}
