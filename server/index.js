const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const path = require('path');
const {Server} = require("socket.io");

app.use(cors());

app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/dist', 'index.html'));
});

//Genarate Server -> express app using http library 
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});


//when someone connect/ disconnect this trigger
io.on("connection", (socket) => {
    console.log(`User Connected : ${socket.id}`);

//when someone want to join the room
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

//message send with all data(data from Chat.js sendMessage)
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data); //All uses with same room id receive message
    });

//User Disconnected from the server
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log('Server running on :3001');
})
