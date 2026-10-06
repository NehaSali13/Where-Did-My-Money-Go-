import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use(c => { const t = localStorage.getItem('token'); if (t) c.headers.Authorization = 'Bearer ' + t; return c; });
api.interceptors.response.use(r => r, e => {
  if (e.response?.status === 401) { localStorage.clear(); if (location.pathname !== '/login') location.href = '/login'; }
  return Promise.reject(e);
});
export const CATEGORIES = ['Food', 'Groceries', 'Travel', 'Bills', 'Shopping', 'Medical', 'Education', 'Other'];
export const METHODS = ['Cash', 'UPI', 'Card', 'Bank Transfer'];
export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const fmt = n => '₹' + Number(n || 0).toLocaleString('en-IN');
export const todayStr = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
export const showDate = s => { const [y, m, d] = s.slice(0, 10).split('-'); return `${d}/${m}/${y}`; };
export const errMsg = e => e.response?.data?.message || 'Something went wrong. Please check your connection and try again.';
