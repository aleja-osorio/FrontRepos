import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { ProductFormData } from '../../types';
import Modal from '../ui/Modal';
import { TrashIcon } from '@heroicons/react/24/outline';

// Definir el esquema de validación con Yup
const schema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  barcode: yup.string().required('El código de barras es requerido'),
  price: yup.number().typeError('El precio debe ser un número').required('El precio es requerido').min(0),
  productType: yup.string().oneOf(['simple', 'compuesto']).required(),
  includedItems: yup.array().when('productType', {
    is: 'compuesto',
    then: schema => schema.of(
      yup.object().shape({
        itemId: yup.string().required(),
        itemName: yup.string().required(),
        quantity: yup.number().required().min(1),
      })
    ).min(1, 'Debe agregar al menos un item al producto compuesto'),
    otherwise: schema => schema.notRequired(),
  }),
  offerPrice: yup.number().typeError('El precio de oferta debe ser un número').min(0).notRequired(),
  description: yup.string().required('La descripción es requerida'),
  preparationTime: yup.number().typeError('El tiempo de preparación debe ser un número').integer().min(0).notRequired(),
  category: yup.string().required('La categoría es requerida'),
  image: yup.mixed().notRequired(),
});

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  initialData?: ProductFormData;
  isSubmitting?: boolean;
}

const TABS = [
  { key: 'info', label: 'Información' },
  { key: 'content', label: 'Opciones Cliente' },
  { key: 'image', label: 'Imágenes' },
];

const mockAvailableItems = [
    { id: '1', name: 'Hamburguesa Sola' },
    { id: '2', name: 'Papas Fritas Chicas' },
    { id: '3', name: 'Gaseosa 500ml' },
    { id: '4', name: 'Agua Mineral' },
];

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel, initialData, isSubmitting }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentName, setContentName] = useState('');
  const [contentType, setContentType] = useState('');
  const [contentError, setContentError] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  
  const { register, control, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      productType: 'simple',
      includedItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "includedItems",
  });

  const productType = watch('productType');
  const imageFile = watch('image');
  
  const handleAddIncludedItem = () => {
    if (!selectedItemId || itemQuantity < 1) return;

    const isAlreadyAdded = fields.some(field => field.itemId === selectedItemId);
    if (isAlreadyAdded) {
      alert('Este item ya ha sido agregado.');
      return;
    }

    const selectedItem = mockAvailableItems.find(item => item.id === selectedItemId);
    if (selectedItem) {
      append({ itemId: selectedItem.id, itemName: selectedItem.name, quantity: itemQuantity });
      setSelectedItemId('');
      setItemQuantity(1);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue('image', e.target.files[0] as any);
    }
  };

  const handleOpenContentModal = () => {
    setContentName('');
    setContentType('');
    setContentError('');
    setIsContentModalOpen(true);
  };
  const handleCloseContentModal = () => setIsContentModalOpen(false);
  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentName.trim() || !contentType) {
      setContentError('Todos los campos son obligatorios');
      return;
    }
    // Aquí puedes manejar el guardado real del contenido
    alert(`Contenido creado: ${contentName} (${contentType})`);
    setIsContentModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        {TABS.map(tab => (
          <button
            type="button"
            key={tab.key}
            className={`px-4 py-2 -mb-px border-b-2 font-medium focus:outline-none transition-colors duration-200 ${activeTab === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-primary-600'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">Código de Barras</label>
            <Input id="barcode" {...register('barcode')} />
            {errors.barcode && <p className="mt-1 text-sm text-red-600">{errors.barcode.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
              <Input id="price" type="number" step="0.01" {...register('price')} />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
            </div>
            <div>
              <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700">Precio de Oferta (opcional)</label>
              <Input id="offerPrice" type="number" step="0.01" {...register('offerPrice')} />
              {errors.offerPrice && <p className="mt-1 text-sm text-red-600">{errors.offerPrice.message}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
            <select id="category" {...register('category')} className="input">
              <option value="">Selecciona una categoría</option>
              <option value="Hamburguesas">Hamburguesas</option>
              <option value="Pizzas">Pizzas</option>
              <option value="Ensaladas">Ensaladas</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Postres">Postres</option>
              <option value="Otros">Otros</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>
          <div>
            <label htmlFor="preparationTime" className="block text-sm font-medium text-gray-700">Tiempo de Preparación (minutos, opcional)</label>
            <Input id="preparationTime" type="number" {...register('preparationTime')} />
            {errors.preparationTime && <p className="mt-1 text-sm text-red-600">{errors.preparationTime.message}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea id="description" {...register('description')} rows={3} className="input" />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Tipo de producto */}
          <div className="pt-2">
            <span className="block text-sm font-medium text-gray-700">Tipo de producto</span>
            <div className="flex items-center space-x-4 mt-1">
              <label className="flex items-center">
                <input {...register('productType')} type="radio" value="simple" className="form-radio" />
                <span className="ml-2">Simple</span>
              </label>
              <label className="flex items-center">
                <input {...register('productType')} type="radio" value="compuesto" className="form-radio" />
                <span className="ml-2">Compuesto</span>
              </label>
            </div>
          </div>

          {productType === 'compuesto' && (
            <div className="p-4 border-l-4 border-primary-500 bg-primary-50 rounded-r-md space-y-3">
              <h3 className="text-md font-semibold text-gray-800">Items Incluidos</h3>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item a incluir</label>
                  <select value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)} className="input">
                    <option value="">Seleccionar item...</option>
                    {mockAvailableItems.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unidades</label>
                  <Input type="number" value={itemQuantity} onChange={e => setItemQuantity(parseInt(e.target.value, 10) || 1)} min="1" className="w-20" />
                </div>
                <Button type="button" variant="outline" onClick={handleAddIncludedItem}>Agregar</Button>
              </div>

              <div className="mt-4 space-y-2">
                {fields.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between bg-white p-2 rounded-md border text-sm">
                    <span>{item.itemName} x {item.quantity}</span>
                    <button type="button" onClick={() => remove(index)} className="p-1 text-red-500 hover:text-red-700">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {fields.length === 0 && <p className="text-center text-sm text-gray-500 py-2">Aún no hay items incluidos.</p>}
              </div>
              {errors.includedItems && <p className="mt-2 text-sm text-red-600">{errors.includedItems.message}</p>}
            </div>
          )}
        </div>
      )}
      {activeTab === 'content' && (
        <div className="flex justify-center py-8">
          <Button type="button" variant="primary" onClick={handleOpenContentModal}>
            Agregar contenido del producto
          </Button>
          <Modal
            isOpen={isContentModalOpen}
            onClose={handleCloseContentModal}
            title="Agregar contenido del producto"
            size="sm"
          >
            <form onSubmit={handleCreateContent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del contenido</label>
                <Input
                  value={contentName}
                  onChange={e => setContentName(e.target.value)}
                  placeholder="Ej: Salsa extra, Guarnición, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de contenido</label>
                <select
                  className="input"
                  value={contentType}
                  onChange={e => setContentType(e.target.value)}
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="opcion_complementaria">Opción complementaria</option>
                  <option value="opcion_extraible">Opción extraíble</option>
                </select>
              </div>
              {contentError && <p className="text-center text-red-600 text-sm">{contentError}</p>}
              <div className="flex justify-center">
                <Button type="submit" variant="primary">
                  Crear nueva opción
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      )}
      {activeTab === 'image' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagen del producto (opcional)</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input"
            />
            {imageFile && imageFile instanceof File && (
              <div className="mt-2">
                <span className="text-sm text-gray-700">Imagen seleccionada: {imageFile.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm; 