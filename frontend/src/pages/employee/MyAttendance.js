import React,{useEffect,useState}from'react';import{getMyAttendance}from'../../services/attendanceService';import{FiClock}from'react-icons/fi';
const M=['','January','February','March','April','May','June','July','August','September','October','November','December'];
export default function MyAttendance(){
  const[att,setAtt]=useState([]);const[month,setMonth]=useState(new Date().getMonth()+1);const[year,setYear]=useState(new Date().getFullYear());
  useEffect(()=>{getMyAttendance().then(r=>setAtt(r.data.data||[])).catch(()=>{});},[]);
  const filtered=att.filter(a=>{const d=new Date(a.date);return d.getMonth()+1===parseInt(month)&&d.getFullYear()===parseInt(year);}).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const cnt={PRESENT:0,ABSENT:0,HALF_DAY:0,LEAVE:0};filtered.forEach(a=>{if(cnt[a.status]!==undefined)cnt[a.status]++;});
  const pct=filtered.length>0?Math.round((cnt.PRESENT/filtered.length)*100):0;
  return(<div>
    <div className="ph"><div><h2 className="pt">My Attendance</h2></div>
      <div className="pa"><select className="form-control" style={{width:140}} value={month} onChange={e=>setMonth(e.target.value)}>{M.slice(1).map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}</select><input type="number" className="form-control" style={{width:90}} value={year} onChange={e=>setYear(e.target.value)}/></div></div>
    <div className="sg" style={{marginBottom:22}}>
      {[{l:'Present',v:cnt.PRESENT,c:'var(--success)',b:'var(--success-light)'},{l:'Absent',v:cnt.ABSENT,c:'var(--danger)',b:'var(--danger-light)'},{l:'Half Day',v:cnt.HALF_DAY,c:'var(--warning)',b:'var(--warning-light)'},{l:'On Leave',v:cnt.LEAVE,c:'var(--info)',b:'var(--info-light)'}].map(s=>(
        <div key={s.l} className="sc"><div className="si" style={{background:s.b,color:s.c}}><FiClock/></div><div><div className="sv" style={{color:s.c}}>{s.v}</div><div className="sl">{s.l}</div></div></div>))}
    </div>
    {filtered.length>0&&<div className="card" style={{marginBottom:22}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:14,fontWeight:600}}>Attendance Rate — {M[month]}</span><span style={{fontSize:14,fontWeight:700,color:pct>=80?'var(--success)':pct>=60?'var(--warning)':'var(--danger)'}}>{pct}%</span></div>
      <div style={{height:10,background:'var(--bl)',borderRadius:6,overflow:'hidden'}}><div style={{width:`${pct}%`,height:'100%',background:pct>=80?'var(--success)':pct>=60?'var(--warning)':'var(--danger)',borderRadius:6,transition:'width .6s'}}/></div>
    </div>}
    <div className="card" style={{padding:0}}><div className="tbl-wrap"><table className="tbl">
      <thead><tr><th>Date</th><th>Day</th><th>Status</th><th>Remarks</th></tr></thead>
      <tbody>{filtered.map(a=>(
        <tr key={a.id}>
          <td><strong>{new Date(a.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</strong></td>
          <td style={{color:'var(--muted)'}}>{new Date(a.date).toLocaleDateString('en-IN',{weekday:'long'})}</td>
          <td><span className={`badge badge-${a.status==='PRESENT'?'success':a.status==='ABSENT'?'danger':a.status==='HALF_DAY'?'warning':'info'}`}>{a.status.replace('_',' ')}</span></td>
          <td style={{color:'var(--muted)',fontSize:13}}>{a.remarks||'—'}</td>
        </tr>))}</tbody></table>
      {filtered.length===0&&<div className="empty"><div className="empty-ic"><FiClock/></div><h4>No records for {M[month]} {year}</h4></div>}
    </div></div>
  </div>);
}
