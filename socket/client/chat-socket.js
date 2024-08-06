const Chat = require("../../models/chat-model")

module.exports = (req, res) => {
    const userId = res.locals.user.id;
    const fullname = res.locals.user.fullname;

    const roomChatId = req.params.roomChatId;
    _io.once('connection', (socket) => {
        socket.join(roomChatId);

        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            const chat = new Chat({
                user_id: userId,
                content: content,
                room_chat_id: roomChatId,

                // images: data.images
            });
            await chat.save();

            _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullname: fullname,
                content: content
            });
        });

        //typing
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullname: fullname,
                type: type
            })
        })
    });
}
