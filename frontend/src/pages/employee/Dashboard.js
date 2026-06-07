import React,{useEffect,useState}from'react';import{getMyProfile}from'../../services/employeeService';import{getMyAttendance}from'../../services/attendanceService';import{getMyLeaves}from'../../services/leaveService';import{useAuth}from'../../context/AuthContext';import{FiClock,FiCalendar,FiCheckCircle,FiXCircle}from'react-icons/fi';
export default function EmpDashboard(){
  const{user}=useAuth();const[profile,setProfile]=useState(null);const[att,setAtt]=useState([]);const[leaves,setLeaves]=useState([]);
  useEffect(()=>{getMyProfile().then(r=>setProfile(r.data.data)).catch(()=>{});getMyAttendance().then(r=>setAtt(r.data.data||[])).catch(()=>{});getMyLeaves().then(r=>setLeaves(r.data.data||[])).catch(()=>{});},[]);
  const now=new Date();
  const tm=att.filter(a=>{const d=new Date(a.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();});
  return(<div>
    <div style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed)',borderRadius:14,padding:'28px 32px',color:'#fff',marginBottom:24}}>
      <h2 style={{fontSize:22,fontWeight:800}}>Good {now.getHours()<12?'morning':'afternoon'}, {user?.name?.split(' ')[0]}! 👋</h2>
      <p style={{opacity:.8,marginTop:6,fontSize:14}}>{profile?.designation||'Employee'} · {profile?.departmentName||'N/A'} · {profile?.empCode||'—'}</p>
    </div>
    <div className="sg">
      <div className="sc"><div className="si" style={{background:'#d1fae5',color:'#10b981'}}><FiCheckCircle/></div><div><div className="sv">{tm.filter(a=>a.status==='PRESENT').length}</div><div className="sl">Present This Month</div></div></div>
      <div className="sc"><div className="si" style={{background:'#fee2e2',color:'#ef4444'}}><FiXCircle/></div><div><div className="sv">{tm.filter(a=>a.status==='ABSENT').length}</div><div className="sl">Absent This Month</div></div></div>
      <div className="sc"><div className="si" style={{background:'#fef3c7',color:'#f59e0b'}}><FiCalendar/></div><div><div className="sv">{leaves.filter(l=>l.status==='PENDING').length}</div><div className="sl">Pending Leaves</div></div></div>
      <div className="sc"><div className="si" style={{background:'#dbeafe',color:'#3b82f6'}}><FiClock/></div><div><div className="sv">{leaves.filter(l=>l.status==='APPROVED').length}</div><div className="sl">Approved Leaves</div></div></div>
    </div>
    <div className="d2">
      <div className="card"><div className="sec-title">Profile Summary</div>
        {profile?[['Emp Code',profile.empCode],['Department',profile.departmentName],['Designation',profile.designation],['Phone',profile.phone],['Joining Date',profile.joiningDate],['Gender',profile.gender]].map(([k,v])=><div key={k} className="ir"><span className="ik">{k}</span><span className="iv">{v||'—'}</span></div>):<div style={{textAlign:'center',padding:24,color:'var(--muted)',fontSize:13}}>Loading…</div>}
      </div>
      <div className="card"><div className="sec-title">Recent Attendance</div>
        {att.length>0?att.slice(0,6).map(a=><div key={a.id} className="ir"><span className="ik">{new Date(a.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',weekday:'short'})}</span><span className={`badge badge-${a.status==='PRESENT'?'success':a.status==='ABSENT'?'danger':a.status==='HALF_DAY'?'warning':'info'}`}>{a.status}</span></div>):<div style={{textAlign:'center',padding:28,color:'var(--muted)',fontSize:13}}>No records yet</div>}
      </div>
    </div>
  </div>);
}
