const mongoose = require('mongoose');
const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getProducts = asyncHandler(async (req, res) => {
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
  res.status(200).json({
    success: true,
    count: products.length,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    data: products
  });
});

exports.getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
  }).populate('category', 'name').populate('warehouse', 'name location');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
    message: 'Products at or below threshold'
  });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name')
    .populate('warehouse', 'name location');
  if (!product) throw new AppError('Product not found', 404);
  res.status(200).json({ success: true, data: product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) throw new AppError('Product not found', 404);
  res.status(200).json({ success: true, data: product });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new AppError('Product not found', 404);
  res.status(200).json({ success: true, data: null });
});

exports.stockIn = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const qty = req.body.quantity;
    const product = await Product.findById(req.params.id).session(session);
    if (!product) throw new AppError('Product not found', 404);

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
    res.status(200).json({ success: true, message: `Added ${qty} units`, data: product });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

exports.stockOut = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const qty = req.body.quantity;
    const product = await Product.findById(req.params.id).session(session);
    if (!product) throw new AppError('Product not found', 404);
    if (product.quantity < qty) throw new AppError(`Insufficient stock. Available: ${product.quantity}`, 400);

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

    const warning = product.quantity <= product.lowStockThreshold
      ? `⚠️ Warning: Stock is at or below threshold (${product.lowStockThreshold})`
      : null;

    res.status(200).json({
      success: true,
      message: `Removed ${qty} units`,
      warning,
      data: product
    });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});