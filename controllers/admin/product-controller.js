const Product = require("../../models/product-model");
const systemConfig = require("../../config/system")
const FilterStatusHelper = require("../../helpers/filterStatus")
const FindProductHelper = require("../../helpers/findProduct")
const paginationHelper = require("../../helpers/pagination")

module.exports.product = async (req, res) => {

    const filterStatus = FilterStatusHelper(req.query);
    let find = {
        deleted: false,
    };
    const countProducts = await Product.countDocuments(find);


    if (req.query.status) {
        find.status = req.query.status;
    }

    const objectSearch = FindProductHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // Pagination

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, req.query, countProducts);
    //sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.position = "desc"

    }
    const products = await Product
        .find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)

    // console.log(products)
    res.render('admin/pages/product/index.pug', {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        objectPagination: objectPagination
    })
}

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Cập nhật trạng thái thành công!');
    res.redirect("back")
}

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" })
            req.flash('success', 'Cập nhật trạng thái thành công!');
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" })
            req.flash('success', 'Cập nhật trạng thái thành công!');
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date()
            })
            req.flash('success', 'Xóa thành công!');
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");

                position = parseInt(position);
                console.log(id, position)
                await Product.updateOne({ _id: id }, {
                    position: position
                })
            }
            req.flash('success', 'Đổi thành công!');
            break;
        default:
            break;
    }
    res.redirect("back")
}

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash('success', 'Xóa thành công!');
    res.redirect("back")
}

module.exports.create = async (req, res) => {
    res.render('admin/pages/product/create', {
        pageTitle: "Thêm mới sản phẩm",
    })
}

module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    } const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);
        res.render('admin/pages/product/edit', {
            pageTitle: "Chỉnh sửa sản phẩm sản phẩm",
            product: product
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)

    }

}

module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    try {
        await Product.updateOne({ _id: id }, req.body)
        req.flash('success', 'Sửa thành công thành công!');

    } catch (error) {

    }
    res.redirect(`back`)

}

module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);
        res.render('admin/pages/product/detail', {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)

    }

}