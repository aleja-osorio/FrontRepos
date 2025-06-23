# Configuración de Tailwind CSS + Headless UI

Este proyecto utiliza **Tailwind CSS** junto con **Headless UI** para crear una interfaz moderna y accesible.

## 🎨 Tailwind CSS

### ¿Qué es Tailwind CSS?
Tailwind CSS es un framework CSS utility-first que permite construir diseños personalizados sin salir de tu HTML. Proporciona clases de utilidad de bajo nivel que te permiten construir cualquier diseño.

### Ventajas de Tailwind CSS:
- ✅ **Flexibilidad total**: Control completo sobre el diseño
- ✅ **Rendimiento optimizado**: Solo incluye los estilos que usas
- ✅ **Desarrollo rápido**: Clases intuitivas y reutilizables
- ✅ **Responsive por defecto**: Sistema de breakpoints integrado
- ✅ **Personalizable**: Fácil configuración de colores, espaciado, etc.
- ✅ **Bundle size pequeño**: En producción, solo incluye CSS usado

### Configuración del Proyecto

#### Archivos de configuración:
- `tailwind.config.js` - Configuración principal de Tailwind
- `postcss.config.js` - Configuración de PostCSS
- `src/index.css` - Estilos base y componentes personalizados

#### Colores personalizados:
```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Color principal
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
}
```

#### Clases de componentes personalizadas:
```css
/* src/index.css */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200;
  }
  
  .btn-primary {
    @apply btn bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
  }
  
  .input {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500;
  }
  
  .card {
    @apply bg-white rounded-lg shadow border border-gray-200;
  }
}
```

## 🧩 Headless UI

### ¿Qué es Headless UI?
Headless UI es una biblioteca de componentes completamente desacoplados del estilo. Proporciona funcionalidad de accesibilidad y comportamiento sin imponer ningún estilo visual.

### Componentes disponibles:
- **Dialog** - Modales y overlays
- **Menu** - Menús desplegables
- **Listbox** - Listas seleccionables
- **Combobox** - Campos de búsqueda con autocompletado
- **Switch** - Toggles
- **RadioGroup** - Grupos de radio buttons
- **Tab** - Pestañas
- **Transition** - Animaciones

### Ejemplo de uso:
```tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

function Modal() {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>
        
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full">
            <Dialog.Title>Mi Modal</Dialog.Title>
            <Dialog.Description>Descripción del modal</Dialog.Description>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
```

## 🎯 Iconos - Heroicons

El proyecto utiliza **Heroicons** para los iconos:

```tsx
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

// Uso
<PlusIcon className="h-5 w-5" />
```

## 📱 Componentes UI Personalizados

### Button
```tsx
<Button 
  variant="primary" 
  size="md" 
  loading={false}
  onClick={handleClick}
>
  Mi Botón
</Button>
```

Variantes disponibles:
- `primary` - Botón principal (azul)
- `secondary` - Botón secundario (gris)
- `danger` - Botón de peligro (rojo)
- `success` - Botón de éxito (verde)
- `outline` - Botón con borde

### Input
```tsx
<Input
  label="Mi Campo"
  type="text"
  placeholder="Escribe aquí..."
  value={value}
  onChange={handleChange}
  error={error}
  required
/>
```

### Layout y Sidebar
- `Layout.tsx` - Layout principal con sidebar y header
- `Sidebar.tsx` - Navegación lateral responsive

## 🎨 Guía de Estilos

### Colores principales:
- **Primary**: Azul (#3b82f6) - Acciones principales
- **Success**: Verde (#10b981) - Éxito, confirmación
- **Danger**: Rojo (#ef4444) - Errores, eliminación
- **Warning**: Amarillo (#f59e0b) - Advertencias
- **Gray**: Grises para texto y bordes

### Espaciado:
- Usar el sistema de espaciado de Tailwind: `p-4`, `m-2`, `space-y-6`
- Consistencia en el espaciado entre secciones

### Tipografía:
- **Títulos**: `text-2xl font-bold text-gray-900`
- **Subtítulos**: `text-lg font-semibold text-gray-900`
- **Texto normal**: `text-gray-700`
- **Texto secundario**: `text-gray-600`
- **Texto pequeño**: `text-sm text-gray-500`

### Sombras y bordes:
- **Cards**: `shadow border border-gray-200`
- **Hover effects**: `hover:shadow-lg transition-shadow duration-200`
- **Focus states**: `focus:ring-2 focus:ring-primary-500`

## 🚀 Mejores Prácticas

1. **Usar clases de componentes**: Preferir `.btn-primary` sobre clases individuales
2. **Responsive design**: Usar breakpoints de Tailwind (`md:`, `lg:`, `xl:`)
3. **Accesibilidad**: Headless UI maneja automáticamente la accesibilidad
4. **Consistencia**: Mantener consistencia en colores, espaciado y tipografía
5. **Performance**: Tailwind purga automáticamente CSS no usado

## 📦 Dependencias

```json
{
  "dependencies": {
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.0.18"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
```

## 🔧 Comandos útiles

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de producción
npm run preview
```

## 📚 Recursos adicionales

- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Headless UI](https://headlessui.com/)
- [Heroicons](https://heroicons.com/)
- [Tailwind CSS Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet) 