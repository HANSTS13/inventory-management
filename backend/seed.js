const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const StockIn = require('./models/StockIn');
const StockOut = require('./models/StockOut');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4
    });
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({ role: 'employee' })
    await Category.deleteMany({});
    await Product.deleteMany({});
    await StockIn.deleteMany({});
    await StockOut.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create Categories
    const categories = await Category.insertMany([
      { name: 'Medicine', description: 'Pharmaceutical products and drugs' },
      { name: 'Electronics', description: 'Electronic devices and accessories' },
      { name: 'Stationery', description: 'Office and school supplies' },
      { name: 'Food & Beverages', description: 'Food items and drinks' },
      { name: 'Cleaning Supplies', description: 'Cleaning and hygiene products' },
    ]);
    console.log('✅ Categories created');

    // Create Products
    const products = await Product.insertMany([
      {
        name: 'Paracetamol 500mg',
        sku: 'MED001',
        category: categories[0]._id,
        description: 'Pain relief tablets',
        quantity: 500,
        unit: 'strips',
        lowStockThreshold: 50,
        manufacturingDate: new Date('2024-01-01'),
        expiryDate: new Date('2026-01-01'),
        supplier: 'MedSupply Co.',
        price: 25
      },
      {
        name: 'Amoxicillin 250mg',
        sku: 'MED002',
        category: categories[0]._id,
        description: 'Antibiotic capsules',
        quantity: 8,
        unit: 'strips',
        lowStockThreshold: 20,
        manufacturingDate: new Date('2024-03-01'),
        expiryDate: new Date('2026-03-01'),
        supplier: 'MedSupply Co.',
        price: 85
      },
      {
        name: 'Vitamin C Tablets',
        sku: 'MED003',
        category: categories[0]._id,
        description: 'Immunity booster',
        quantity: 200,
        unit: 'tablets',
        lowStockThreshold: 30,
        manufacturingDate: new Date('2024-06-01'),
        expiryDate: new Date('2026-04-10'),
        supplier: 'HealthPlus',
        price: 120
      },
      {
        name: 'USB Cable Type-C',
        sku: 'ELE001',
        category: categories[1]._id,
        description: 'Fast charging USB-C cable',
        quantity: 45,
        unit: 'pcs',
        lowStockThreshold: 10,
        supplier: 'TechMart',
        price: 299
      },
      {
        name: 'Wireless Mouse',
        sku: 'ELE002',
        category: categories[1]._id,
        description: 'Bluetooth wireless mouse',
        quantity: 5,
        unit: 'pcs',
        lowStockThreshold: 8,
        supplier: 'TechMart',
        price: 899
      },
      {
        name: 'HDMI Cable',
        sku: 'ELE003',
        category: categories[1]._id,
        description: '4K HDMI cable 2 meters',
        quantity: 30,
        unit: 'pcs',
        lowStockThreshold: 5,
        supplier: 'TechMart',
        price: 450
      },
      {
        name: 'A4 Paper Ream',
        sku: 'STA001',
        category: categories[2]._id,
        description: '500 sheets per ream',
        quantity: 3,
        unit: 'reams',
        lowStockThreshold: 10,
        supplier: 'OfficeWorld',
        price: 350
      },
      {
        name: 'Ball Point Pens Box',
        sku: 'STA002',
        category: categories[2]._id,
        description: 'Blue ink pens box of 50',
        quantity: 25,
        unit: 'boxes',
        lowStockThreshold: 5,
        supplier: 'OfficeWorld',
        price: 180
      },
      {
        name: 'Stapler',
        sku: 'STA003',
        category: categories[2]._id,
        description: 'Heavy duty stapler',
        quantity: 12,
        unit: 'pcs',
        lowStockThreshold: 3,
        supplier: 'OfficeWorld',
        price: 250
      },
      {
        name: 'Biscuits Pack',
        sku: 'FOO001',
        category: categories[3]._id,
        description: 'Cream biscuits 200g',
        quantity: 100,
        unit: 'packs',
        lowStockThreshold: 20,
        manufacturingDate: new Date('2026-01-01'),
        expiryDate: new Date('2026-04-15'),
        supplier: 'FoodMart',
        price: 40
      },
      {
        name: 'Mineral Water Bottles',
        sku: 'FOO002',
        category: categories[3]._id,
        description: '1 litre water bottles',
        quantity: 200,
        unit: 'bottles',
        lowStockThreshold: 50,
        manufacturingDate: new Date('2026-02-01'),
        expiryDate: new Date('2026-08-01'),
        supplier: 'AquaPure',
        price: 20
      },
      {
        name: 'Instant Coffee',
        sku: 'FOO003',
        category: categories[3]._id,
        description: 'Nescafe instant coffee 200g',
        quantity: 15,
        unit: 'jars',
        lowStockThreshold: 5,
        manufacturingDate: new Date('2025-12-01'),
        expiryDate: new Date('2026-12-01'),
        supplier: 'FoodMart',
        price: 320
      },
      {
        name: 'Floor Cleaner',
        sku: 'CLN001',
        category: categories[4]._id,
        description: 'Phenyl floor cleaner 1L',
        quantity: 40,
        unit: 'bottles',
        lowStockThreshold: 10,
        supplier: 'CleanCo',
        price: 95
      },
      {
        name: 'Hand Sanitizer',
        sku: 'CLN002',
        category: categories[4]._id,
        description: '500ml hand sanitizer',
        quantity: 7,
        unit: 'bottles',
        lowStockThreshold: 10,
        supplier: 'CleanCo',
        price: 150
      },
      {
        name: 'Tissue Box',
        sku: 'CLN003',
        category: categories[4]._id,
        description: '100 tissues per box',
        quantity: 60,
        unit: 'boxes',
        lowStockThreshold: 15,
        supplier: 'CleanCo',
        price: 85
      }
    ]);
    console.log('✅ Products created');

    // Get or Create Admin User
let admin = await User.findOne({ role: 'admin' });

// If admin doesn't exist, create one
if (!admin) {
  const salt = await bcrypt.genSalt(10);
  const hashedAdminPassword = await bcrypt.hash('admin123', salt);
  admin = await User.create({
    name: 'Admin',
    username: 'admin',
    email: 'admin@inventory.com',
    password: hashedAdminPassword,
    role: 'admin',
    isActive: true
  });
  console.log('✅ Admin created');
}

    // Create some Employees
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('emp123', salt);

    const employees = await User.insertMany([
      {
        name: 'Employee 1',
        username: 'emp1',
        email: 'emp1@inventory.com',
        password: hashedPassword,
        role: 'employee',
        phone: '9876543210',
        department: 'Warehouse'
      },
      {
        name: 'Employee 2',
        username: 'emp2',
        email: 'emp2@inventory.com',
        password: hashedPassword,
        role: 'employee',
        phone: '9876543211',
        department: 'Logistics'
      },
      {
        name: 'Employee 3',
        username: 'emp3',
        email: 'emp3@inventory.com',
        password: hashedPassword,
        role: 'employee',
        phone: '9876543212',
        department: 'Store'
      }
    ]);
    console.log('✅ Employees created');

    // Create Stock In Records
    await StockIn.insertMany([
      {
        product: products[0]._id,
        quantity: 200,
        supplier: 'MedSupply Co.',
        invoiceNumber: 'INV001',
        receivedBy: admin._id,
        remarks: 'Monthly stock replenishment',
        date: new Date('2026-01-15')
      },
      {
        product: products[3]._id,
        quantity: 20,
        supplier: 'TechMart',
        invoiceNumber: 'INV002',
        receivedBy: admin._id,
        remarks: 'New stock arrival',
        date: new Date('2026-02-01')
      },
      {
        product: products[6]._id,
        quantity: 15,
        supplier: 'OfficeWorld',
        invoiceNumber: 'INV003',
        receivedBy: employees[0]._id,
        remarks: 'Office supplies restock',
        date: new Date('2026-02-10')
      },
      {
        product: products[9]._id,
        quantity: 50,
        supplier: 'FoodMart',
        invoiceNumber: 'INV004',
        receivedBy: employees[1]._id,
        remarks: 'Cafeteria supplies',
        date: new Date('2026-03-01')
      },
      {
        product: products[12]._id,
        quantity: 20,
        supplier: 'CleanCo',
        invoiceNumber: 'INV005',
        receivedBy: employees[2]._id,
        remarks: 'Cleaning supplies restock',
        date: new Date('2026-03-05')
      }
    ]);
    console.log('✅ Stock In records created');

    // Create Stock Out Records
    await StockOut.insertMany([
      {
        product: products[0]._id,
        quantity: 10,
        issuedTo: 'Dr. Mehta',
        issuedBy: admin._id,
        department: 'Medical Room',
        purpose: 'Patient treatment',
        remarks: 'Emergency request',
        date: new Date('2026-01-20')
      },
      {
        product: products[3]._id,
        quantity: 5,
        issuedTo: 'IT Department',
        issuedBy: employees[0]._id,
        department: 'IT',
        purpose: 'Device charging',
        remarks: 'New employee setup',
        date: new Date('2026-02-05')
      },
      {
        product: products[6]._id,
        quantity: 3,
        issuedTo: 'Accounts Team',
        issuedBy: employees[1]._id,
        department: 'Accounts',
        purpose: 'Office use',
        remarks: 'Monthly requirement',
        date: new Date('2026-02-15')
      },
      {
        product: products[9]._id,
        quantity: 20,
        issuedTo: 'Cafeteria Staff',
        issuedBy: employees[2]._id,
        department: 'Cafeteria',
        purpose: 'Daily use',
        remarks: 'Weekly supply',
        date: new Date('2026-03-10')
      },
      {
        product: products[13]._id,
        quantity: 3,
        issuedTo: 'Cleaning Staff',
        issuedBy: admin._id,
        department: 'Housekeeping',
        purpose: 'Daily cleaning',
        remarks: 'Regular supply',
        date: new Date('2026-03-12')
      }
    ]);
    console.log('✅ Stock Out records created');

    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('👑 Admin Login:');
    console.log('   Email    : admin@inventory.com');
    console.log('   Password : admin123');
    console.log('');
    console.log('👤 Employee Logins:');
    console.log('   Email    : rahul@inventory.com');
    console.log('   Email    : priya@inventory.com');
    console.log('   Email    : arun@inventory.com');
    console.log('   Password : emp123 (all employees)');
    console.log('');

    mongoose.connection.close();

  } catch (err) {
    console.error('❌ Seed error:', err);
    mongoose.connection.close();
  }
};

seedDatabase();