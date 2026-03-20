const express = require('express');
const router = express.Router();
const StockOut = require('../models/StockOut');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { sort, startDate, endDate } = req.query;
    let query = {};
    if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    const records = await StockOut.find(query)
      .populate('product', 'name sku')
      .populate('issuedBy', 'name')
      .sort(sort || '-date');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { product, quantity, issuedTo, department, purpose, remarks } = req.body;
    const prod = await Product.findById(product);
    if (!prod || prod.quantity < quantity)
      return res.status(400).json({ message: 'Insufficient stock' });

    const stockOut = new StockOut({ product, quantity, issuedTo, department, purpose, remarks, issuedBy: req.user.id });
    await stockOut.save();
    await Product.findByIdAndUpdate(product, { $inc: { quantity: -quantity } });
    res.json(stockOut);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;