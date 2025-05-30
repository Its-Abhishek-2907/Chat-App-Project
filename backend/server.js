import path from 'path';
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import { app, server } from './socket/socket.js'

import connectToMongoDB from "./db/connectToMongoDB.js";

const PORT = process.env.PORT || 3000

const __dirname = path.resolve();

dotenv.config();

app.use(express.json());  // to parse incoming requests with json payloads (from req.body)
app.use(cookieParser());  // to parse the incoming cookies from req.cookies

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
})

// app.get('/', (req, res) => {

//     console.log('Hello World');
//     res.send('Hello');
// });

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`server listening on port http://localhost:${PORT}`)
});



//                        https://chat-app-t5rl.onrender.com/

