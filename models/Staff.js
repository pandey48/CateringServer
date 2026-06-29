const mongoose = require('mongoose');
const StaffSchema = new mongoose.Schema({
  name: String,
  role: String,
  phone: String,
  active: { type: Boolean, default: true }
});
module.exports = mongoose.model('Staff', StaffSchema);
