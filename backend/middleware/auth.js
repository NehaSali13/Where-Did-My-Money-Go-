const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return res.status(401).json({ message: 'Please log in to continue' });
  try { req.user = { id: jwt.verify(h.slice(7), process.env.JWT_SECRET).id }; next(); }
  catch { res.status(401).json({ message: 'Session expired. Please log in again' }); }
};
