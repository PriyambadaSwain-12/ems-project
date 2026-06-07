import api from'./api';
export const getAllEmployees=()=>api.get('/api/admin/employees');
export const createEmployee=d=>api.post('/api/admin/employees',d);
export const updateEmployee=(id,d)=>api.put(`/api/admin/employees/${id}`,d);
export const deleteEmployee=id=>api.delete(`/api/admin/employees/${id}`);
export const getMyProfile=()=>api.get('/api/employee/profile');
export const updateMyProfile=d=>api.put('/api/employee/profile',d);
