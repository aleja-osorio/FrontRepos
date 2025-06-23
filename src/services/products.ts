import { apiService } from './api';
import type { Product, CreateProductData, UpdateProductData, ProductFilters } from '../types';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  isActive?: boolean;
}

export interface ProductFilters {
  category?: string;
  isActive?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Servicio de productos
export const productService = {
  // Obtener todos los productos
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const endpoint = filters ? `/products?${params.toString()}` : '/products';
    return await apiService.get<Product[]>(endpoint);
  },

  // Obtener un producto por ID
  async getProductById(id: string): Promise<Product> {
    return await apiService.get<Product>(`/products/${id}`);
  },

  // Crear un nuevo producto
  async createProduct(productData: CreateProductData): Promise<Product> {
    return await apiService.post<Product>('/products', productData);
  },

  // Actualizar un producto
  async updateProduct(id: string, productData: UpdateProductData): Promise<Product> {
    return await apiService.put<Product>(`/products/${id}`, productData);
  },

  // Eliminar un producto
  async deleteProduct(id: string): Promise<void> {
    await apiService.delete(`/products/${id}`);
  },

  // Actualizar stock de un producto
  async updateStock(id: string, stock: number): Promise<Product> {
    return await apiService.patch<Product>(`/products/${id}/stock`, { stock });
  },

  // Obtener productos por categoría
  async getProductsByCategory(category: string): Promise<Product[]> {
    return await apiService.get<Product[]>(`/products/category/${category}`);
  },

  // Buscar productos
  async searchProducts(query: string): Promise<Product[]> {
    return await apiService.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
  },

  // Obtener categorías disponibles
  async getCategories(): Promise<string[]> {
    return await apiService.get<string[]>('/products/categories');
  },

  // Subir imagen de producto
  async uploadProductImage(productId: string, file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    return await apiService.post<{ imageUrl: string }>(`/products/${productId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
}; 