const productRouters = require('./product-router')
const homeRouters = require('./home-router')
const chatRouters = require('./chat-router')
const userRouters = require('./user-router')

const userMiddleware = require('../../middleware/client/user-middleware')
const categoryMiddleware = require('../../middleware/client/category-middleware')
const settingMiddleware = require('../../middleware/client/setting-middleware')
const authMiddleware = require('../../middleware/admin/auth-middleware')

module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(userMiddleware.infoUser)
    app.use(settingMiddleware.settingGeneral)
    app.use('/', homeRouters)
    app.use('/products', productRouters)
    app.use('/user', userRouters)
    app.use('/chat', authMiddleware.requireAuth, chatRouters)

}