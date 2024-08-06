const { type } = require("os");
const Chat = require("../../models/chat-model")
const User = require("../../models/user-model")
const chatSocket = require("../../socket/client/chat-socket");
module.exports.chat = async (req, res) => {
    const roomChatId = req.params.roomChatId;
    //socket
    chatSocket(req, res)

    //lấy data
    const chats = await Chat.find({
        room_chat_id: roomChatId,
        deleted: false
    });
    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullname");

        chat.infoUser = infoUser
    }
    res.render('client/pages/chat/index.pug', {
        pageTitle: "Chat",
        chats: chats
    })
}