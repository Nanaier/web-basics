import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"));
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
    const userList = users.map(
      (id) => io.sockets.sockets.get(id)?.data.username || "Anonymous"
    );
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
