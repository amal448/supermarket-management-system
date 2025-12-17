import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useChatHistory } from "@/hooks/useChatHistory";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useManagerMutation } from "@/hooks/useManager";
import type { User } from "@/lib/types/user";
import { useSocket } from "@/hooks/useSocket";
import { useJoinRooms } from "@/hooks/useJoinRooms";

const MessageBroadCast = () => {
    const [text, setText] = useState<string>("");
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { user } = useAuth(); // ✅ FIXED missing user
    console.log("userrr", user);


    const { data: chatHistory } = useChatHistory(
        user?.id ?? null,
      selectedUser?._id ?? "broadcast"
    );

    const { managersQuery } = useManagerMutation();

    // ✅ FIXED broadcast type error
    const BROADCAST = {
        _id: null,
        username: "Broadcast",
        email: "",
        role: "broadcast"
    } as unknown as User;

    const users: User[] = managersQuery.data ?? [];


    const socket = useSocket();
    useJoinRooms(socket, user);

    const sendAlert = () => {
        if (!selectedUser || !user) return;

        const payload = {
            senderId: user?.id,
            receiverId: selectedUser._id ?? null,
            message: text,
        };

        console.log("📤 Sending socket payload:", payload);


        if (user.role === "admin" && selectedUser._id === null) {
            socket?.emit("admin-broadcast", {
                senderId: user.id,
                message: text
            });
        } else {
            console.log("emitted admin send message");

            socket?.emit("admin-send-message", payload);
        }

        setMessages(prev => [...prev, payload]);
        setText("");
    };

    // Load chat history
    useEffect(() => {
        if (chatHistory) {
            setMessages(chatHistory);
        }
    }, [chatHistory]);

    useEffect(() => {

        if (!socket) return;
        socket.on("receive-message", (msg) => {
            console.log("CLIENT RECEIVED:", msg);
        });
     const handler = (msg: any) => {
    if (!selectedUser) return;

    // ⭐ Broadcast case
    if (selectedUser._id === null && msg.type === "broadcast") {
        setMessages(prev => [...prev, msg]);
        return;
    }

    // ⭐ Normal chat case
    if (
        (msg.senderId === selectedUser._id && msg.receiverId === user?.id) ||
        (msg.senderId === user?.id && msg.receiverId === selectedUser._id)
    ) {
        setMessages(prev => [...prev, msg]);
    }
};


        socket.on("receive-message", handler);
        return () => socket.off("receive-message", handler);
    }, [socket, selectedUser, user]);

    return (
        <div className="h-[calc(100vh-100px)]">
            <div className="flex h-full bg-white border">

                {/* LEFT SIDEBAR */}
                <div className="w-[28%] border-r">
                    <h2 className="p-4 text-xl font-semibold border-b">Chats</h2>

                    {/* Broadcast */}
                    <div
                        onClick={() => setSelectedUser(BROADCAST)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100
              ${selectedUser?._id === null ? "bg-gray-100" : ""}`}
                    >
                        <Avatar>
                            <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">Broadcast</p>
                            <small className="text-gray-500">Tap to chat</small>
                        </div>
                    </div>

                    {/* Manager list */}
                    <ScrollArea className="h-full">
                        {users.map((u) => (
                            <div
                                key={u._id}
                                onClick={() => setSelectedUser(u)}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100
                  ${selectedUser?._id === u._id ? "bg-gray-100" : ""}`}
                            >
                                <Avatar>
                                    <AvatarFallback>{u.username?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{u.username}</p>
                                    <small className="text-gray-500">Tap to chat</small>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>

                {/* RIGHT PANEL */}
                <div className="flex-1 flex flex-col">

                    {!selectedUser ? (
                         <div className="relative flex flex-1 items-center justify-center">

                            {/* Background image */}
                            <img
                                src="https://tse4.mm.bing.net/th/id/OIP.I2BOUI3z5UKR70ZCXW0ylwHaFi?pid=Api&P=0&h=180"
                                className="absolute inset-0 w-full h-full object-cover opacity-30"
                                alt="background"
                            />

                            {/* Overlay text */}
                            <div className="relative z-10 text-2xl font-semibold text-gray-700">
                                Select Manager to start chatting
                            </div>

                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>
                                        {selectedUser.username?.charAt(0) ?? "B"}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-lg font-semibold">
                                    {selectedUser.username}
                                </h2>
                            </div>

                            {/* Messages */}
                            <ScrollArea className="flex-1 p-3">
                                <div className="flex flex-col gap-3">
                                    {messages?.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`max-w-xs px-3 py-2 rounded-lg ${msg.senderId === user?.id
                                                ? "bg-blue-500 text-white self-end"
                                                : "bg-gray-200 self-start"
                                                }`}
                                        >
                                            {msg.message}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            {/* Input */}
                            <div className="p-3 border-t flex gap-2 bg-white">
                                <Input
                                    value={text}
                                    placeholder="Type message..."
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <Button onClick={sendAlert}>Send</Button>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default MessageBroadCast;
