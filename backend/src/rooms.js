const rooms = new Map();

/*
roomId → {
  code: string,
  users: Map<socketId, username>
}
*/

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      code: "",
      users: new Map(),
    });
  }
  return rooms.get(roomId);
}

function removeUser(roomId, socketId) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.users.delete(socketId);

  if (room.users.size === 0) {
    rooms.delete(roomId);
  }
}

module.exports = {
  getRoom,
  removeUser,
};
