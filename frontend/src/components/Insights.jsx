import { fmt } from '../services/api';
export default function Insights({ s, when = 'this month' }) {
  if (!s.count) return null;
  const msgs = [`You spent ${fmt(s.top.total)} on ${s.top.category} ${when}.`, `${s.top.category} is your highest spending category.`];
  if (s.prevTotal !== null && s.prevTotal !== undefined) {
    const d = s.total - s.prevTotal;
    msgs.push(d === 0 ? 'You spent the same as the previous month.'
      : `You spent ${fmt(Math.abs(d))} ${d > 0 ? 'more' : 'less'} ${when} compared with the previous month.`);
  }
  return <section className="panel"><h3>Spending insights</h3><ul className="insights">{msgs.map(m => <li key={m}>{m}</li>)}</ul></section>;
}
