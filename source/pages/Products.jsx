import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Products() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then(res => res.data)
  });

  if (isLoading) return <p className="text-center text-gray-500">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load products</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Inventory</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">SKU</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Price</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map(p => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono">{p.sku}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category?.name || 'N/A'}</td>
                <td className={`p-3 font-semibold ${p.quantity <= p.lowStockThreshold ? 'text-red-500' : 'text-green-600'}`}>
                  {p.quantity}
                </td>
                <td className="p-3">${p.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}