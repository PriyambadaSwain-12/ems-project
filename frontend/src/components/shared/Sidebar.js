import React from'react';import{NavLink,useNavigate}from'react-router-dom';import{useAuth}from'../../context/AuthContext';
import{FiGrid,FiUsers,FiBriefcase,FiClock,FiDollarSign,FiCalendar,FiBarChart2,FiLogOut,FiUser}from'react-icons/fi';
const aLinks=[{to:'/admin',i:<FiGrid/>,l:'Dashboard'},{to:'/admin/employees',i:<FiUsers/>,l:'Employees'},{to:'/admin/departments',i:<FiBriefcase/>,l:'Departments'},{to:'/admin/attendance',i:<FiClock/>,l:'Attendance'},{to:'/admin/payroll',i:<FiDollarSign/>,l:'Payroll'},{to:'/admin/leaves',i:<FiCalendar/>,l:'Leaves'},{to:'/admin/reports',i:<FiBarChart2/>,l:'Reports'}];
const eLinks=[{to:'/employee',i:<FiGrid/>,l:'Dashboard'},{to:'/employee/profile',i:<FiUser/>,l:'My Profile'},{to:'/employee/attendance',i:<FiClock/>,l:'My Attendance'},{to:'/employee/leaves',i:<FiCalendar/>,l:'My Leaves'},{to:'/employee/payroll',i:<FiDollarSign/>,l:'My Payroll'}];
const css=`aside.sb{width:var(--sw);background:#0f172a;height:100vh;position:fixed;left:0;top:0;display:flex;flex-direction:column;overflow-y:auto;z-index:100;}
.sb-brand{display:flex;align-items:center;gap:12px;padding:18px;border-bottom:1px solid rgba(255,255,255,.07);}
.sb-logo{background:#6366f1;color:#fff;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;flex-shrink:0;}
.sb-bname{color:#f1f5f9;font-weight:700;font-size:15px;}.sb-role{color:#475569;font-size:10px;text-transform:uppercase;letter-spacing:1px;}
.sb-user{margin:10px 12px 6px;background:rgba(255,255,255,.05);border-radius:10px;padding:12px;display:flex;align-items:center;gap:10px;}
.sb-av{width:36px;height:36px;background:#6366f1;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:13px;flex-shrink:0;overflow:hidden;}
.sb-av img{width:100%;height:100%;object-fit:cover;}
.sb-uname{color:#e2e8f0;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px;}
.sb-email{color:#475569;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px;}
.sb-nav{flex:1;padding:8px 10px;}
.sb-a{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;color:#94a3b8;font-size:13.5px;font-weight:500;transition:all .18s;margin-bottom:2px;}
.sb-a:hover{background:rgba(255,255,255,.07);color:#e2e8f0;}.sb-a.active{background:rgba(99,102,241,.2);color:#a5b4fc;}
.sb-a svg{font-size:17px;flex-shrink:0;}
.sb-out{display:flex;align-items:center;gap:10px;margin:8px 10px 16px;padding:10px 12px;width:calc(100% - 20px);background:rgba(239,68,68,.1);border-radius:9px;color:#fca5a5;font-size:13.5px;font-weight:500;transition:all .18s;border:none;cursor:pointer;}
.sb-out:hover{background:rgba(239,68,68,.2);color:#fff;}`;

export default function Sidebar({role}){
  const{user,logout}=useAuth();const navigate=useNavigate();
  const links=role==='ADMIN'?aLinks:eLinks;
  const ini=user?.name?.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
  return(<>
    <style>{css}</style>
    <aside className="sb">
      <div className="sb-brand"><div className="sb-logo">EMS</div><div><div className="sb-bname">EMS Portal</div><div className="sb-role">{role}</div></div></div>
      <div className="sb-user">
        <div className="sb-av">
          {user?.profilePhoto
            ?<img src={user.profilePhoto} alt=""/>
            :ini}
        </div>
        <div><div className="sb-uname">{user?.name}</div><div className="sb-email">{user?.email}</div></div>
      </div>
      <nav className="sb-nav">{links.map(lk=><NavLink key={lk.to} to={lk.to} end={lk.to==='/admin'||lk.to==='/employee'} className={({isActive})=>'sb-a'+(isActive?' active':'')}>{lk.i}<span>{lk.l}</span></NavLink>)}</nav>
      <button className="sb-out" onClick={()=>{logout();navigate('/login');}}><FiLogOut/><span>Sign Out</span></button>
    </aside>
  </>);
}
