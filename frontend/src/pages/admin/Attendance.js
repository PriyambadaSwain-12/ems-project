import React,{useEffect,useState}from'react';import{getAllEmployees}from'../../services/employeeService';import{markAttendance,getAttendanceByDate}from'../../services/attendanceService';import{toast}from'react-toastify';import{FiSave,FiCalendar}from'react-icons/fi';
const SS=[{v:'PRESENT',l:'Present'},{v:'ABSENT',l:'Absent'},{v:'HALF_DAY',l:'Half Day'},{v:'LEAVE',l:'Leave'}];
export default function Attendance(){
  const[emps,setEmps]=useState([]);const[date,setDate]=useState(new Date().toISOString().split('T')[0]);const[att,setAtt]=useState({});const[saving,setSaving]=useState(false);
  useEffect(()=>{getAllEmployees().then(r=>setEmps(r.data.data||[])).catch(()=>{});},[]);
  useEffect(()=>{if(date)getAttendanceByDate(date).then(r=>{const m={};(r.data.data||[]).forEach(a=>{m[a.employee?.id]=a.status;});setAtt(m);}).catch(()=>setAtt({}));},[date]);
  const saveAll=()=>{setSaving(true);
    Promise.all(emps.map(e=>markAttendance({employeeId:e.id,date,status:att[e.id]||'ABSENT'})))
    .then(()=>toast.success('Attendance saved!')).catch(()=>toast.error('Error'))
    .finally(()=>setSaving(false));};
  const cnt=v=>Object.values(att).filter(s=>s===v).length;
  return(<div>
    <div className="ph"><div><h2 className="pt">Mark Attendance</h2></div>
      <div className="pa">
        <input type="date" className="form-control" style={{width:180}} value={date} onChange={e=>setDate(e.target.value)}/>
        <button className="btn btn-outline btn-sm" onClick={()=>{const m={};emps.forEach(e=>{m[e.id]='PRESENT';});setAtt(m);}}>All Present</button>
        <button className="btn btn-outline btn-sm" onClick={()=>{const m={};emps.forEach(e=>{m[e.id]='ABSENT';});setAtt(m);}}>All Absent</button>
        <button className="btn btn-primary" onClick={saveAll} disabled={saving}><FiSave/>{saving?'Saving…':'Save All'}</button></div></div>
    <div className="sg" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:20}}>
      {SS.map(s=><div key={s.v} className="sc" style={{padding:'14px 18px'}}><div style={{fontSize:22,fontWeight:700,color:'var(--dark)'}}>{cnt(s.v)}</div><div style={{fontSize:12.5,color:'var(--muted)',marginTop:2}}>{s.l}</div></div>)}
    </div>
    <div className="card" style={{padding:0}}><div className="tbl-wrap"><table className="tbl">
      <thead><tr><th>#</th><th>Employee</th><th>Department</th><th>Status</th></tr></thead>
      <tbody>{emps.map((e,i)=>(
        <tr key={e.id}>
          <td style={{color:'var(--faint)',width:40}}>{i+1}</td>
          <td><div style={{display:'flex',alignItems:'center',gap:10}}><div className="av">{e.name?.charAt(0)}</div><div><div style={{fontWeight:600,fontSize:13.5}}>{e.name}</div><div style={{fontSize:12,color:'var(--muted)'}}>{e.empCode}</div></div></div></td>
          <td>{e.departmentName||'—'}</td>
          <td><div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{SS.map(s=><button key={s.v} className={`btn btn-sm ${att[e.id]===s.v?'btn-primary':'btn-outline'}`} style={att[e.id]===s.v?{background:s.v==='PRESENT'?'var(--success)':s.v==='ABSENT'?'var(--danger)':s.v==='HALF_DAY'?'var(--warning)':'var(--info)',borderColor:'transparent'}:{}} onClick={()=>setAtt(p=>({...p,[e.id]:s.v}))}>{s.l}</button>)}</div></td>
        </tr>))}
      </tbody></table>
      {emps.length===0&&<div className="empty"><div className="empty-ic"><FiCalendar/></div><h4>No employees</h4></div>}
    </div></div>
  </div>);
}
