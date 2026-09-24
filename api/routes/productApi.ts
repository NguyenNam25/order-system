import axios from "axios";
import type { Product, ProductDisplay, ProductForm } from "@/interfaces/product";
import type { Category } from "@/interfaces/category";
import axiosClient from "../axiosConfiguration";

const productApi = {
  getAllProducts: async (): Promise<ProductDisplay[]> => {
    const response = await axiosClient.get("/products");
    console.log(response.data);
    return response.data;
  },
  getProductById: async (id: number): Promise<ProductDisplay> => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },
  createProduct: async (product: ProductForm): Promise<Product> => {
    try {
      const response = await axiosClient.post("/products", product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateProduct: async (id: number, product: ProductForm): Promise<Product> => {
    try {
      const response = await axiosClient.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteProduct: async (id: number): Promise<Product> => {
    try {
      const response = await axiosClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default productApi;
