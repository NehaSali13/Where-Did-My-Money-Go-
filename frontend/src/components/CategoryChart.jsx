import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { fmt } from '../services/api';
const COLORS = ['#1b7f5c', '#e0a21b', '#3b78c2', '#c0504d', '#8a5cb5', '#2aa7a7', '#e07b39', '#7b8794'];
export default function CategoryChart({ data }) {
  if (!data?.length) return <p className="empty">No expenses yet. Add your first expense to see where your money goes.</p>;
  return (
    <div className="chart-wrap">
      <div className="chart"><ResponsiveContainer width="100%" height={240}>
        <PieChart><Pie data={data} dataKey="total" nameKey="category" outerRadius={95}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie>
          <Tooltip formatter={v => fmt(v)} /></PieChart></ResponsiveContainer></div>
      <ul className="cat-list">{data.map((d, i) =>
        <li key={d.category}><span><i style={{ background: COLORS[i % COLORS.length] }} />{d.category}</span><b>{fmt(d.total)}</b></li>)}</ul>
    </div>
  );
}
