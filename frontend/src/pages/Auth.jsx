import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../services/api';
export default function Auth({ mode }) {
  const reg = mode === 'register', { login, register } = useAuth();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setErr('');
    if (reg && f.name.trim().length < 2) return setErr('Please enter your name');
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr('Enter a valid email address');
    if (reg && (f.password.length < 6 || !/[A-Za-z]/.test(f.password) || !/\d/.test(f.password)))
      return setErr('Password needs 6+ characters with a letter and a number');
    if (!f.password) return setErr('Please enter your password');
    setBusy(true);
    try { await (reg ? register(f) : login(f)); } catch (x) { setErr(errMsg(x)); setBusy(false); }
  };
  return (
    <div className="auth"><form className="panel" onSubmit={submit} noValidate>
      <h1>Where Did My Money Go?</h1>
      <p className="muted">{reg ? 'Create an account to start tracking your spending.' : 'Log in to see where your money went.'}</p>
      {err && <p className="error">{err}</p>}
      {reg && <label>Name<input value={f.name} onChange={set('name')} autoComplete="name" /></label>}
      <label>Email<input type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
      <label>Password<input type="password" value={f.password} onChange={set('password')} autoComplete={reg ? 'new-password' : 'current-password'} /></label>
      <button className="btn" disabled={busy}>{busy ? 'Please wait…' : reg ? 'Create account' : 'Log in'}</button>
      <p className="muted">{reg ? <>Already registered? <Link to="/login">Log in</Link></> : <>New here? <Link to="/register">Create an account</Link></>}</p>
    </form></div>
  );
}
