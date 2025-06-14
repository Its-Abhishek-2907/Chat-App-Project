import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    pingTimeout: 60000, // Add timeout settings
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type"]
    }
});

export const getReceiverSocketId = (recieverId) => {
    return userSocketMap[recieverId];
}

const userSocketMap = {};

io.on('connection', (socket) => {
    console.log('a user is connected', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != "undefined") {
        userSocketMap[userId] = socket.id;
    }

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // socket.on() is used to listen to the events. can be used on both server and client side
    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})


export { app, io, server }
