import api from'./api';
export const generatePayroll=d=>api.post('/api/admin/payroll/generate',d);
export const getPayrollByMonth=(m,y)=>api.get(`/api/admin/payroll?month=${m}&year=${y}`);
export const getPayrollByEmployee=id=>api.get(`/api/admin/payroll/employee/${id}`);
export const getMyPayroll=(m,y)=>api.get(`/api/employee/payroll?month=${m}&year=${y}`);
export const downloadSalarySlip=id=>api.get(`/api/payroll/${id}/slip`,{responseType:'blob'});
export const getDashboardStats=()=>api.get('/api/admin/dashboard/stats');
