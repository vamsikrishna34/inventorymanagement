import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockSchema } from '../lib/schema';

export default function StockModal({ type, product, onSubmit, onClose, isSubmitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(stockSchema),
    defaultValues: { reason: type === 'in' ? 'Restock' : 'Dispatch' }
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h3 className="text-xl font-bold mb-4">{type === 'in' ? '📥 Stock In' : '📤 Stock Out'}</h3>
        <p className="mb-2 text-gray-600">Product: <span className="font-semibold">{product.name}</span></p>
        <p className="mb-4 text-gray-600">Current Stock: <span className="font-semibold">{product.quantity}</span></p>
        
        <form onSubmit={handleSubmit((data) => onSubmit({ id: product._id, ...data }))} className="space-y-3">
          <input {...register('quantity')} type="number" placeholder="Quantity" className="input" />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
          
          <input {...register('reason')} placeholder="Reason" className="input" />
          {errors.reason && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
          
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}