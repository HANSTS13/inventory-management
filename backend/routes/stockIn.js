const express = require('express');
const router = express.Router();
const StockIn = require('../models/StockIn');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { search, sort, startDate, endDate } = req.query;
    let query = {};
    if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    const records = await StockIn.find(query)
      .populate('product', 'name sku')
      .populate('receivedBy', 'name')
      .sort(sort || '-date');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { product, quantity, supplier, invoiceNumber, remarks } = req.body;
    const stockIn = new StockIn({ product, quantity, supplier, invoiceNumber, remarks, receivedBy: req.user.id });
    await stockIn.save();
    await Product.findByIdAndUpdate(product, { $inc: { quantity: quantity } });
    res.json(stockIn);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;