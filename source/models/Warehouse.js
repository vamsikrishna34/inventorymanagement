const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  location: String,
  capacity: { type: Number, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);