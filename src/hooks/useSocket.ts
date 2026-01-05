// useSocket.ts
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

let socket: Socket | null = null;

export function useSocket() {
  const [instance, setInstance] = useState<Socket | null>(socket);

  useEffect(() => {
    if (!socket) {
      socket = io("https://api.smmanagement.store/api/socket", {
        path: "/socket.io",
        transports: ["websocket"],
      });
      // socket = io("http://localhost:5000", {
      //   path: "/socket.io",
      //   transports: ["websocket"],
      // });

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket!.id);
      });
    }

    setInstance(socket);

    return () => {};
  }, []);

  return instance;
}
