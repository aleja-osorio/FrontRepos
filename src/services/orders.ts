import { apiService } from './api';
import type { Order, CreateOrderData, UpdateOrderData, OrderFilters } from '../types';

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

// Servicio de órdenes
export const orderService = {
  // Obtener todas las órdenes
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const endpoint = filters ? `/orders?${params.toString()}` : '/orders';
    return await apiService.get<Order[]>(endpoint);
  },

  // Obtener una orden por ID
  async getOrderById(id: string): Promise<Order> {
    return await apiService.get<Order>(`/orders/${id}`);
  },

  // Crear una nueva orden
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    return await apiService.post<Order>('/orders', orderData);
  },

  // Actualizar una orden
  async updateOrder(id: string, orderData: UpdateOrderData): Promise<Order> {
    return await apiService.put<Order>(`/orders/${id}`, orderData);
  },

  // Eliminar una orden
  async deleteOrder(id: string): Promise<void> {
    await apiService.delete(`/orders/${id}`);
  },

  // Actualizar estado de una orden
  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    return await apiService.patch<Order>(`/orders/${id}/status`, { status });
  },

  // Obtener órdenes por estado
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    return await apiService.get<Order[]>(`/orders/status/${status}`);
  },

  // Obtener órdenes del día
  async getTodayOrders(): Promise<Order[]> {
    return await apiService.get<Order[]>('/orders/today');
  },

  // Obtener órdenes por rango de fechas
  async getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    return await apiService.get<Order[]>(`/orders/date-range?start=${startDate}&end=${endDate}`);
  },

  // Obtener estadísticas de órdenes
  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    preparing: number;
    ready: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  }> {
    return await apiService.get('/orders/stats');
  },

  // Obtener órdenes pendientes
  async getPendingOrders(): Promise<Order[]> {
    return this.getOrdersByStatus('pending');
  },

  // Obtener órdenes en preparación
  async getPreparingOrders(): Promise<Order[]> {
    return this.getOrdersByStatus('preparing');
  },

  // Obtener órdenes listas
  async getReadyOrders(): Promise<Order[]> {
    return this.getOrdersByStatus('ready');
  },

  // Marcar orden como entregada
  async markAsDelivered(id: string): Promise<Order> {
    return this.updateOrderStatus(id, 'delivered');
  },

  // Cancelar orden
  async cancelOrder(id: string, reason?: string): Promise<Order> {
    return await apiService.patch<Order>(`/orders/${id}/cancel`, { reason });
  },
}; 