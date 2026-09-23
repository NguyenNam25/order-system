import { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  description: string;
}

export interface ProductForm {
  name: string;
  price: number;
  categoryId: number;
  description: string;
}

export interface ProductDisplay {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  description: string;
  category: Category;
}
