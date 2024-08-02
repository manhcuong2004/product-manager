const Chat = require("../../models/chat-model")

module.exports = (res) => {
    const userId = res.locals.user.id;
    const fullname = res.locals.user.fullname;
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            const chat = new Chat({
                user_id: userId,
                content: content,
                // images: data.images
            });
            await chat.save();

            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullname: fullname,
                content: content
            });
        });

        //typing
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullname: fullname,
                type: type
            })
        })
    });
}
