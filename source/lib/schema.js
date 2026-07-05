import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  sku: z.string().min(1, 'SKU is required').max(50),
  price: z.coerce.number().positive('Price must be positive'),
  quantity: z.coerce.number().int().nonnegative().optional(),
  lowStockThreshold: z.coerce.number().int().nonnegative().default(5),
  category: z.string().optional(),
  warehouse: z.string().optional()
});

export const stockSchema = z.object({
  quantity: z.coerce.number().int().positive('Quantity must be > 0'),
  reason: z.string().min(1, 'Reason is required').max(200)
});