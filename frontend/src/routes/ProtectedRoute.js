import React from'react';import{Navigate}from'react-router-dom';import{useAuth}from'../context/AuthContext';
export default function ProtectedRoute({children,role}){
  const{user,loading}=useAuth();
  if(loading)return<div className="loader">Loading…</div>;
  if(!user)return<Navigate to="/login"/>;
  if(role&&user.role!==role)return<Navigate to={user.role==='ADMIN'?'/admin':'/employee'}/>;
  return children;
}
