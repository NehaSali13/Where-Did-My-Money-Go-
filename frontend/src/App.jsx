import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import ExpenseForm from './pages/ExpenseForm';
import Monthly from './pages/Monthly';
import Profile from './pages/Profile';

function Private({ children }) {
  const { user } = useAuth();
  return user ? <><Navbar /><main className="container">{children}</main></> : <Navigate to="/login" replace />;
}
export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Auth mode="login" />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Auth mode="register" />} />
      <Route path="/" element={<Private><Dashboard /></Private>} />
      <Route path="/expenses" element={<Private><Expenses /></Private>} />
      <Route path="/add" element={<Private><ExpenseForm /></Private>} />
      <Route path="/expenses/:id/edit" element={<Private><ExpenseForm /></Private>} />
      <Route path="/monthly" element={<Private><Monthly /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
