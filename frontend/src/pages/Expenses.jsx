import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, CATEGORIES, fmt, showDate, errMsg } from '../services/api';
export default function Expenses() {
  const [list, setList] = useState(null), [err, setErr] = useState('');
  const [q, setQ] = useState(''), [category, setCategory] = useState(''), [date, setDate] = useState('');
  useEffect(() => {
    const t = setTimeout(() => api.get('/expenses', { params: { q, category, date } })
      .then(r => { setList(r.data); setErr(''); }).catch(e => setErr(errMsg(e))), 300);
    return () => clearTimeout(t);
  }, [q, category, date]);
  const del = async x => {
    if (!window.confirm(`Delete this ${fmt(x.amount)} ${x.category} expense?`)) return;
    try { await api.delete('/expenses/' + x._id); setList(list.filter(i => i._id !== x._id)); } catch (e) { setErr(errMsg(e)); }
  };
  return (
    <>
      <h2>Expenses</h2>
      <div className="filters">
        <input placeholder="Search description…" value={q} onChange={e => setQ(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        {(q || category || date) && <button className="btn secondary" onClick={() => { setQ(''); setCategory(''); setDate(''); }}>Clear</button>}
      </div>
      {err && <p className="error">{err}</p>}
      {!list ? <p className="loading">Loading expenses…</p> : !list.length ?
        <p className="empty">No expenses found. <Link to="/add">Add an expense</Link></p> :
        <div className="table-wrap"><table>
          <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Payment</th><th className="r">Amount</th><th>Action</th></tr></thead>
          <tbody>{list.map(x => <tr key={x._id}><td>{showDate(x.date)}</td><td>{x.category}</td><td>{x.description || '—'}</td><td>{x.paymentMethod}</td>
            <td className="r">{fmt(x.amount)}</td>
            <td className="actions"><Link to={`/expenses/${x._id}/edit`}>Edit</Link><button className="link danger" onClick={() => del(x)}>Delete</button></td></tr>)}</tbody>
        </table></div>}
    </>
  );
}
