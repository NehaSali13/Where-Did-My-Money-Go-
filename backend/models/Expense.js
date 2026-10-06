const mongoose = require('mongoose');
const CATEGORIES = ['Food', 'Groceries', 'Travel', 'Bills', 'Shopping', 'Medical', 'Education', 'Other'];
const METHODS = ['Cash', 'UPI', 'Card', 'Bank Transfer'];
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true, min: 0.01 },
  category: { type: String, required: true, enum: CATEGORIES },
  description: { type: String, trim: true, maxlength: 200, default: '' },
  date: { type: Date, required: true },
  paymentMethod: { type: String, enum: METHODS, default: 'Cash' },
}, { timestamps: true });
module.exports = mongoose.model('Expense', schema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.METHODS = METHODS;
