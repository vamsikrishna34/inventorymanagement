import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../services/api';
import toast from 'react-hot-toast';

export const useProducts = (params = {}) => 
  useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params).then(res => res.data)
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => { toast.success('Product created'); qc.invalidateQueries({ queryKey: ['products'] }); },
    onError: (err) => toast.error(err.response?.data?.error || 'Create failed')
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => productsApi.update(id, data),
    onSuccess: () => { toast.success('Product updated'); qc.invalidateQueries({ queryKey: ['products'] }); },
    onError: (err) => toast.error(err.response?.data?.error || 'Update failed')
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => { toast.success('Product deleted'); qc.invalidateQueries({ queryKey: ['products'] }); },
    onError: (err) => toast.error(err.response?.data?.error || 'Delete failed')
  });
};

export const useStockOperation = (type) => {
  const qc = useQueryClient();
  const mutationFn = type === 'in' ? productsApi.stockIn : productsApi.stockOut;
  return useMutation({
    mutationFn: ({ id, ...data }) => mutationFn(id, data),
    onSuccess: (res) => {
      toast.success(res.data.message);
      if (res.data.warning) toast.warning(res.data.warning, { duration: 4000 });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Stock operation failed')
  });
};