const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { createProductSchema, updateProductSchema, stockOperationSchema } = require('../validators/productValidator');
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  stockIn, stockOut, getLowStockProducts
} = require('../controllers/productController');

// ⚠️ IMPORTANT: /low-stock MUST be before /:id to avoid route collision
router.get('/low-stock', getLowStockProducts);

router.route('/')
  .get(getProducts)
  .post(validate(createProductSchema), createProduct);

router.post('/:id/stock-in', validate(stockOperationSchema), stockIn);
router.post('/:id/stock-out', validate(stockOperationSchema), stockOut);

router.route('/:id')
  .get(getProduct)
  .put(validate(updateProductSchema), updateProduct)
  .delete(deleteProduct);

module.exports = router;