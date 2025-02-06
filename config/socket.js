const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const CFG = require('./config');
const chatDB = require('../controllers/chatController');

module.exports = (server) => {
    const io = socketIo(server);
    
    const users = {};

    io.use((socket, next) => {
        console.log('checking token');
        const token = socket.handshake.query.token;
        console.log(token);
        if (!token) {
            console.log('checking token2');
            return next(new Error('Unauthorized'));
        }

        jwt.verify(token, CFG.SECRET, (err, user) => {
            if (err) {
                console.log('Unauthorized');

                return next(new Error('Unauthorized'));
            }
            socket.user = user; 
            console.log('checking token3', user);
            next();
        });
    });


    io.on('connection', (socket) => {
        console.log(`User ${socket.user.username} connected`);

        socket.on('register', (username) => {
            users[username] = socket.id;
        });

        // Join room
        socket.on('joinRoom', ({ room }) => {
            chatDB.joinRoom(socket, room, socket.user.username);
            console.log(`${socket.user.username} joined room: ${room}`);
        });

        // Leave room
        socket.on('leaveRoom', ({ room }) => {
            chatDB.leaveRoom(socket, room, socket.user.username);
            console.log(`${socket.user.username} left room: ${room}`);
        });

        // Send chat message
        socket.on('chatMessage', async (data) => {
            const { room, message } = data;
            await chatDB.handleGroupMessage(
                io, 
                message, 
                room, 
                socket.user.username
            );
        });

        socket.on('privateMessage', async (data) => {
            const { toUser, message } = data;
            console.log(toUser, message);
            if (users[toUser]) {
                const recipientSocketId = users[toUser]; 
                console.log(recipientSocketId);
                await chatDB.handlePrivateMessage(
                    io,
                    recipientSocketId,
                    message,
                    socket.user.username,
                    toUser
                );

            } else {
                console.log(`User ${recipient} not connected`);
            }
        });

        socket.on('typing', ({ room }) => {
            console.log('typing');

            socket.to(room).emit('typing', { isTyping: true });
        });

        socket.on('disconnect', () => {
            for (let username in users) {
                if (users[username] === socket.id) {
                    delete users[username];
                    console.log(`User ${username} disconnected`);
                    break;
                }
            }
            console.log(`User ${socket.user.username} disconnected`);
        });
    });

    return io;  
};
