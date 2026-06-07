import React from'react';
import{BrowserRouter,Routes,Route,Navigate}from'react-router-dom';
import{ToastContainer}from'react-toastify';
import'react-toastify/dist/ReactToastify.css';
import{AuthProvider}from'./context/AuthContext';
import ProtectedRoute from'./routes/ProtectedRoute';
import Login from'./pages/Login';
import AdminLayout from'./layouts/AdminLayout';
import EmployeeLayout from'./layouts/EmployeeLayout';
import AdminDashboard from'./pages/admin/Dashboard';
import Employees from'./pages/admin/Employees';
import Departments from'./pages/admin/Departments';
import Attendance from'./pages/admin/Attendance';
import Payroll from'./pages/admin/Payroll';
import LeaveManagement from'./pages/admin/LeaveManagement';
import Reports from'./pages/admin/Reports';
import EmpDashboard from'./pages/employee/Dashboard';
import MyProfile from'./pages/employee/MyProfile';
import MyAttendance from'./pages/employee/MyAttendance';
import MyLeaves from'./pages/employee/MyLeaves';
import MyPayroll from'./pages/employee/MyPayroll';
export default function App(){
  return(
    <AuthProvider><BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Navigate to="/login"/>}/>
        <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminLayout/></ProtectedRoute>}>
          <Route index element={<AdminDashboard/>}/>
          <Route path="employees" element={<Employees/>}/>
          <Route path="departments" element={<Departments/>}/>
          <Route path="attendance" element={<Attendance/>}/>
          <Route path="payroll" element={<Payroll/>}/>
          <Route path="leaves" element={<LeaveManagement/>}/>
          <Route path="reports" element={<Reports/>}/>
        </Route>
        <Route path="/employee" element={<ProtectedRoute role="EMPLOYEE"><EmployeeLayout/></ProtectedRoute>}>
          <Route index element={<EmpDashboard/>}/>
          <Route path="profile" element={<MyProfile/>}/>
          <Route path="attendance" element={<MyAttendance/>}/>
          <Route path="leaves" element={<MyLeaves/>}/>
          <Route path="payroll" element={<MyPayroll/>}/>
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick/>
    </BrowserRouter></AuthProvider>);
}
