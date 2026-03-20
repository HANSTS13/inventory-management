const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    // Check if username already exists
    let existingUsername = await User.findOne({ username });
    if (existingUsername) 
      return res.status(400).json({ message: 'Username already taken' });

    // Check if email already exists
    let existingEmail = await User.findOne({ email });
    if (existingEmail) 
      return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
      name, 
      username, 
      email, 
      password: hashedPassword, 
      role: role || 'employee' 
    });
    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login with username
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username, isActive: true });
    if (!user) 
      return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
      return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        username: user.username,
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// TEMPORARY ROUTE - DELETE AFTER USE
router.get('/setup', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('admin123', salt);
    
    await User.deleteMany({ role: 'admin' });
    
    const admin = await User.create({
      name: 'Admin',
      username: 'admin',
      email: 'admin@inventory.com',
      password,
      role: 'admin',
      isActive: true
    });
    
    res.json({ message: 'Admin created!', admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/seeddata', async (req, res) => {
  try {
    const Category = require('../models/Category');
    const Product = require('../models/Product');
    const StockIn = require('../models/StockIn');
    const StockOut = require('../models/StockOut');
    const bcrypt = require('bcryptjs');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await StockIn.deleteMany({});
    await StockOut.deleteMany({});
    await User.deleteMany({ role: 'employee' });
    const categories = await Category.insertMany([
      { name: 'Medicine', description: 'Pharmaceutical products' },
      { name: 'Electronics', description: 'Electronic devices' },
      { name: 'Stationery', description: 'Office supplies' },
      { name: 'Food & Beverages', description: 'Food items' },
      { name: 'Cleaning Supplies', description: 'Cleaning products' }
    ]);
    const products = await Product.insertMany([
      { name: 'Paracetamol 500mg', sku: 'MED001', category: categories[0]._id, description: 'Pain relief tablets', quantity: 500, unit: 'strips', lowStockThreshold: 50, manufacturingDate: new Date('2024-01-01'), expiryDate: new Date('2026-06-01'), supplier: 'MedSupply Co.', price: 25 },
      { name: 'Amoxicillin 250mg', sku: 'MED002', category: categories[0]._id, description: 'Antibiotic capsules', quantity: 8, unit: 'strips', lowStockThreshold: 20, manufacturingDate: new Date('2024-03-01'), expiryDate: new Date('2026-03-01'), supplier: 'MedSupply Co.', price: 85 },
      { name: 'Vitamin C Tablets', sku: 'MED003', category: categories[0]._id, description: 'Immunity booster', quantity: 200, unit: 'tablets', lowStockThreshold: 30, manufacturingDate: new Date('2024-06-01'), expiryDate: new Date('2026-04-10'), supplier: 'HealthPlus', price: 120 },
      { name: 'USB Cable Type-C', sku: 'ELE001', category: categories[1]._id, description: 'Fast charging USB-C cable', quantity: 45, unit: 'pcs', lowStockThreshold: 10, supplier: 'TechMart', price: 299 },
      { name: 'Wireless Mouse', sku: 'ELE002', category: categories[1]._id, description: 'Bluetooth wireless mouse', quantity: 5, unit: 'pcs', lowStockThreshold: 8, supplier: 'TechMart', price: 899 },
      { name: 'HDMI Cable', sku: 'ELE003', category: categories[1]._id, description: '4K HDMI cable 2 meters', quantity: 30, unit: 'pcs', lowStockThreshold: 5, supplier: 'TechMart', price: 450 },
      { name: 'A4 Paper Ream', sku: 'STA001', category: categories[2]._id, description: '500 sheets per ream', quantity: 3, unit: 'reams', lowStockThreshold: 10, supplier: 'OfficeWorld', price: 350 },
      { name: 'Ball Point Pens Box', sku: 'STA002', category: categories[2]._id, description: 'Blue ink pens box of 50', quantity: 25, unit: 'boxes', lowStockThreshold: 5, supplier: 'OfficeWorld', price: 180 },
      { name: 'Biscuits Pack', sku: 'FOO001', category: categories[3]._id, description: 'Cream biscuits 200g', quantity: 100, unit: 'packs', lowStockThreshold: 20, manufacturingDate: new Date('2026-01-01'), expiryDate: new Date('2026-04-15'), supplier: 'FoodMart', price: 40 },
      { name: 'Mineral Water Bottles', sku: 'FOO002', category: categories[3]._id, description: '1 litre water bottles', quantity: 200, unit: 'bottles', lowStockThreshold: 50, manufacturingDate: new Date('2026-02-01'), expiryDate: new Date('2026-08-01'), supplier: 'AquaPure', price: 20 },
      { name: 'Floor Cleaner', sku: 'CLN001', category: categories[4]._id, description: 'Phenyl floor cleaner 1L', quantity: 40, unit: 'bottles', lowStockThreshold: 10, supplier: 'CleanCo', price: 95 },
      { name: 'Hand Sanitizer', sku: 'CLN002', category: categories[4]._id, description: '500ml hand sanitizer', quantity: 7, unit: 'bottles', lowStockThreshold: 10, supplier: 'CleanCo', price: 150 },
      { name: 'Tissue Box', sku: 'CLN003', category: categories[4]._id, description: '100 tissues per box', quantity: 60, unit: 'boxes', lowStockThreshold: 15, supplier: 'CleanCo', price: 85 }
    ]);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('emp123', salt);
    const employees = await User.insertMany([
      { name: 'Emp1', username: 'emp1', email: 'emp1@inventory.com', password: hashedPassword, role: 'employee', phone: '9876543210', department: 'Warehouse' },
      { name: 'Emp2', username: 'emp2', email: 'emp2@inventory.com', password: hashedPassword, role: 'employee', phone: '9876543211', department: 'Logistics' },
      { name: 'Emp3', username: 'emp3', email: 'emp3@inventory.com', password: hashedPassword, role: 'employee', phone: '9876543212', department: 'Store' }
    ]);
    const admin = await User.findOne({ role: 'admin' });
    await StockIn.insertMany([
      { product: products[0]._id, quantity: 200, supplier: 'MedSupply Co.', invoiceNumber: 'INV001', receivedBy: admin._id, remarks: 'Monthly stock', date: new Date('2026-01-15') },
      { product: products[3]._id, quantity: 20, supplier: 'TechMart', invoiceNumber: 'INV002', receivedBy: admin._id, remarks: 'New stock', date: new Date('2026-02-01') },
      { product: products[6]._id, quantity: 15, supplier: 'OfficeWorld', invoiceNumber: 'INV003', receivedBy: employees[0]._id, remarks: 'Office restock', date: new Date('2026-02-10') },
      { product: products[8]._id, quantity: 50, supplier: 'FoodMart', invoiceNumber: 'INV004', receivedBy: employees[1]._id, remarks: 'Cafeteria supplies', date: new Date('2026-03-01') },
      { product: products[10]._id, quantity: 20, supplier: 'CleanCo', invoiceNumber: 'INV005', receivedBy: employees[2]._id, remarks: 'Cleaning restock', date: new Date('2026-03-05') }
    ]);
    await StockOut.insertMany([
      { product: products[0]._id, quantity: 10, issuedTo: 'Dr. Mehta', issuedBy: admin._id, department: 'Medical Room', purpose: 'Patient treatment', date: new Date('2026-01-20') },
      { product: products[3]._id, quantity: 5, issuedTo: 'IT Department', issuedBy: employees[0]._id, department: 'IT', purpose: 'Device charging', date: new Date('2026-02-05') },
      { product: products[6]._id, quantity: 3, issuedTo: 'Accounts Team', issuedBy: employees[1]._id, department: 'Accounts', purpose: 'Office use', date: new Date('2026-02-15') },
      { product: products[8]._id, quantity: 20, issuedTo: 'Cafeteria Staff', issuedBy: employees[2]._id, department: 'Cafeteria', purpose: 'Daily use', date: new Date('2026-03-10') },
      { product: products[11]._id, quantity: 3, issuedTo: 'Cleaning Staff', issuedBy: admin._id, department: 'Housekeeping', purpose: 'Daily cleaning', date: new Date('2026-03-12') }
    ]);
    res.json({ message: '🎉 Database seeded!', categories: categories.length, products: products.length, employees: employees.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;