const GroupMessage = require('../models/groupMessage');
const PrivateMessage = require('../models/privateMessage');

exports.getChatPage = (req, res) => {
    res.sendFile(`${process.cwd()}/views/chat.html`);
};

// Join Room
exports.joinRoom = (socket, room, username) => {
    socket.join(room);
    socket.to(room).emit('message', {
        username: username,
        message: 'has joined the room'
    });
};

// Leave Room
exports.leaveRoom = (socket, room, username) => {
    socket.leave(room);
    socket.to(room).emit('message', {
        username: username,
        message: 'has left the room'
    });
};

// Handle Group Messages
exports.handleGroupMessage = async (socket, msg, room, username) => {
    const message = new GroupMessage({
        from_user: username,
        room,
        message: msg,
        date_sent: new Date(),
    });

    await message.save();
    socket.to(room).emit('message',  {
        username: username,
        message: msg
    });
};

// Handle Private Messages
exports.handlePrivateMessage = async (socket, id, msg, fromUser, toUser) => {
    const privateMessage = new PrivateMessage({
        from_user: fromUser,
        to_user: toUser,
        message: msg,
        date_sent: new Date(),
    });

    console.log('saving private message');
    await privateMessage.save();
    socket.to(id).emit('privateMessage', {
        sender: fromUser,
        message: msg
    });
};
