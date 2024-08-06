const productRouters = require('./product-router')
const homeRouters = require('./home-router')
const chatRouters = require('./chat-router')
const userRouters = require('./user-router')
const usersRouters = require('./users-router')
const roomsChatRouters = require('./rooms-chat-router')

const userMiddleware = require('../../middleware/client/user-middleware')
const categoryMiddleware = require('../../middleware/client/category-middleware')
const settingMiddleware = require('../../middleware/client/setting-middleware')
const authMiddleware = require('../../middleware/client/auth-middleware')

module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(userMiddleware.infoUser)
    // app.use(userMiddleware.connect)

    app.use(settingMiddleware.settingGeneral)
    app.use('/', homeRouters)
    app.use('/products', productRouters)
    app.use('/user', userRouters)
    app.use('/users', authMiddleware.requireAuth, usersRouters)
    app.use('/chat', authMiddleware.requireAuth, chatRouters)
    app.use('/rooms-chat', authMiddleware.requireAuth, roomsChatRouters)

}