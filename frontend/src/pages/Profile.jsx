import { useAuth } from '../context/AuthContext';
export default function Profile() {
  const { user, logout } = useAuth();
  return (
    <section className="panel form"><h2>Profile</h2>
      <p><b>Name:</b> {user.name}</p><p><b>Email:</b> {user.email}</p>
      {user.createdAt && <p><b>Member since:</b> {new Date(user.createdAt).toLocaleDateString('en-IN')}</p>}
      <button className="btn secondary" onClick={logout}>Logout</button></section>
  );
}
