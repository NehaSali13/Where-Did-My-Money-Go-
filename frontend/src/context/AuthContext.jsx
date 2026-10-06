import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const authenticate = async (path, body) => {
    const { data } = await api.post('/auth/' + path, body);
    localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); setUser(data.user);
  };
  const logout = () => { localStorage.clear(); setUser(null); };
  return <Ctx.Provider value={{ user, login: b => authenticate('login', b), register: b => authenticate('register', b), logout }}>{children}</Ctx.Provider>;
}
