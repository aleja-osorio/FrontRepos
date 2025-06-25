import { apiService } from './api';
import type { Product, CreateProductData, UpdateProductData, ProductFilters, ProductFormData } from '../types';

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
    console.log('Llamando a la API para obtener producto por ID:', id);
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

  // Subir imagen de producto (ajustado)
  async uploadProductImage(file: File, productId?: string): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (productId) {
      formData.append('productId', productId);
    }
    return await apiService.post<{ imageUrl: string }>(
      '/upload/product-image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  // Eliminar imagen de producto (nuevo)
  async deleteProductImage(fileName: string): Promise<void> {
    await apiService.delete(`/upload/image/${fileName}?subDirectory=products`);
  },
};

export const getProducts = async () => {
  const res = await apiService.get('/products');
  return res;
};

export const createProduct = async (data: ProductFormData) => {
  const res = await apiService.post('/products', data);
  return res;
};

export const updateProduct = async (id: string, data: ProductFormData) => {
  const res = await apiService.put(`/products/${id}`, data);
  return res;
};

export const deleteProduct = async (id: string) => {
  const res = await apiService.delete(`/products/${id}`);
  return res;
}; 