"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer);
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "login.html"));
});
app.get("/chat", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "chat.html"));
});
// Handle socket connections
io.on("connection", (socket) => {
    console.log("a user connected");
    // Join a room
    socket.on("join room", (data) => {
        const { username, room } = data;
        socket.join(room);
        socket.data.username = username;
        socket.data.room = room;
        socket.to(room).emit("user connected", username);
        // Send the list of users in the room to the new user
        const users = Array.from(io.sockets.adapter.rooms.get(room) || []);
        const userList = users.map((id) => { var _a; return ((_a = io.sockets.sockets.get(id)) === null || _a === void 0 ? void 0 : _a.data.username) || "Anonymous"; });
        socket.emit("room users", userList);
        // Handle chat messages
        socket.on("chat message", (msg) => {
            io.to(room).emit("chat message", { username: socket.data.username, msg });
        });
        // Handle user disconnection
        socket.on("disconnect", () => {
            socket.to(room).emit("user disconnected", socket.data.username);
        });
    });
});
httpServer.listen(3000, () => {
    console.log("listening on *:3000");
});
