import axios from "axios";
import type {
  Product,
  ProductDisplay,
  ProductForm,
  ProductImage,
  UploadImageResponse,
} from "@/interfaces/product";
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

  uploadProductImage: async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await axiosClient.post("/uploads/products", formData);

    return response.data;
  },

  addProductImage: async (
    productId: number,
    imageUrl: string,
  ): Promise<ProductImage> => {
    const response = await axiosClient.post(`/products/${productId}/images`, {
      imageUrl,
    });

    return response.data;
  },

  addProductImageFile: async (
    productId: number,
    file: File,
  ): Promise<ProductImage> => {
    const uploadResponse = await productApi.uploadProductImage(file);

    const image = await productApi.addProductImage(
      productId,
      uploadResponse.imageUrl,
    );

    return image;
  },

  deleteProductImage: async (
    productId: number,
    imageId: number,
  ): Promise<void> => {
    await axiosClient.delete(`/products/${productId}/images/${imageId}`);
  },
};
export default productApi;
