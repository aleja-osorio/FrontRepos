// Constantes de la aplicación

// Configuración de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
};

// Estados de órdenes
export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pendiente',
  [ORDER_STATUS.PREPARING]: 'En Preparación',
  [ORDER_STATUS.READY]: 'Listo',
  [ORDER_STATUS.DELIVERED]: 'Entregado',
  [ORDER_STATUS.CANCELLED]: 'Cancelado',
} as const;

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  CASHIER: 'cashier',
  KITCHEN: 'kitchen',
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.CASHIER]: 'Cajero',
  [USER_ROLES.KITCHEN]: 'Cocina',
} as const;

// Categorías de productos
export const PRODUCT_CATEGORIES = [
  'Hamburguesas',
  'Bebidas',
  'Acompañamientos',
  'Postres',
  'Combos',
  'Otros',
] as const;

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
} as const;

// Configuración de notificaciones
export const NOTIFICATION = {
  DEFAULT_DURATION: 5000,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 7000,
} as const;

// Configuración de validación
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PRODUCT_NAME_LENGTH: 100,
  MAX_PRODUCT_DESCRIPTION_LENGTH: 500,
  MIN_PRODUCT_PRICE: 0,
  MAX_PRODUCT_PRICE: 999999,
  MIN_STOCK: 0,
  MAX_STOCK: 999999,
} as const;

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'POS Comidas Rápidas',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema de punto de venta para comidas rápidas',
} as const;

// Configuración de rutas
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  QUICK_ORDER: '/quick-order',
  INVENTORY: '/inventory',
  EXPENSES: '/expenses',
  CLIENTS: '/clients',
  CASHIER_SETTINGS: '/cashier-settings',
} as const;

// Configuración de colores para estados
export const STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: '#f59e0b', // amber-500
  [ORDER_STATUS.PREPARING]: '#3b82f6', // blue-500
  [ORDER_STATUS.READY]: '#10b981', // emerald-500
  [ORDER_STATUS.DELIVERED]: '#059669', // emerald-600
  [ORDER_STATUS.CANCELLED]: '#ef4444', // red-500
} as const;

// Configuración de moneda
export const CURRENCY = {
  SYMBOL: '$',
  CODE: 'USD',
  LOCALE: 'es-US',
} as const;

// Configuración de fecha y hora
export const DATE_TIME = {
  LOCALE: 'es-ES',
  DATE_FORMAT: 'dd/MM/yyyy',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
} as const; 