import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

interface SidebarItem {
  label: string;
  path: string;
  icon: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      path: ROUTES.DASHBOARD,
      icon: '📊',
    },
    {
      label: 'Productos',
      path: ROUTES.PRODUCTS,
      icon: '📦',
    },
    {
      label: 'Órdenes',
      path: ROUTES.ORDERS,
      icon: '📋',
    },
    {
      label: 'Reportes',
      path: ROUTES.REPORTS,
      icon: '📈',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Header del sidebar */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          POS Comidas
        </h1>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              isActive(item.path)
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer del sidebar */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">U</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Usuario</p>
            <p className="text-xs text-gray-500">usuario@ejemplo.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 