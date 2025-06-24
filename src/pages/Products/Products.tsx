import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ProductForm from '../../components/forms/ProductForm';
import type { ProductFormData } from '../../types';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../../services/products';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../../services/categories';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  image?: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      await createProduct(data);
      alert('Producto creado exitosamente');
      setIsModalOpen(false);
      await fetchProducts();
    } catch (error) {
      alert('Error al crear el producto');
      console.error(error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenCategoryModal = async () => {
    await fetchCategories();
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setCategoryName('');
    setEditingCategory(null);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    try {
      await createCategory({ name: categoryName });
      setCategoryName('');
      await fetchCategories();
    } catch (error) {
      alert('Error al crear la categoría');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditProduct = async (id: string, data: ProductFormData) => {
    try {
      await updateProduct(id, data);
      alert('Producto actualizado exitosamente');
      await fetchProducts();
    } catch (error) {
      alert('Error al actualizar el producto');
      console.error(error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      alert('Producto eliminado exitosamente');
      await fetchProducts();
    } catch (error) {
      alert('Error al eliminar el producto');
      console.error(error);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600">Gestiona tu catálogo de productos</p>
        </div>
        <Button variant="primary" onClick={handleOpenModal}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <Button variant="outline" className="w-full">
              Filtrar
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="card-body">
              {/* Product Image Placeholder */}
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🍕</span>
              </div>
              
              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Stock: {product.stock}</span>
                  <span>{product.category}</span>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍕</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer producto'
            }
          </p>
          <Button variant="primary" onClick={handleOpenModal}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Agregar Producto
          </Button>
        </div>
      )}

      {/* Create Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Crear Nuevo Producto"
        size="lg"
      >
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={handleCloseModal}
          onOpenCategoryModal={handleOpenCategoryModal}
          categories={categories}
        />
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        title="Gestionar Categorías"
        size="lg"
      >
        <form onSubmit={handleCreateCategory} className="flex gap-2 mb-4">
          <Input
            placeholder="Nueva categoría"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
          />
          <Button type="submit" variant="primary">Crear</Button>
        </form>
        <ul className="divide-y divide-gray-200">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between py-2">
              {editingCategory === cat.id ? (
                <form
                  className="flex gap-2 flex-1"
                  onSubmit={async e => {
                    e.preventDefault();
                    await updateCategory(cat.id, { name: categoryName });
                    setEditingCategory(null);
                    setCategoryName('');
                    await fetchCategories();
                  }}
                >
                  <Input
                    value={categoryName}
                    onChange={e => setCategoryName(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="primary" size="sm">Guardar</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setEditingCategory(null)}>Cancelar</Button>
                </form>
              ) : (
                <>
                  <span>{cat.name}</span>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => { setEditingCategory(cat.id); setCategoryName(cat.name); }}>Editar</Button>
                    <Button type="button" variant="danger" size="sm" onClick={async () => {
                      await deleteCategory(cat.id);
                      await fetchCategories();
                    }}>Eliminar</Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default Products; 