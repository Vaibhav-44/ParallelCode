import { io } from "socket.io-client";

export const initSocket = () => {
  const socket = io(process.env.REACT_APP_BACKEND_URL, {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
    upgrade: false,
    secure: true,
  });

  return socket;
};
