import React, { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const loadDashboardData = async () => {
      try {
        // Aquí irían las llamadas reales a la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalSales: 15420.50,
          totalOrders: 127,
          totalProducts: 45,
          totalCustomers: 89,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Ventas Totales',
      value: `$${stats.totalSales.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Órdenes',
      value: stats.totalOrders.toString(),
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Productos',
      value: stats.totalProducts.toString(),
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      change: '+3%',
      changeType: 'positive',
    },
    {
      title: 'Clientes',
      value: stats.totalCustomers.toString(),
      icon: UsersIcon,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'positive',
    },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen de tu negocio</p>
        </div>
        <Button variant="primary">
          Generar Reporte
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Órdenes Recientes</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {[1, 2, 3].map((order) => (
                <div key={order} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Orden #{1000 + order}</p>
                    <p className="text-sm text-gray-500">Cliente {order}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${(25.50 * order).toFixed(2)}</p>
                    <p className="text-sm text-green-600">Completada</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Ver todas las órdenes
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="primary" className="h-16">
                <div className="text-center">
                  <div className="text-lg">📦</div>
                  <div className="text-sm">Nuevo Producto</div>
                </div>
              </Button>
              <Button variant="success" className="h-16">
                <div className="text-center">
                  <div className="text-lg">📋</div>
                  <div className="text-sm">Nueva Orden</div>
                </div>
              </Button>
              <Button variant="secondary" className="h-16">
                <div className="text-center">
                  <div className="text-lg">👥</div>
                  <div className="text-sm">Nuevo Cliente</div>
                </div>
              </Button>
              <Button variant="outline" className="h-16">
                <div className="text-center">
                  <div className="text-lg">📊</div>
                  <div className="text-sm">Reportes</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 