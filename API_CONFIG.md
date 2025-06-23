# Configuración de la API

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de la API
VITE_API_BASE_URL=http://localhost:8080/api

# Configuración de la aplicación
VITE_APP_NAME=POS Comidas Rápidas
VITE_APP_VERSION=1.0.0

# Configuración de desarrollo
VITE_DEBUG=true
```

## Configuración de Axios

La aplicación utiliza Axios para las llamadas HTTP con las siguientes características:

### Interceptores Configurados

1. **Interceptor de Request**: Añade automáticamente el token JWT a todas las peticiones
2. **Interceptor de Response**: Maneja errores de autenticación (401) redirigiendo al login

### Configuración Base

- **Base URL**: `http://localhost:8080/api`
- **Timeout**: 10 segundos
- **Headers**: `Content-Type: application/json`

### Uso de los Servicios

```typescript
import { apiService } from './services/api';

// GET request
const products = await apiService.get<Product[]>('/products');

// POST request
const newProduct = await apiService.post<Product>('/products', productData);

// PUT request
const updatedProduct = await apiService.put<Product>(`/products/${id}`, productData);

// DELETE request
await apiService.delete(`/products/${id}`);

// PATCH request
const updatedStock = await apiService.patch<Product>(`/products/${id}/stock`, { stock: 10 });
```

## Autenticación

El sistema maneja automáticamente:

- Almacenamiento del token en `localStorage` como `authToken`
- Almacenamiento del usuario en `localStorage` como `user`
- Limpieza automática de datos al recibir error 401
- Redirección automática al login cuando sea necesario

## Servicios Disponibles

### AuthService
- `login(credentials)`
- `logout()`
- `register(userData)`
- `getCurrentUser()`
- `isAuthenticated()`

### ProductService
- `getProducts(filters?)`
- `getProductById(id)`
- `createProduct(productData)`
- `updateProduct(id, productData)`
- `deleteProduct(id)`
- `updateStock(id, stock)`

### OrderService
- `getOrders(filters?)`
- `getOrderById(id)`
- `createOrder(orderData)`
- `updateOrder(id, orderData)`
- `updateOrderStatus(id, status)`
- `getOrderStats()`

## Manejo de Errores

Los errores se manejan de forma centralizada:

1. **Errores de red**: Se propagan para manejo específico en componentes
2. **Errores 401**: Se manejan automáticamente limpiando la sesión
3. **Otros errores**: Se pueden capturar en los componentes usando try/catch

## Ejemplo de Uso en Componente

```typescript
import { useState, useEffect } from 'react';
import { productService } from '../services/products';
import type { Product } from '../types';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        setError('Error al cargar productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ... resto del componente
};
``` 