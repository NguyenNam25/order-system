import type { Category, CategoryForm } from "@/interfaces/category";
import axiosClient from "../axiosConfiguration";

const categoryApi = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await axiosClient.get("/categories");
    return response.data.map((category: any) => category);
  },
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await axiosClient.get(`/categories/${id}`);
    return response.data;
  },
  createCategory: async (category: CategoryForm): Promise<Category> => {
    const response = await axiosClient.post("/categories", category);
    return response.data;
  },
  updateCategory: async (
    id: number,
    category: CategoryForm,
  ): Promise<Category> => {
    const response = await axiosClient.put(`/categories/${id}`, category);
    return response.data;
  },
  deleteCategory: async (id: number): Promise<Category> => {
    const response = await axiosClient.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryApi;
