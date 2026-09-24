import axios from "axios";
import axiosClient from "../axiosConfiguration";
import type {
  PasswordUpdate,
  User,
  UserRegister,
  UserUpdate,
} from "@/interfaces/user";
// import ChangePassword from "@/components/user/ChangePassword";

const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosClient.get("/users");
    return response.data.map((user: any) => user);
  },
  getUserById: async (id: number): Promise<User> => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  },
  createUser: async (user: User): Promise<User> => {
    try {
      const response = await axiosClient.post("/users", user);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (id: number, user: UserUpdate): Promise<User> => {
    try {
      const response = await axiosClient.put(`/users/${id}`, user);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteUser: async (id: number): Promise<User> => {
    try {
      const response = await axiosClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // ChangePassword: async (
  //   id: number,
  //   password: PasswordUpdate, 
  // ): Promise<User> => {
  //   try {
  //     const response = await axiosClient.patch(`/users/${id}/password`, password);
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

};

export default userApi;
