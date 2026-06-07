import React,{createContext,useContext,useState,useEffect}from'react';
import{getMyProfile}from'../services/employeeService';
const C=createContext(null);
export const AuthProvider=({children})=>{
  const[user,setUser]=useState(null);const[loading,setLoading]=useState(true);
  useEffect(()=>{
    const s=localStorage.getItem('ems_user');
    if(s){
      const u=JSON.parse(s);setUser(u);
      // If employee, fetch latest profile photo
      if(u.role==='EMPLOYEE'){
        getMyProfile().then(r=>{
          const updated={...u,profilePhoto:r.data.data?.profilePhoto};
          setUser(updated);localStorage.setItem('ems_user',JSON.stringify(updated));
        }).catch(()=>{});
      }
    }
    setLoading(false);
  },[]);
  const login=d=>{localStorage.setItem('ems_user',JSON.stringify(d));localStorage.setItem('ems_token',d.token);setUser(d);};
  const logout=()=>{localStorage.removeItem('ems_user');localStorage.removeItem('ems_token');setUser(null);};
  const updatePhoto=photo=>{const u={...user,profilePhoto:photo};setUser(u);localStorage.setItem('ems_user',JSON.stringify(u));};
  return<C.Provider value={{user,login,logout,loading,updatePhoto}}>{children}</C.Provider>;
};
export const useAuth=()=>useContext(C);
