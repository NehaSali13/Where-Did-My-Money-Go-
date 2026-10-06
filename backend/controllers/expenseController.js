const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const { CATEGORIES, METHODS } = Expense;
const DAY = 864e5;

const check = b => {
  const e = [];
  if (!(Number(b.amount) > 0)) e.push('Amount must be greater than 0');
  if (!CATEGORIES.includes(b.category)) e.push('Please choose a category');
  if (!b.date || isNaN(new Date(b.date))) e.push('Please enter a valid date');
  if ((b.description || '').length > 200) e.push('Description must be 200 characters or less');
  if (b.paymentMethod && !METHODS.includes(b.paymentMethod)) e.push('Invalid payment method');
  return e.join('. ');
};
const pick = b => ({ amount: Number(b.amount), category: b.category, description: b.description || '',
  date: new Date(b.date), paymentMethod: b.paymentMethod || 'Cash' });
const oid = id => new mongoose.Types.ObjectId(id);

const sumBetween = async (uid, from, to) => {
  const r = await Expense.aggregate([{ $match: { userId: oid(uid), date: { $gte: from, $lt: to } } },
    { $group: { _id: null, t: { $sum: '$amount' } } }]);
  return r[0]?.t || 0;
};
const monthStats = async (uid, y, m) => {
  const r = await Expense.aggregate([
    { $match: { userId: oid(uid), date: { $gte: new Date(Date.UTC(y, m, 1)), $lt: new Date(Date.UTC(y, m + 1, 1)) } } },
    { $group: { _id: '$category', total: { $sum: '$amount' }, n: { $sum: 1 } } }, { $sort: { total: -1 } }]);
  const byCategory = r.map(x => ({ category: x._id, total: x.total }));
  return { total: r.reduce((a, x) => a + x.total, 0), count: r.reduce((a, x) => a + x.n, 0), byCategory, top: byCategory[0] || null };
};
const withPrev = async (uid, y, m) => {
  const cur = await monthStats(uid, y, m), prev = await monthStats(uid, y, m - 1);
  return { ...cur, prevTotal: prev.count ? prev.total : null };
};

exports.create = async (req, res, next) => {
  try {
    const err = check(req.body); if (err) return res.status(400).json({ message: err });
    res.status(201).json(await Expense.create({ ...pick(req.body), userId: req.user.id }));
  } catch (e) { next(e); }
};
exports.list = async (req, res, next) => {
  try {
    const { q, category, date } = req.query, f = { userId: req.user.id };
    if (q) f.description = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    if (category) f.category = category;
    if (date && !isNaN(new Date(date))) { const d = new Date(date); f.date = { $gte: d, $lt: new Date(+d + DAY) }; }
    res.json(await Expense.find(f).sort({ date: -1, createdAt: -1 }));
  } catch (e) { next(e); }
};
exports.getOne = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Expense not found' });
    const x = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    x ? res.json(x) : res.status(404).json({ message: 'Expense not found' });
  } catch (e) { next(e); }
};
exports.update = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Expense not found' });
    const err = check(req.body); if (err) return res.status(400).json({ message: err });
    const x = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, pick(req.body), { new: true, runValidators: true });
    x ? res.json(x) : res.status(404).json({ message: 'Expense not found' });
  } catch (e) { next(e); }
};
exports.remove = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Expense not found' });
    const x = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    x ? res.json({ message: 'Expense deleted' }) : res.status(404).json({ message: 'Expense not found' });
  } catch (e) { next(e); }
};
// client sends its local date (?today=YYYY-MM-DD) so "today" matches the user's timezone
exports.summary = async (req, res, next) => {
  try {
    const s = /^\d{4}-\d{2}-\d{2}$/.test(req.query.today || '') ? req.query.today : new Date().toISOString().slice(0, 10);
    const t = new Date(s), end = new Date(+t + DAY), weekStart = new Date(+t - ((t.getUTCDay() + 6) % 7) * DAY);
    const uid = req.user.id;
    const [today, week, month] = await Promise.all([sumBetween(uid, t, end), sumBetween(uid, weekStart, end),
      withPrev(uid, t.getUTCFullYear(), t.getUTCMonth())]);
    res.json({ today, week, ...month });
  } catch (e) { next(e); }
};
exports.monthlySummary = async (req, res, next) => {
  try {
    const m = parseInt(req.query.month), y = parseInt(req.query.year);
    if (!(m >= 1 && m <= 12) || !(y >= 2000 && y <= 2100)) return res.status(400).json({ message: 'Choose a valid month and year' });
    res.json({ month: m, year: y, ...(await withPrev(req.user.id, y, m - 1)) });
  } catch (e) { next(e); }
};
