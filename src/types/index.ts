// Tipos principales de la aplicación

// Tipos de usuario
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'cashier' | 'kitchen';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipos de producto
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

// Tipos de orden
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos de autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Tipos de filtros
export interface ProductFilters {
  category?: string;
  isActive?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface OrderFilters {
  status?: Order['status'];
  startDate?: string;
  endDate?: string;
  customerName?: string;
}

// Tipos de formularios
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

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}

export interface UpdateOrderData {
  status?: Order['status'];
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}

// Tipos de estado global
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Tipos de respuesta de API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos de notificaciones
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
}

// Tipos de configuración
export interface AppConfig {
  apiBaseUrl: string;
  appName: string;
  version: string;
  environment: 'development' | 'production' | 'staging';
} 