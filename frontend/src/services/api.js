import axios from 'axios';
const api = axios.create({
  baseURL: 'https://ems-project-n4x1.onrender.com',
  headers: {'Content-Type': 'application/json'}
});
api.interceptors.request.use(c => {
  const t = localStorage.getItem('ems_token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
api.interceptors.response.use(r => r, e => {
  if (e.response?.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
  }
  return Promise.reject(e);
});
export default api;