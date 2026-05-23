export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type SortField = 'title' | 'price' | 'rating' | 'stock';
export type SortOrder = 'asc' | 'desc';

export interface Filters {
  search: string;
  categories: string[];
  sort: SortField;
  order: SortOrder;
  page: number;
}
