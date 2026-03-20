const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: 'pcs' },
  lowStockThreshold: { type: Number, default: 10 },
  manufacturingDate: { type: Date },
  expiryDate: { type: Date },
  supplier: { type: String },
  price: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);