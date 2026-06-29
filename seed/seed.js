require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

async function seed(){
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/catering');
  console.log('Connected to DB for seeding');
  await User.deleteMany({});
  await MenuItem.deleteMany({});
  const salt = await bcrypt.genSalt(10);
  const adminPass = await bcrypt.hash('admin123', salt);
  const admin = new User({ name: 'Admin', email: 'admin@example.com', password: adminPass, role: 'admin' });
  await admin.save();
  console.log('Admin created: admin@example.com / admin123');

  const items = [
    { name: 'Paneer Butter Masala', price: 250, category: 'Main', veg: true },
    { name: 'Chicken Biryani', price: 220, category: 'Main', veg: false },
    { name: 'Gulab Jamun', price: 80, category: 'Dessert', veg: true }
  ];
  await MenuItem.insertMany(items);
  console.log('Sample menu items inserted');
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1); });
