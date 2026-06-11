const mongoose = require('mongoose');
const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');


exports.getProducts = async (req, res) => {
  try {
    const { category, warehouse, page = 1, limit = 20 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (warehouse) query.warehouse = warehouse;

    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('warehouse', 'name location')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);
    res.json({
      success: true,
      count: products.length,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: products
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('warehouse', 'name location');
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid ID format' });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, error: 'SKU already exists' });
    res.status(400).json({ success: false, error: err.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


exports.stockIn = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const qty = Number(req.body.quantity);
    if (!qty || qty <= 0) throw new Error('Quantity must be a positive number');

    const product = await Product.findById(req.params.id).session(session);
    if (!product) throw new Error('Product not found');

    const prevQty = product.quantity;
    product.quantity += qty;
    await product.save({ session });

    await InventoryLog.create([{
      product: product._id,
      type: 'IN',
      quantity: qty,
      previousQuantity: prevQty,
      newQuantity: product.quantity,
      reason: req.body.reason || 'Stock replenishment'
    }], { session });

    await session.commitTransaction();
    res.json({ success: true, message: `Successfully added ${qty} units`, data: product });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, error: err.message });
  } finally {
    session.endSession();
  }
};


exports.stockOut = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const qty = Number(req.body.quantity);
    if (!qty || qty <= 0) throw new Error('Quantity must be a positive number');

    const product = await Product.findById(req.params.id).session(session);
    if (!product) throw new Error('Product not found');
    if (product.quantity < qty) throw new Error(`Insufficient stock. Available: ${product.quantity}`);

    const prevQty = product.quantity;
    product.quantity -= qty;
    await product.save({ session });

    await InventoryLog.create([{
      product: product._id,
      type: 'OUT',
      quantity: qty,
      previousQuantity: prevQty,
      newQuantity: product.quantity,
      reason: req.body.reason || 'Stock dispatch'
    }], { session });

    await session.commitTransaction();
    res.json({ success: true, message: `Successfully removed ${qty} units`, data: product });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, error: err.message });
  } finally {
    session.endSession();
  }
};