import api from'./api';
export const applyLeave=d=>api.post('/api/employee/leaves',d);
export const getMyLeaves=()=>api.get('/api/employee/leaves');
export const getAllLeaves=()=>api.get('/api/admin/leaves');
export const getPendingLeaves=()=>api.get('/api/admin/leaves/pending');
export const actionOnLeave=(id,d)=>api.put(`/api/admin/leaves/${id}/action`,d);
