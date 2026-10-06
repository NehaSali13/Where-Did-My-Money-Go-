import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, fmt, todayStr, errMsg } from '../services/api';
import CategoryChart from '../components/CategoryChart';
import Insights from '../components/Insights';
export default function Dashboard() {
  const [s, setS] = useState(null), [err, setErr] = useState('');
  useEffect(() => { api.get('/expenses/summary', { params: { today: todayStr() } }).then(r => setS(r.data)).catch(e => setErr(errMsg(e))); }, []);
  if (err) return <p className="error">{err}</p>;
  if (!s) return <p className="loading">Loading your dashboard…</p>;
  const cards = [["Today's Spending", fmt(s.today)], ['This Week', fmt(s.week)], ['This Month', fmt(s.total)],
    ['Expenses This Month', s.count], ['Highest Category', s.top ? `${s.top.category} (${fmt(s.top.total)})` : '—']];
  return (
    <>
      <h2>Dashboard</h2>
      <div className="cards">{cards.map(([l, v]) => <div className="card" key={l}><span>{l}</span><b>{v}</b></div>)}</div>
      <section className="panel"><h3>Where did my money go?</h3><CategoryChart data={s.byCategory} />
        {!s.count && <Link className="btn" to="/add">Add expense</Link>}</section>
      <Insights s={s} />
    </>
  );
}
