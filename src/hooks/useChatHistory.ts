import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useChatHistory = (userId?: string, otherId?: string) => {
  return useQuery({
    queryKey: ["chat-history", userId, otherId],
    enabled: !!userId && !!otherId,
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/api/socket/history/${userId}/${otherId}`,
        { withCredentials: true }
      );
      console.log("usechat",res.data);
      
      return res.data;
    }
  });
};
