import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import FastOrdenLogo from '../../assets/FastOrden.png';
import {
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  BoltIcon,
  ArchiveBoxIcon,
  BanknotesIcon,
  UsersIcon,
  Cog6ToothIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const cajaMenu: SidebarItem[] = [
  {
    label: 'Pedido rápido',
    path: ROUTES.QUICK_ORDER,
    icon: <BoltIcon className="h-6 w-6 text-white" />,
  },
  {
    label: 'Órdenes',
    path: ROUTES.ORDERS,
    icon: <ClipboardDocumentListIcon className="h-6 w-6 text-white" />,
  },
  {
    label: 'Gestión de Clientes',
    path: ROUTES.CLIENTS,
    icon: <UsersIcon className="h-6 w-6 text-white" />,
  },
  {
    label: 'Gastos',
    path: ROUTES.EXPENSES,
    icon: <BanknotesIcon className="h-6 w-6 text-white" />,
  },
  {
    label: 'Configuración del Cajero',
    path: ROUTES.CASHIER_SETTINGS,
    icon: <Cog6ToothIcon className="h-6 w-6 text-white" />,
  },
];

const adminMenu: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: <HomeIcon className="h-6 w-6 text-white" />,
  },
  {
    label: 'Productos',
    path: ROUTES.PRODUCTS,
    icon: <CubeIcon className="h-6 w-6 text-white" />,
  },
  {
    label: 'Inventario',
    path: ROUTES.INVENTORY,
    icon: <ArchiveBoxIcon className="h-6 w-6 text-white" />,
  },
  {
    label: 'Gestión de Usuarios',
    path: '/users',
    icon: <UserGroupIcon className="h-6 w-6 text-white" />,
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<'caja' | 'admin'>('caja');

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = activeMenu === 'caja' ? cajaMenu : adminMenu;

  return (
    <div className="flex h-full w-64 flex-col bg-[#20446A] border-r border-gray-200">
      {/* Header del sidebar */}
      <div className="flex h-20 items-center gap-2 px-6 border-b border-gray-200">
        <img src={FastOrdenLogo} alt="FastOrden Logo" className="h-16 w-16 object-contain" />
        <span className="text-xl font-bold text-white tracking-tight">FastOrden</span>
      </div>
      {/* Switch de menú */}
      <div className="flex gap-2 px-4 py-3">
        <button
          className={`flex-1 py-2 rounded font-semibold text-sm transition-colors ${activeMenu === 'caja' ? 'bg-[#FF6F00] text-white' : 'bg-white text-[#20446A]'}`}
          onClick={() => setActiveMenu('caja')}
        >
          Menú Caja
        </button>
        <button
          className={`flex-1 py-2 rounded font-semibold text-sm transition-colors ${activeMenu === 'admin' ? 'bg-[#FF6F00] text-white' : 'bg-white text-[#20446A]'}`}
          onClick={() => setActiveMenu('admin')}
        >
          Menú Administración
        </button>
      </div>
      {/* Navegación */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              isActive(item.path)
                ? 'bg-[#FF6F00] text-white'
                : 'text-white hover:bg-[#FF6F00] hover:text-white'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
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
            <p className="text-sm font-medium text-white">Usuario</p>
            <p className="text-xs text-gray-200">usuario@ejemplo.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 