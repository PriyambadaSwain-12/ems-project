import React,{useEffect,useState}from'react';import{getAllEmployees}from'../../services/employeeService';import{getPayrollByMonth}from'../../services/payrollService';import{BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer}from'recharts';import{FiBarChart2}from'react-icons/fi';
const M=['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export default function Reports(){
  const[emps,setEmps]=useState([]);const[pays,setPays]=useState([]);const[month,setMonth]=useState(new Date().getMonth()+1);const[year,setYear]=useState(new Date().getFullYear());
  useEffect(()=>{getAllEmployees().then(r=>setEmps(r.data.data||[])).catch(()=>{});},[]);
  useEffect(()=>{getPayrollByMonth(month,year).then(r=>setPays(r.data.data||[])).catch(()=>setPays([]));},[month,year]);
  const sd=pays.map(p=>({name:p.employeeName?.split(' ')[0],net:p.netSalary,ded:p.totalDeductions}));
  const dd=Object.values(emps.reduce((a,e)=>{const d=e.departmentName||'Other';if(!a[d])a[d]={dept:d,count:0,total:0};a[d].count++;a[d].total+=e.basicSalary||0;return a},{})).map(d=>({...d,avg:Math.round(d.total/d.count)}));
  return(<div>
    <div className="ph"><div><h2 className="pt">Reports & Analytics</h2></div>
      <div className="pa"><select className="form-control" style={{width:110}} value={month} onChange={e=>setMonth(e.target.value)}>{M.slice(1).map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}</select><input type="number" className="form-control" style={{width:88}} value={year} onChange={e=>setYear(e.target.value)}/></div></div>
    <div className="d2" style={{marginBottom:22}}>
      <div className="card"><div className="sec-title">Net Salary — {M[month]} {year}</div>
        {sd.length>0?<ResponsiveContainer width="100%" height={230}><BarChart data={sd} margin={{top:0,right:0,left:-20,bottom:0}}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="name" tick={{fontSize:12,fill:'#94a3b8'}}/><YAxis tick={{fontSize:12,fill:'#94a3b8'}}/><Tooltip contentStyle={{borderRadius:8,border:'1px solid #e2e8f0',fontSize:13}}/><Bar dataKey="net" name="Net" fill="#10b981" radius={[4,4,0,0]}/><Bar dataKey="ded" name="Deductions" fill="#ef4444" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>:<div className="empty" style={{padding:40}}><p>Generate payroll first</p></div>}</div>
      <div className="card"><div className="sec-title">Avg Salary by Dept</div>
        {dd.length>0?<ResponsiveContainer width="100%" height={230}><BarChart data={dd} layout="vertical" margin={{top:0,right:20,left:60,bottom:0}}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis type="number" tick={{fontSize:12,fill:'#94a3b8'}}/><YAxis dataKey="dept" type="category" tick={{fontSize:12,fill:'#94a3b8'}} width={60}/><Tooltip contentStyle={{borderRadius:8,border:'1px solid #e2e8f0',fontSize:13}}/><Bar dataKey="avg" fill="#6366f1" radius={[0,4,4,0]}/></BarChart></ResponsiveContainer>:<div className="empty" style={{padding:40}}><p>Add departments and employees</p></div>}</div>
    </div>
    <div className="card" style={{padding:0}}><div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)'}}><div className="sec-title" style={{margin:0}}>Payroll Summary — {M[month]} {year}</div></div>
      <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Employee</th><th>Department</th><th>Gross</th><th>Deductions</th><th>Net</th><th>Attendance</th></tr></thead>
        <tbody>{pays.map(p=><tr key={p.id}><td><strong>{p.employeeName}</strong><br/><small style={{color:'var(--muted)'}}>{p.empCode}</small></td><td>{p.departmentName}</td><td>₹{p.totalEarnings?.toLocaleString()}</td><td style={{color:'var(--danger)'}}>-₹{p.totalDeductions?.toLocaleString()}</td><td><strong style={{color:'var(--success)'}}>₹{p.netSalary?.toLocaleString()}</strong></td><td><span className="badge badge-info">{p.presentDays}/{p.workingDays}</span></td></tr>)}</tbody>
      </table>{pays.length===0&&<div className="empty"><div className="empty-ic"><FiBarChart2/></div><h4>No data for {M[month]} {year}</h4></div>}
    </div></div>
  </div>);
}
