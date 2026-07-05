import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  stockIn: (id, data) => api.post(`/products/${id}/stock-in`, data),
  stockOut: (id, data) => api.post(`/products/${id}/stock-out`, data),
  getLowStock: () => api.get('/products/low-stock')
};