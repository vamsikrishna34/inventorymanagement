import { useState } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useStockOperation } from '../hooks/useProducts';
import ProductForm from '../components/ProductForm';
import StockModal from '../components/StockModal';

export default function Products() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockProduct, setStockProduct] = useState(null);
  const [stockType, setStockType] = useState('in');

  const { data, isLoading, isError } = useProducts({ page, limit, category: categoryFilter });
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const remove = useDeleteProduct();
  const stockIn = useStockOperation('in');
  const stockOut = useStockOperation('out');

  const handleFormSubmit = (formData) => {
    if (editingProduct) {
      update.mutate({ id: editingProduct._id, ...formData }, { onSuccess: () => setEditingProduct(null) });
    } else {
      create.mutate(formData, { onSuccess: () => setEditingProduct(null) });
    }
  };

  const handleStockSubmit = (data) => {
    const mutation = stockType === 'in' ? stockIn : stockOut;
    mutation.mutate(data, { onSuccess: () => setStockProduct(null) });
  };

  if (isError) return <p className="text-center text-red-500 mt-8">Failed to load inventory data.</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Inventory</h2>
        <button onClick={() => setEditingProduct({})} className="btn-primary">+ Add Product</button>
      </div>

      {editingProduct && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <ProductForm 
            initialData={Object.keys(editingProduct).length === 0 ? undefined : editingProduct}
            onSubmit={handleFormSubmit}
            isSubmitting={create.isPending || update.isPending}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="input w-32">
          {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n} per page</option>)}
        </select>
        <input 
          placeholder="Filter by Category ID..." 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)} 
          className="input flex-1" 
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">SKU</th>
              <th className="p-3">Name</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5" className="p-6 text-center">Loading...</td></tr>
            ) : data?.data?.map(p => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono">{p.sku}</td>
                <td className="p-3">{p.name}</td>
                <td className={`p-3 font-semibold ${p.quantity <= p.lowStockThreshold ? 'text-red-500' : 'text-green-600'}`}>
                  {p.quantity} {p.quantity <= p.lowStockThreshold && '⚠️'}
                </td>
                <td className="p-3">${p.price.toFixed(2)}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => { setStockType('in'); setStockProduct(p); }} className="text-green-600 hover:underline text-sm">+ In</button>
                  <button onClick={() => { setStockType('out'); setStockProduct(p); }} className="text-blue-600 hover:underline text-sm">- Out</button>
                  <button onClick={() => setEditingProduct(p)} className="text-yellow-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => remove.mutate(p._id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-gray-600">Page {data.pagination.page} of {data.pagination.pages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary" />
            <button disabled={page >= data.pagination.pages} onClick={() => setPage(p => p + 1)} className="btn-secondary" />
          </div>
        </div>
      )}

      {stockProduct && (
        <StockModal 
          type={stockType} 
          product={stockProduct} 
          onSubmit={handleStockSubmit} 
          onClose={() => setStockProduct(null)}
          isSubmitting={stockIn.isPending || stockOut.isPending}
        />
      )}
    </div>
  );
}