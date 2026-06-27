const { z } = require('zod');

exports.createProductSchema = z.object({
  name: z.string().min(1).max(100),
  sku: z.string().min(1).max(50),
  price: z.number().positive(),
  quantity: z.number().int().nonnegative().optional().default(0),
  lowStockThreshold: z.number().int().nonnegative().optional().default(5),
  category: z.string().optional(),
  warehouse: z.string().optional()
});

exports.updateProductSchema = exports.createProductSchema.partial();

exports.stockOperationSchema = z.object({
  quantity: z.number().int().positive(),
  reason: z.string().min(1).max(200).optional()
});