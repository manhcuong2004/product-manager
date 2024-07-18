const dashboardRouters = require('./dashboard-router')
const productRouters = require('./product-router')

const systemConfig = require('../../config/system')

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard', dashboardRouters)

    app.use(PATH_ADMIN + '/product', productRouters)
}

