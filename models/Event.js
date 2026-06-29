const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
  title: String,
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  date: Date,
  guests: Number,
  menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  services: [String],
  status: { type: String, enum: ['Pending','Confirmed','Preparing','Completed'], default: 'Pending' },
  total: Number,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Event', EventSchema);
