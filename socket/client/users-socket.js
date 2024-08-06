const User = require("../../models/user-model")
const Room = require("../../models/rooms-chat-model");
const RoomChat = require("../../models/rooms-chat-model");

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

            //lấy ra độ dài của acceptfr của B
            const infoUserB = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })

            //lấy info của A và trả về cho B
            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("id fullname")
            socket.broadcast.emit("SERVER_RETURN_INFO _ACCEPT_FRIEND", {
                userId: userId,
                infoUserA: infoUserA
            })
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
            const infoUserB = await User.findOne({
                _id: userId
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userId: userId,
                userIdA: myUserId
            })
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
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            //check exist
            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            let roomChat;
            //tao roomchat
            if (existIdBinA && existIdAinB) {
                const dataRoom = {
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: userId,
                            role: "superAdmin"
                        },
                        {
                            user_id: myUserId,
                            role: "superAdmin"
                        }
                    ],
                };
                roomChat = new RoomChat(dataRoom);
                await roomChat.save();
            }




            if (existIdAinB) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: { acceptFriends: userId }
                });
            }

            if (existIdBinA) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: { requestFriends: myUserId }
                });
            }
        });
    });
}


