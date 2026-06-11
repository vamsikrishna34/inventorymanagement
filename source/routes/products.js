const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  stockIn, stockOut
} = require('../controllers/productController');

router.route('/')
  .get(getProducts)
  .post(createProduct);


router.post('/:id/stock-in', stockIn);
router.post('/:id/stock-out', stockOut);

router.route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;