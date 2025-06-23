import api from './api';

export const createCategory = async (data: { name: string }) => {
  const res = await api.post('/categories', data);
  return res;
};

export const getCategories = async () => {
  const res = await api.get('/categories');
  return res.data;
};

export const updateCategory = async (id: string, data: { name: string }) => {
  const res = await api.put(`/categories/${id}`, data);
  return res;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/categories/${id}`);
  return res;
}; 