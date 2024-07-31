const dashboardRouters = require('./dashboard-router')
const productRouters = require('./product-router')
const productCategoryRouters = require('./product-category-router')
const role = require('./role-router')
const account = require('./account-router')
const authRoutes = require('./auth-router')
const myAccountRoutes = require('./my-account-router')
const settingRoutes = require('./setting-router')

const authMiddleware = require('../../middleware/admin/auth-middleware')

const systemConfig = require('../../config/system')

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard', authMiddleware.requireAuth, dashboardRouters)

    app.use(PATH_ADMIN + '/products', authMiddleware.requireAuth, productRouters)

    app.use(PATH_ADMIN + '/product-category', authMiddleware.requireAuth, productCategoryRouters)

    app.use(PATH_ADMIN + '/roles', authMiddleware.requireAuth, role)

    app.use(PATH_ADMIN + '/accounts', authMiddleware.requireAuth, account)

    app.use(PATH_ADMIN + '/auth', authRoutes)

    app.use(PATH_ADMIN + '/my-account', authMiddleware.requireAuth, myAccountRoutes)

    app.use(PATH_ADMIN + '/settings', authMiddleware.requireAuth, settingRoutes)

}

