import React,{useEffect,useState}from'react';import{getDashboardStats,getPayrollByMonth}from'../../services/payrollService';import{getAllEmployees}from'../../services/employeeService';import{getPendingLeaves}from'../../services/leaveService';import{getAttendanceByDate}from'../../services/attendanceService';import{FiUsers,FiCheckCircle,FiFileText,FiXCircle}from'react-icons/fi';import{BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell}from'recharts';
const C=['#6366f1','#10b981','#f59e0b','#3b82f6','#ef4444'];
export default function AdminDashboard(){
  const[emps,setEmps]=useState([]);const[leaves,setLeaves]=useState([]);const[todayAtt,setTodayAtt]=useState([]);
  useEffect(()=>{
    getAllEmployees().then(r=>setEmps(r.data.data||[])).catch(()=>{});
    getPendingLeaves().then(r=>setLeaves(r.data.data||[])).catch(()=>{});
    getAttendanceByDate(new Date().toISOString().split('T')[0]).then(r=>setTodayAtt(r.data.data||[])).catch(()=>{});
  },[]);
  const dd=Object.entries(emps.reduce((a,e)=>{const d=e.departmentName||'Other';a[d]=(a[d]||0)+1;return a},{})).map(([name,count])=>({name,count}));
  const sc=emps.slice(0,8).map(e=>({name:e.name?.split(' ')[0],sal:e.basicSalary}));
  const present=todayAtt.filter(a=>a.status==='PRESENT').length;
  const absent=todayAtt.filter(a=>a.status==='ABSENT').length;
  return(
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
      <div className="sg">
        <div className="sc"><div className="si" style={{background:'#eef2ff',color:'#6366f1'}}><FiUsers/></div><div><div className="sv">{emps.length}</div><div className="sl">Total Employees</div></div></div>
        <div className="sc"><div className="si" style={{background:'#d1fae5',color:'#10b981'}}><FiCheckCircle/></div><div><div className="sv">{present}</div><div className="sl">Present Today</div></div></div>
        <div className="sc"><div className="si" style={{background:'#fef3c7',color:'#f59e0b'}}><FiFileText/></div><div><div className="sv">{leaves.length}</div><div className="sl">Pending Leaves</div></div></div>
        <div className="sc"><div className="si" style={{background:'#fee2e2',color:'#ef4444'}}><FiXCircle/></div><div><div className="sv">{absent}</div><div className="sl">Absent Today</div></div></div>
      </div>
      <div className="d2">
        <div className="card"><div className="sec-title">Salary Overview</div>
          <ResponsiveContainer width="100%" height={220}><BarChart data={sc} margin={{top:0,right:0,left:-20,bottom:0}}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="name" tick={{fontSize:12,fill:'#94a3b8'}}/><YAxis tick={{fontSize:12,fill:'#94a3b8'}}/><Tooltip formatter={v=>[`₹${v?.toLocaleString()}`,'Salary']} contentStyle={{borderRadius:8,border:'1px solid #e2e8f0',fontSize:13}}/><Bar dataKey="sal" fill="#6366f1" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
        <div className="card"><div className="sec-title">Departments</div>
          {dd.length>0?<><ResponsiveContainer width="100%" height={170}><PieChart><Pie data={dd} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="count" paddingAngle={3}>{dd.map((_,i)=><Cell key={i} fill={C[i%C.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer>
          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:8}}>{dd.map((d,i)=><span key={d.name} style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:12.5,color:'var(--muted)'}}><span style={{width:8,height:8,borderRadius:'50%',background:C[i%C.length],display:'inline-block'}}/>{d.name} ({d.count})</span>)}</div></>
          :<div className="empty" style={{padding:32}}><p>No departments yet</p></div>}</div>
      </div>
      <div className="d2">
        <div className="card"><div className="sec-title">Pending Leaves</div>
          {leaves.length===0?<div className="empty" style={{padding:28}}><h4>All clear! 🎉</h4><p>No pending leaves</p></div>:
          <div style={{display:'flex',flexDirection:'column',gap:10}}>{leaves.slice(0,5).map(l=>(
            <div key={l.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px',background:'var(--bg)',borderRadius:9}}>
              <div style={{width:34,height:34,background:'#eef2ff',color:'#6366f1',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,flexShrink:0}}>{l.employee?.user?.name?.charAt(0)}</div>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13.5}}>{l.employee?.user?.name}</div><div style={{fontSize:12,color:'var(--muted)'}}>{l.fromDate} → {l.toDate}</div></div>
              <span className={`badge badge-${l.type==='SICK'?'danger':'info'}`}>{l.type}</span>
            </div>))}</div>}</div>
        <div className="card"><div className="sec-title">Recent Employees</div>
          {emps.slice(0,5).map(e=>(
            <div key={e.id} style={{display:'flex',alignItems:'center',gap:12,padding:'9px 0',borderBottom:'1px solid var(--bl)'}}>
              <div className="av">{e.name?.charAt(0)}</div>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13.5}}>{e.name}</div><div style={{fontSize:12,color:'var(--muted)'}}>{e.departmentName||'No dept'}</div></div>
              <strong style={{color:'var(--success)',fontSize:13.5}}>₹{e.basicSalary?.toLocaleString()}</strong>
            </div>))}
          {emps.length===0&&<div className="empty" style={{padding:28}}><p>Add employees to get started</p></div>}
        </div>
      </div>
    </div>);
}
