import axiosClient from "../axiosConfiguration";
import type {
  AdminPassword,
  PasswordUpdate,
  User,
  UserCreate,
  UserUpdate,
} from "@/interfaces/user";

const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosClient.get("/users");
    return response.data;
  },
  getUserById: async (id: number): Promise<User> => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  },
  createUser: async (user: UserCreate): Promise<User> => {
    const response = await axiosClient.post("/users", user);
    return response.data;
  },
  updateUser: async (id: number, user: UserUpdate): Promise<User> => {
    const response = await axiosClient.put(`/users/${id}`, user);
    return response.data;
  },
  deleteUser: async (id: number): Promise<User> => {
    const response = await axiosClient.delete(`/users/${id}`);
    return response.data;
  },
  changePassword: async (
    id: number,
    password: PasswordUpdate | AdminPassword,
  ): Promise<User> => {
    const response = await axiosClient.patch(`/users/${id}/password`, password);

    return response.data;
  },
};

export default userApi;
