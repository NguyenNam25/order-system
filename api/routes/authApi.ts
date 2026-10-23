import { User, UserRegister } from "@/interfaces/user";
import axiosClient from "../axiosConfiguration";

const authApi = {
  login: async (email: string, password: string): Promise<{ user: User }> => {
    const response = await axiosClient.post("/login", {
      email,
      password,
    });
    return response.data;
  },
  register: async (user: UserRegister): Promise<User> => {
    const response = await axiosClient.post("/register", user);
    return response.data;
  },
  logout: async (): Promise<void> => {
    const response = await axiosClient.post("/logout");
    return response.data;
  },
  fetchMe: async (): Promise<User | null> => {
    const response = await axiosClient.get("/me");
    return response.data.user;
  },
};

export default authApi;
