import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { api } from "@/services/api";

export const useSendMessage = () => {
  
  return useMutation({
    mutationFn: async (payload: {
      receiverId: string | null;
      senderId:string |null 
      message: string;
    }) => {
      const res = await api.post(
        // "http://localhost:5000/api/socket/chat/send",
        "/api/socket/chat/send",
        payload,
        { withCredentials: true }
      );
      return res.data;
    }
  });
};
