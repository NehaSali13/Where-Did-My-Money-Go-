import { useEffect, useState } from 'react';
import { api, MONTHS, fmt, errMsg } from '../services/api';
import CategoryChart from '../components/CategoryChart';
import Insights from '../components/Insights';
export default function Monthly() {
  const now = new Date(), [month, setMonth] = useState(now.getMonth() + 1), [year, setYear] = useState(now.getFullYear());
  const [s, setS] = useState(null), [err, setErr] = useState('');
  useEffect(() => { setS(null); setErr(''); api.get('/expenses/monthly-summary', { params: { month, year } }).then(r => setS(r.data)).catch(e => setErr(errMsg(e))); }, [month, year]);
  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);
  return (
    <>
      <h2>Monthly Summary</h2>
      <div className="filters">
        <select value={month} onChange={e => setMonth(+e.target.value)}>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select>
        <select value={year} onChange={e => setYear(+e.target.value)}>{years.map(y => <option key={y}>{y}</option>)}</select>
      </div>
      {err && <p className="error">{err}</p>}
      {!s && !err && <p className="loading">Loading summary…</p>}
      {s && (!s.count ? <p className="empty">No expenses recorded for {MONTHS[month - 1]} {year}.</p> : <>
        <section className="panel"><h3>{MONTHS[month - 1]} {year}</h3>
          <p className="highlight">You spent the most on {s.top.category} this month — {fmt(s.top.total)}.</p>
          <CategoryChart data={s.byCategory} />
          <p className="total">Total: {fmt(s.total)}</p></section>
        <Insights s={s} when="this month" />
      </>)}
    </>
  );
}
