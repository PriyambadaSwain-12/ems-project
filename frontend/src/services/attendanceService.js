import api from'./api';
export const markAttendance=d=>api.post('/api/admin/attendance',d);
export const getAttendanceByDate=date=>api.get(`/api/admin/attendance/date/${date}`);
export const getMyAttendance=()=>api.get('/api/employee/attendance');
