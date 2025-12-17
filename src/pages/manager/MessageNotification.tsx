import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useSocket } from "@/hooks/useSocket";
import { useJoinRooms } from "@/hooks/useJoinRooms";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/lib/types/user";
import { useManagerMutation } from "@/hooks/useManager";
import { useChatHistory } from "@/hooks/useChatHistory";

const MessageNotification: React.FC = () => {
    const socket = useSocket();
    const { user } = useAuth();
    const { adminQuery } = useManagerMutation();
    const admins = adminQuery?.data || [];

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [text, setText] = useState<string>("");
    const [messages, setMessages] = useState<any[]>([]);
    console.log("selectedUser", selectedUser);

    const { data: history } = useChatHistory(
        user?.id,
        selectedUser?._id
    );

    useJoinRooms(socket, user);

    // Load chat history
    useEffect(() => {
        if (history) {
            setMessages(history);
        }
    }, [history]);

    // Handle receiving messages from backend
    useEffect(() => {
        if (!socket) return;
        socket.on("receive-message", (msg) => {
            console.log("CLIENT RECEIVED:", msg);
        });

        console.log("message from db");

        const handleReceive = (msg: any) => {
            // Only show messages for current chat
            if (
                selectedUser &&
                ((msg.senderId === selectedUser._id && msg.receiverId === user?.id) ||
                    (msg.senderId === user?.id && msg.receiverId === selectedUser._id))
            ) {
                setMessages(prev => [...prev, msg]);
            }
        };

        socket.on("receive-message", handleReceive);

        return () => {
            socket.off("receive-message", handleReceive);
        };
    }, [socket, selectedUser, user]);

    // SEND message handler
    const handleSend = useCallback(() => {
        if (!socket || !selectedUser || !text.trim()) return;

        const messageObj = {
            senderId: user?.id,
            receiverId: selectedUser._id,
            message: text,
            createdAt: new Date().toISOString(),
        };
        if (user.role === "manager") {
            console.log("emitted admin send message");

            socket.emit("manager-send-message", messageObj);
        }

        setMessages(prev => [...prev, messageObj]);
        setText("");
    }, [socket, selectedUser, text, user]);

    return (
        <div className="h-[calc(100vh-100px)]">
            <div className="flex h-full bg-white border">

                {/* LEFT SIDE */}
                <div className="w-[28%] border-r">
                    <h2 className="p-4 text-xl font-semibold border-b">Admins</h2>

                    {admins.map((item: User) => (
                        <div
                            key={item._id}
                            onClick={() => setSelectedUser(item)}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100
                                ${selectedUser?._id === item._id ? "bg-gray-100" : ""}`}
                        >
                            <Avatar>
                                <AvatarFallback>{item.username[0]}</AvatarFallback>
                            </Avatar>

                            <div>
                                <p className="font-medium">{item.username}</p>
                                <small className="text-gray-500">Tap to chat</small>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT CHAT WINDOW */}
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
                                Connect The Admin For Any Query...
                            </div>

                        </div>

                    ) : (
                        <>
                            <div className="p-4 border-b flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>{selectedUser.username[0]}</AvatarFallback>
                                </Avatar>
                                <h2 className="text-lg font-semibold">
                                    {selectedUser.username}
                                </h2>
                            </div>

                            <ScrollArea className="flex-1 p-3">
                                <div className="flex flex-col gap-3">
                                    {messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`max-w-xs px-3 py-2 rounded-lg ${msg.senderId === user?.id
                                                ? "bg-blue-500 text-white self-end"
                                                : "bg-gray-200 self-start"
                                                }`}
                                        >
                                            {msg.message}
                                            {
                                                msg.senderId != user?.id && (

                                                    <p className="text-sm text-gray-400">{msg.type}</p>
                                                )
                                            }
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            {/* SEND BOX */}
                            <div className="p-3 border-t flex gap-2 bg-white">
                                <Input
                                    placeholder="Type message..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <Button onClick={handleSend}>Send</Button>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MessageNotification;
