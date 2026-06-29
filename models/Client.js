const mongoose = require('mongoose');
const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  address: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Client', ClientSchema);
