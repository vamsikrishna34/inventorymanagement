const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['IN', 'OUT', 'ADJUSTMENT'], required: true },
  quantity: { type: Number, required: true, min: 1 },
  previousQuantity: { type: Number, required: true },
  newQuantity: { type: Number, required: true },
  reason: { type: String, trim: true, default: 'Manual entry' }
}, { timestamps: true });

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);