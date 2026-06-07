import api from'./api';
export const loginApi=d=>api.post('/api/auth/login',d);
