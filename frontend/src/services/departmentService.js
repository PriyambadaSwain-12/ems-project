import api from'./api';
export const getAllDepartments=()=>api.get('/api/departments');
export const createDepartment=d=>api.post('/api/admin/departments',d);
export const updateDepartment=(id,d)=>api.put(`/api/admin/departments/${id}`,d);
export const deleteDepartment=id=>api.delete(`/api/admin/departments/${id}`);
