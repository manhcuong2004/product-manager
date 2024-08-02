const User = require("../../models/user-model")

module.exports = (res) => {
    _io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            //them id cuar A vao acc cua B

            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if (!existIdAinB) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: { acceptFriends: myUserId }
                });
            }
            //them id cuar b vao reqFr cua A
            const existIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if (!existIdBinA) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: { requestFriends: userId }
                });
            }
        });
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            //xoa id cuar A vao acceptFr cua B

            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if (existIdAinB) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { acceptFriends: myUserId }
                });
            }
            //them id cuar b vao reqFr cua A
            const existIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if (existIdBinA) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { requestFriends: userId }
                });
            }
        });
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            //xoa id cuar A vao req cua B

            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if (existIdAinB) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { acceptFriends: userId }
                });
            }
            //them id cuar b vao acce cua A
            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            if (existIdBinA) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { requestFriends: myUserId }
                });
            }
        });
    });
}


