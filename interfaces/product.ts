import { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity:number;
  categoryId: number;
  description: string;
}

export interface ProductForm {
  name: string;
  price: number;
  categoryId: number;
  quantity:number;
  description: string;
}

export interface ProductDisplay {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  description: string;
  quantity:number;
  category: Category;
}
