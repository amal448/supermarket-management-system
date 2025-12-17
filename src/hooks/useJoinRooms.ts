import { useEffect } from "react";
import { Socket } from "socket.io-client";

export const useJoinRooms = (socket: Socket | null, user: any) => {
     useEffect(() => {
    if (!socket || !user) return;
    if (!socket.connected) return;

    console.log("✅ Joining personal room:",user, user.id);

    // This is the ONLY required join for one-to-one chat
   socket.emit("join-room", { userId: user.id, role: user.role });


  }, [socket?.connected, user?.id]);
};
