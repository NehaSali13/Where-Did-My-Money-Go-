import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, CATEGORIES, METHODS, todayStr, errMsg } from '../services/api';
export default function ExpenseForm() {
  const { id } = useParams(), nav = useNavigate();
  const [f, setF] = useState({ amount: '', category: '', description: '', date: todayStr(), paymentMethod: 'UPI' });
  const [err, setErr] = useState(''), [busy, setBusy] = useState(!!id);
  useEffect(() => { if (id) api.get('/expenses/' + id).then(r => setF({ ...r.data, date: r.data.date.slice(0, 10) })).catch(e => setErr(errMsg(e))).finally(() => setBusy(false)); }, [id]);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setErr('');
    if (!(Number(f.amount) > 0)) return setErr('Amount must be greater than 0');
    if (!f.category) return setErr('Please choose a category');
    if (!f.date) return setErr('Please select a date');
    if (f.description.length > 200) return setErr('Description must be 200 characters or less');
    setBusy(true);
    try { await (id ? api.put('/expenses/' + id, f) : api.post('/expenses', f)); nav(id ? '/expenses' : '/'); }
    catch (x) { setErr(errMsg(x)); setBusy(false); }
  };
  return (
    <form className="panel form" onSubmit={submit} noValidate>
      <h2>{id ? 'Edit expense' : 'Add expense'}</h2>
      {err && <p className="error">{err}</p>}
      <label>Amount (₹)<input type="number" min="0.01" step="0.01" value={f.amount} onChange={set('amount')} /></label>
      <label>Category<select value={f.category} onChange={set('category')}><option value="">Select category</option>
        {CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
      <label>Description<input maxLength={200} value={f.description} onChange={set('description')} placeholder="e.g. Monthly groceries" /></label>
      <label>Date<input type="date" value={f.date} onChange={set('date')} /></label>
      <label>Payment method<select value={f.paymentMethod} onChange={set('paymentMethod')}>{METHODS.map(m => <option key={m}>{m}</option>)}</select></label>
      <button className="btn" disabled={busy}>{busy ? 'Saving…' : id ? 'Save changes' : 'Add expense'}</button>
    </form>
  );
}
