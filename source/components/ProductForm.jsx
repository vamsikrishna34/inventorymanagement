import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../lib/schema';

export default function ProductForm({ initialData, onSubmit, isSubmitting, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || { lowStockThreshold: 5, quantity: 0 }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input {...register('name')} placeholder="Product Name" className="input" />
        {errors.name && <p className="text-red-500 text-sm col-span-2">{errors.name.message}</p>}
        
        <input {...register('sku')} placeholder="SKU" className="input" />
        {errors.sku && <p className="text-red-500 text-sm col-span-2">{errors.sku.message}</p>}
        
        <input {...register('price')} type="number" step="0.01" placeholder="Price" className="input" />
        {errors.price && <p className="text-red-500 text-sm col-span-2">{errors.price.message}</p>}
        
        <input {...register('quantity')} type="number" placeholder="Initial Qty" className="input" />
        <input {...register('lowStockThreshold')} type="number" placeholder="Low Stock Threshold" className="input" />
        <input {...register('category')} placeholder="Category ID (optional)" className="input" />
        <input {...register('warehouse')} placeholder="Warehouse ID (optional)" className="input" />
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}