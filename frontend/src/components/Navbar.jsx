import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
  const { logout } = useAuth();
  return (
    <header className="nav">
      <strong className="brand">Where Did My Money Go?</strong>
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/expenses">Expenses</NavLink>
        <NavLink to="/add">Add Expense</NavLink>
        <NavLink to="/monthly">Monthly Summary</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <button className="link" onClick={logout}>Logout</button>
      </nav>
    </header>
  );
}
