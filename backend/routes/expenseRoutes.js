const r = require('express').Router();
const c = require('../controllers/expenseController');
r.use(require('../middleware/auth'));
r.get('/summary', c.summary);              // keep before '/:id'
r.get('/monthly-summary', c.monthlySummary);
r.route('/').get(c.list).post(c.create);
r.route('/:id').get(c.getOne).put(c.update).delete(c.remove);
module.exports = r;
