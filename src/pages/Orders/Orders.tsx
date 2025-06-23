import React, { useState, useEffect } from 'react';
import { PlusIcon, EyeIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';

interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedTime?: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    // Simular carga de órdenes
    const loadOrders = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockOrders: Order[] = [
          {
            id: 'ORD-001',
            customerName: 'Juan Pérez',
            items: [
              { id: '1', name: 'Hamburguesa Clásica', quantity: 2, price: 8.50 },
              { id: '2', name: 'Refresco Cola', quantity: 2, price: 2.50 },
            ],
            total: 22.00,
            status: 'pending',
            createdAt: '2024-01-15T10:30:00Z',
            estimatedTime: '15 min',
          },
          {
            id: 'ORD-002',
            customerName: 'María García',
            items: [
              { id: '3', name: 'Pizza Margherita', quantity: 1, price: 12.00 },
              { id: '4', name: 'Ensalada César', quantity: 1, price: 6.50 },
            ],
            total: 18.50,
            status: 'preparing',
            createdAt: '2024-01-15T10:25:00Z',
            estimatedTime: '20 min',
          },
          {
            id: 'ORD-003',
            customerName: 'Carlos López',
            items: [
              { id: '1', name: 'Hamburguesa Clásica', quantity: 1, price: 8.50 },
              { id: '5', name: 'Papas Fritas', quantity: 1, price: 3.50 },
            ],
            total: 12.00,
            status: 'ready',
            createdAt: '2024-01-15T10:20:00Z',
          },
          {
            id: 'ORD-004',
            customerName: 'Ana Martínez',
            items: [
              { id: '3', name: 'Pizza Margherita', quantity: 2, price: 12.00 },
            ],
            total: 24.00,
            status: 'delivered',
            createdAt: '2024-01-15T10:15:00Z',
          },
        ];
        
        setOrders(mockOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const statusOptions = [
    { value: 'all', label: 'Todas las órdenes' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'preparing', label: 'En Preparación' },
    { value: 'ready', label: 'Listas' },
    { value: 'delivered', label: 'Entregadas' },
    { value: 'cancelled', label: 'Canceladas' },
  ];

  const filteredOrders = orders.filter(order => 
    selectedStatus === 'all' || order.status === selectedStatus
  );

  const getStatusInfo = (status: Order['status']) => {
    const statusConfig = {
      pending: {
        label: 'Pendiente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: ClockIcon,
      },
      preparing: {
        label: 'En Preparación',
        color: 'bg-blue-100 text-blue-800',
        icon: ClockIcon,
      },
      ready: {
        label: 'Lista',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon,
      },
      delivered: {
        label: 'Entregada',
        color: 'bg-gray-100 text-gray-800',
        icon: CheckCircleIcon,
      },
      cancelled: {
        label: 'Cancelada',
        color: 'bg-red-100 text-red-800',
        icon: XCircleIcon,
      },
    };
    return statusConfig[status];
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Órdenes</h1>
          <p className="text-gray-600">Gestiona las órdenes de tus clientes</p>
        </div>
        <Button variant="primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Orden
        </Button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-wrap gap-4">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedStatus === option.value
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div key={order.id} className="card hover:shadow-md transition-shadow">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Cliente: {order.customerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">
                          ${order.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-gray-600">
                            ${(item.quantity * item.price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-4 w-4 mr-1" />
                          {statusInfo.label}
                        </span>
                        {order.estimatedTime && (
                          <span className="text-sm text-gray-500">
                            ⏱️ {order.estimatedTime}
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Ver Detalles
                        </Button>
                        
                        {order.status === 'pending' && (
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'preparing')}
                          >
                            Iniciar Preparación
                          </Button>
                        )}
                        
                        {order.status === 'preparing' && (
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'ready')}
                          >
                            Marcar como Lista
                          </Button>
                        )}
                        
                        {order.status === 'ready' && (
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'delivered')}
                          >
                            Entregar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay órdenes</h3>
          <p className="text-gray-600 mb-4">
            {selectedStatus !== 'all' 
              ? 'No hay órdenes con el estado seleccionado'
              : 'Comienza creando tu primera orden'
            }
          </p>
          <Button variant="primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Crear Orden
          </Button>
        </div>
      )}
    </div>
  );
};

export default Orders; 