const { Server } = require("socket.io");
const { getRoom, removeUser } = require("./rooms");

function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("join", ({ roomId, username }) => {
      socket.join(roomId);

      const room = getRoom(roomId);
      room.users.set(socket.id, username);

      socket.emit("sync-code", room.code);

      socket.to(roomId).emit("user-joined", {
        socketId: socket.id,
        username,
      });
    });

    socket.on("code-change", ({ roomId, code }) => {
      const room = getRoom(roomId);
      room.code = code;
      socket.to(roomId).emit("code-change", code);
    });

    socket.on("disconnecting", () => {
      for (const roomId of socket.rooms) {
        removeUser(roomId, socket.id);
        socket.to(roomId).emit("user-left", socket.id);
      }
    });
  });
}

module.exports = setupSocket;
