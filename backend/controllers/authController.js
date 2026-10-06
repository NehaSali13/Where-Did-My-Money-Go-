const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const out = u => ({ token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
  user: { id: u._id, name: u.name, email: u.email, createdAt: u.createdAt } });

exports.register = async (req, res, next) => {
  try {
    const name = (req.body.name || '').trim(), email = (req.body.email || '').trim().toLowerCase(), pw = req.body.password || '';
    if (name.length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address' });
    if (pw.length < 6 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw))
      return res.status(400).json({ message: 'Password needs 6+ characters with a letter and a number' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'An account with this email already exists' });
    const user = await User.create({ name, email, password: await bcrypt.hash(pw, 10) });
    res.status(201).json(out(user));
  } catch (e) { next(e); }
};
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: (req.body.email || '').trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password)))
      return res.status(400).json({ message: 'Incorrect email or password' });
    res.json(out(user));
  } catch (e) { next(e); }
};
