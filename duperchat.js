// DuperChat - Single file Node.js messenger (server + client)
// Run with: node duperchat.js
// Then open: http://localhost:3000 in browser

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const usersBySocket = new Map();

// Serve HTML + JS client directly
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("identify", (username) => {
    usersBySocket.set(socket.id, username);
    io.emit("users", Array.from(usersBySocket.values()));
  });

  socket.on("message", (msg) => {
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    usersBySocket.delete(socket.id);
    io.emit("users", Array.from(usersBySocket.values()));
  });
});

server.listen(3000, () => {
  console.log("🚀 DuperChat running at http://localhost:3000");
});
