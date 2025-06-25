import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { ProductFormData } from '../../types';
import Modal from '../ui/Modal';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

// Definir el esquema de validación con Yup
const schema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  barcode: yup.string().notRequired(),
  price: yup.number().typeError('El precio debe ser un número').notRequired().min(0),
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
  offerPrice: yup
    .number()
    .typeError('El precio de oferta debe ser un número')
    .min(0)
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .notRequired(),
  description: yup.string().notRequired(),
  preparationTime: yup
    .number()
    .typeError('El tiempo de preparación debe ser un número')
    .integer()
    .min(0)
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .notRequired(),
  category: yup.string().required('La categoría es requerida'),
  image: yup.mixed().notRequired(),
});

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  initialData?: ProductFormData;
  isSubmitting?: boolean;
  onOpenCategoryModal: () => void;
  categories?: { id: string; name: string }[];
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

// NUEVO: Tipos para opciones de producto
interface ProductOptionValue {
  id: string;
  name: string;
}
interface ProductOptionGroup {
  id: string;
  name: string;
  type: 'extraible' | 'complementaria';
  values: ProductOptionValue[];
  expanded: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel, initialData, isSubmitting, onOpenCategoryModal, categories }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentName, setContentName] = useState('');
  const [contentType, setContentType] = useState('');
  const [contentError, setContentError] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  
  const { register, control, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      productType: 'simple',
      includedItems: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      console.log('ProductForm recibe initialData:', initialData);
      reset(initialData);
      // Inicializar optionGroups con los datos de clientOptions
      if (Array.isArray(initialData.clientOptions)) {
        setOptionGroups(
          initialData.clientOptions.map((group, idx) => ({
            id: String(idx + 1),
            name: group.name,
            type: group.type as 'extraible' | 'complementaria',
            values: group.values.map((v, vIdx) => ({
              id: String(vIdx + 1),
              name: v.name,
            })),
            expanded: false,
          }))
        );
      }
    }
  }, [initialData, reset]);

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

  // NUEVO: Estado para grupos y valores de opciones
  const [optionGroups, setOptionGroups] = useState<ProductOptionGroup[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState<'extraible' | 'complementaria'>('complementaria');
  const [groupError, setGroupError] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [editingGroupType, setEditingGroupType] = useState<'extraible' | 'complementaria'>('complementaria');
  const [newValueName, setNewValueName] = useState('');
  const [valueError, setValueError] = useState('');
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [editingValueId, setEditingValueId] = useState<string | null>(null);
  const [editingValueName, setEditingValueName] = useState('');

  // NUEVO: Funciones para grupos
  const handleAddGroup = () => {
    if (!newGroupName.trim()) {
      setGroupError('El nombre del grupo es obligatorio');
      return;
    }
    setOptionGroups([
      ...optionGroups,
      { id: Date.now().toString(), name: newGroupName, type: newGroupType, values: [], expanded: true },
    ]);
    setNewGroupName('');
    setNewGroupType('complementaria');
    setGroupError('');
  };
  const handleDeleteGroup = (groupId: string) => {
    setOptionGroups(optionGroups.filter(g => g.id !== groupId));
    if (activeGroupId === groupId) setActiveGroupId(null);
  };
  const handleEditGroup = (groupId: string) => {
    const group = optionGroups.find(g => g.id === groupId);
    if (group) {
      setEditingGroupId(groupId);
      setEditingGroupName(group.name);
      setEditingGroupType(group.type);
    }
  };
  const handleSaveEditGroup = (groupId: string) => {
    setOptionGroups(optionGroups.map(g => g.id === groupId ? { ...g, name: editingGroupName, type: editingGroupType } : g));
    setEditingGroupId(null);
    setEditingGroupName('');
    setEditingGroupType('complementaria');
  };
  const handleToggleGroup = (groupId: string) => {
    setOptionGroups(optionGroups.map(g => g.id === groupId ? { ...g, expanded: !g.expanded } : g));
  };

  // NUEVO: Funciones para valores
  const handleAddValue = (groupId: string) => {
    if (!newValueName.trim()) {
      setValueError('El nombre es obligatorio');
      return;
    }
    setOptionGroups(optionGroups.map(g =>
      g.id === groupId
        ? { ...g, values: [...g.values, { id: Date.now().toString(), name: newValueName }] }
        : g
    ));
    setNewValueName('');
    setValueError('');
  };
  const handleDeleteValue = (groupId: string, valueId: string) => {
    setOptionGroups(optionGroups.map(g =>
      g.id === groupId ? { ...g, values: g.values.filter(v => v.id !== valueId) } : g
    ));
  };

  // NUEVO: Editar opción
  const handleEditValue = (groupId: string, valueId: string, currentName: string) => {
    setActiveGroupId(groupId);
    setEditingValueId(valueId);
    setEditingValueName(currentName);
  };
  const handleSaveEditValue = (groupId: string, valueId: string) => {
    setOptionGroups(optionGroups.map(g =>
      g.id === groupId
        ? { ...g, values: g.values.map(v => v.id === valueId ? { ...v, name: editingValueName } : v) }
        : g
    ));
    setEditingValueId(null);
    setEditingValueName('');
  };

  const handleSubmitWithOptionsValidation = (data: ProductFormData) => {
    // Si hay grupos, todos deben tener al menos una opción
    if (optionGroups.length > 0 && optionGroups.some(g => g.values.length === 0)) {
      alert('Todos los grupos deben tener al menos una opción.');
      return;
    }
    // Transformar category -> categoryId y optionGroups -> clientOptions
    const payload = {
      ...data,
      categoryId: data.category,
      clientOptions: optionGroups.map(group => ({
        name: group.name,
        type: group.type,
        values: group.values.map(v => ({ name: v.name })),
      })),
    };
    delete payload.category;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitWithOptionsValidation)} className="space-y-4">
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
          <div className="flex items-center gap-2">
            <select id="category" {...register('category')} className="input flex-1">
              <option value="">Selecciona una categoría</option>
              {categories && categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button
              type="button"
              className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              title="Agregar nueva categoría"
              onClick={onOpenCategoryModal}
            >
              <PlusIcon className="h-5 w-5" />
            </button>
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
        <div className="space-y-6">
          {/* Botón para agregar grupo */}
          <div className="flex gap-2 mb-2 items-end">
            <div className="flex flex-col flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del grupo</label>
              <Input
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                placeholder="Nombre del grupo (ej: Salsas)"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddGroup(); } }}
              />
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center text-xs">
                  <input
                    type="radio"
                    name="newGroupType"
                    value="complementaria"
                    checked={newGroupType === 'complementaria'}
                    onChange={() => setNewGroupType('complementaria')}
                    className="form-radio"
                  />
                  <span className="ml-1">Complementaria</span>
                </label>
                <label className="flex items-center text-xs">
                  <input
                    type="radio"
                    name="newGroupType"
                    value="extraible"
                    checked={newGroupType === 'extraible'}
                    onChange={() => setNewGroupType('extraible')}
                    className="form-radio"
                  />
                  <span className="ml-1">Extraíble</span>
                </label>
              </div>
              <Button type="button" variant="primary" className="mt-3 w-fit" onClick={handleAddGroup}>Agregar grupo</Button>
            </div>
          </div>
          {groupError && <p className="text-sm text-red-600 mb-2">{groupError}</p>}
          {/* Grupos de opciones tipo acordeón */}
          <div className="space-y-4">
            {optionGroups.map(group => (
              <div key={group.id} className="border rounded-lg bg-white">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                  <button type="button" className="focus:outline-none" onClick={() => handleToggleGroup(group.id)}>
                    <span className={`inline-block transform transition-transform ${group.expanded ? 'rotate-90' : ''}`}>▶</span>
                  </button>
                  {editingGroupId === group.id ? (
                    <>
                      <Input
                        value={editingGroupName}
                        onChange={e => setEditingGroupName(e.target.value)}
                        className="mr-2"
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex items-center text-xs">
                          <input
                            type="radio"
                            name={`editGroupType-${group.id}`}
                            value="complementaria"
                            checked={editingGroupType === 'complementaria'}
                            onChange={() => setEditingGroupType('complementaria')}
                            className="form-radio"
                          />
                          <span className="ml-1">Complementaria</span>
                        </label>
                        <label className="flex items-center text-xs">
                          <input
                            type="radio"
                            name={`editGroupType-${group.id}`}
                            value="extraible"
                            checked={editingGroupType === 'extraible'}
                            onChange={() => setEditingGroupType('extraible')}
                            className="form-radio"
                          />
                          <span className="ml-1">Extraíble</span>
                        </label>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => handleSaveEditGroup(group.id)}>Guardar</Button>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-primary-700 flex-1 text-center cursor-pointer" onClick={() => handleToggleGroup(group.id)}>
                        {group.name} <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">{group.type === 'complementaria' ? 'Complementaria' : 'Extraíble'}</span>
                      </span>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => handleEditGroup(group.id)}>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" /></svg>
                        </Button>
                        <Button type="button" variant="danger" size="sm" onClick={() => handleDeleteGroup(group.id)} className="bg-red-600 hover:bg-red-700 p-1 rounded">
                          <TrashIcon className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                {group.expanded && (
                  <div className="p-4 space-y-2">
                    {/* Lista de opciones */}
                    <ul className="space-y-1">
                      {group.values.map(value => (
                        <li key={value.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          {editingValueId === value.id ? (
                            <>
                              <Input
                                value={editingValueName}
                                onChange={e => setEditingValueName(e.target.value)}
                                className="mr-2"
                              />
                              <Button type="button" variant="outline" size="sm" onClick={() => handleSaveEditValue(group.id, value.id)}>Guardar</Button>
                            </>
                          ) : (
                            <>
                              <span>{value.name}</span>
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => handleEditValue(group.id, value.id, value.name)}>
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" /></svg>
                                </Button>
                                <Button type="button" variant="danger" size="sm" onClick={() => handleDeleteValue(group.id, value.id)} className="bg-red-600 hover:bg-red-700 p-1 rounded">
                                  <TrashIcon className="h-4 w-4 text-white" />
                                </Button>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                      {group.values.length === 0 && <li className="text-sm text-gray-500">Aún no hay opciones en este grupo.</li>}
                    </ul>
                    {/* Formulario para agregar opción */}
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={activeGroupId === group.id ? newValueName : ''}
                        onChange={e => {
                          setActiveGroupId(group.id);
                          setNewValueName(e.target.value);
                        }}
                        placeholder="Nombre de la opción (ej: BBQ, Mostaza)"
                      />
                      <Button type="button" variant="primary" onClick={() => { setActiveGroupId(group.id); handleAddValue(group.id); }}>Agregar</Button>
                    </div>
                    {valueError && activeGroupId === group.id && <p className="text-sm text-red-600 mb-2">{valueError}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
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