import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useSendMessage = () => {
  
  return useMutation({
    mutationFn: async (payload: {
      receiverId: string | null;
      senderId:string |null 
      message: string;
    }) => {
      const res = await axios.post(
        "http://localhost:5000/api/socket/chat/send",
        payload,
        { withCredentials: true }
      );
      return res.data;
    }
  });
};
