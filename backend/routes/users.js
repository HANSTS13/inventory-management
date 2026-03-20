const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') 
    return res.status(403).json({ message: 'Admin access only' });
  next();
};

// Get all employees
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { search, sort } = req.query;
    let query = { role: 'employee' };
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } }
    ];
    const users = await User.find(query).select('-password').sort(sort || '-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add employee
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, username, email, password, phone, department } = req.body;

    // Check username
    let existingUsername = await User.findOne({ username });
    if (existingUsername) 
      return res.status(400).json({ message: 'Username already taken' });

    // Check email
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
      phone, 
      department, 
      role: 'employee' 
    });
    await user.save();
    res.json({ message: 'Employee added successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deactivate employee
router.put('/:id/deactivate', auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Employee deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;