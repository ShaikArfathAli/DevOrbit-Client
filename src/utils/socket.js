import io from "socket.io-client";


const SOCKET_URL = "http://localhost:1234";

export const createSocketConnection = () => {
  return io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });
};
