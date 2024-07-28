const Role = require("../../models/role-model");
const systemConfig = require("../../config/system")


module.exports.role = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await Role.find(find);

    res.render('admin/pages/roles/index.pug', {
        pageTitle: "Phân quyền",
        records: records
    })
}

module.exports.create = async (req, res) => {
    res.render('admin/pages/roles/create', {
        pageTitle: "Tạo nhóm quyền",
    })
}
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Role.findOne({
            _id: id,
            deleted: false
        });
        res.render('admin/pages/roles/edit', {
            pageTitle: "Chỉnh sửa phân quyền",
            data: data,
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);

    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await Role.find(find);
    res.render('admin/pages/roles/permissions', {
        pageTitle: "Phân quyền",
        records: records
    })
}

module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
        await Role.updateOne({ _id: item.id }, { permissions: item.permissions });

    }

    req.flash("success", "Cập nhật phân quyền thành công")
    res.redirect(`back`)
};
