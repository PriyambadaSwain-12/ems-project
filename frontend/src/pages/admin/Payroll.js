import React,{useEffect,useState}from'react';import{getAllEmployees}from'../../services/employeeService';import{generatePayroll,getPayrollByMonth,downloadSalarySlip}from'../../services/payrollService';import{toast}from'react-toastify';import{FiZap,FiDownload,FiEye,FiDollarSign}from'react-icons/fi';
const M=['','January','February','March','April','May','June','July','August','September','October','November','December'];
export default function Payroll(){
  const[emps,setEmps]=useState([]);const[pays,setPays]=useState([]);const[month,setMonth]=useState(new Date().getMonth()+1);const[year,setYear]=useState(new Date().getFullYear());const[sel,setSel]=useState('');const[gen,setGen]=useState(false);const[detail,setDetail]=useState(null);
  useEffect(()=>{getAllEmployees().then(r=>setEmps(r.data.data||[])).catch(()=>{});},[]);
  const loadP=()=>getPayrollByMonth(month,year).then(r=>setPays(r.data.data||[])).catch(()=>setPays([]));
  useEffect(()=>{loadP();},[month,year]);
  const genOne=()=>{if(!sel){toast.warning('Select employee');return;}setGen(true);
    generatePayroll({employeeId:parseInt(sel),month:parseInt(month),year:parseInt(year)})
    .then(()=>{toast.success('Payroll generated!');loadP();}).catch(err=>toast.error(err.response?.data?.message||'Already generated'))
    .finally(()=>setGen(false));};
  const genAll=()=>{if(!window.confirm(`Generate for all ${emps.length} employees?`))return;setGen(true);
    let ok=0,fail=0;const tasks=emps.map(e=>generatePayroll({employeeId:e.id,month:parseInt(month),year:parseInt(year)}).then(()=>ok++).catch(()=>fail++));
    Promise.all(tasks).then(()=>{toast.success(`Done: ${ok} generated, ${fail} skipped`);loadP();}).finally(()=>setGen(false));};
  const dl=p=>{downloadSalarySlip(p.id).then(r=>{const url=URL.createObjectURL(new Blob([r.data],{type:'application/pdf'}));const a=document.createElement('a');a.href=url;a.download=`salary-slip-${p.employeeName?.replace(/ /g,'-')}-${M[p.month]}-${p.year}.pdf`;a.click();URL.revokeObjectURL(url);toast.success('Downloaded!');}).catch(()=>toast.error('Download failed'));};
  const total=pays.reduce((s,p)=>s+(p.netSalary||0),0);
  return(<div>
    <div className="ph"><div><h2 className="pt">Payroll — {M[month]} {year}</h2><p className="ps">{pays.length} records · Total: ₹{total.toLocaleString()}</p></div></div>
    <div className="card" style={{marginBottom:22}}>
      <div style={{display:'flex',gap:14,alignItems:'flex-end',flexWrap:'wrap'}}>
        <div className="form-group" style={{margin:0}}><label className="form-label">Month</label><select className="form-control" style={{width:140}} value={month} onChange={e=>setMonth(e.target.value)}>{M.slice(1).map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}</select></div>
        <div className="form-group" style={{margin:0}}><label className="form-label">Year</label><input type="number" className="form-control" style={{width:100}} value={year} onChange={e=>setYear(e.target.value)}/></div>
        <div className="form-group" style={{margin:0,flex:1,minWidth:200}}><label className="form-label">Employee</label><select className="form-control" value={sel} onChange={e=>setSel(e.target.value)}><option value="">Select employee…</option>{emps.map(e=><option key={e.id} value={e.id}>{e.name} ({e.empCode})</option>)}</select></div>
        <button className="btn btn-primary" onClick={genOne} disabled={gen}><FiZap/>Generate</button>
        <button className="btn btn-success" onClick={genAll} disabled={gen}><FiZap/>Generate All</button>
      </div></div>
    <div className="card" style={{padding:0}}><div className="tbl-wrap"><table className="tbl">
      <thead><tr><th>Employee</th><th>Basic</th><th>HRA</th><th>DA</th><th>Gross</th><th>Deductions</th><th>Net</th><th>Days</th><th>Actions</th></tr></thead>
      <tbody>{pays.map(p=>(
        <tr key={p.id}>
          <td><div style={{display:'flex',alignItems:'center',gap:10}}><div className="av">{p.employeeName?.charAt(0)}</div><div><div style={{fontWeight:600,fontSize:13.5}}>{p.employeeName}</div><div style={{fontSize:12,color:'var(--muted)'}}>{p.empCode}</div></div></div></td>
          <td>₹{p.basicSalary?.toLocaleString()}</td><td>₹{p.hra?.toLocaleString()}</td><td>₹{p.da?.toLocaleString()}</td>
          <td style={{fontWeight:600}}>₹{p.totalEarnings?.toLocaleString()}</td><td style={{color:'var(--danger)'}}>-₹{p.totalDeductions?.toLocaleString()}</td>
          <td><strong style={{color:'var(--success)',fontSize:14}}>₹{p.netSalary?.toLocaleString()}</strong></td>
          <td><span className="badge badge-gray">{p.presentDays}/{p.workingDays}</span></td>
          <td><div style={{display:'flex',gap:6}}><button className="btn btn-outline btn-sm" onClick={()=>setDetail(p)}><FiEye/></button><button className="btn btn-primary btn-sm" onClick={()=>dl(p)}><FiDownload/>PDF</button></div></td>
        </tr>))}</tbody></table>
      {pays.length===0&&<div className="empty"><div className="empty-ic"><FiDollarSign/></div><h4>No payroll for {M[month]} {year}</h4><p>Click "Generate All" to process</p></div>}
    </div></div>
    {detail&&<div className="modal-bg" onClick={e=>e.target.className==='modal-bg'&&setDetail(null)}>
      <div className="modal"><div className="modal-hdr"><h3>Payroll — {detail.employeeName}</h3><button className="modal-x" onClick={()=>setDetail(null)}>×</button></div>
        <div className="modal-body">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
            {[['Period',`${M[detail.month]} ${detail.year}`],['Dept',detail.departmentName],['Designation',detail.designation],['Working Days',detail.workingDays],['Present Days',detail.presentDays],['LOP Days',detail.workingDays-detail.presentDays]].map(([k,v])=>(
              <div key={k} style={{background:'var(--bg)',padding:'10px 14px',borderRadius:8}}><div style={{fontSize:11,color:'var(--faint)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:3}}>{k}</div><div style={{fontWeight:700,fontSize:14}}>{v??'N/A'}</div></div>))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <div>{[['Basic',detail.basicSalary],['HRA (40%)',detail.hra],['DA (20%)',detail.da]].map(([k,v])=><div key={k} className="ir"><span className="ik">{k}</span><span className="iv">₹{v?.toLocaleString()}</span></div>)}<div className="ir" style={{borderBottom:'none'}}><span style={{fontWeight:700,color:'var(--success)'}}>Total Earnings</span><span style={{fontWeight:700,color:'var(--success)'}}>₹{detail.totalEarnings?.toLocaleString()}</span></div></div>
            <div>{[['PF (12%)',detail.pfDeduction],['Tax',detail.taxDeduction],['LOP',detail.lossOfPayDeduction]].map(([k,v])=><div key={k} className="ir"><span className="ik">{k}</span><span style={{fontWeight:600,color:'var(--danger)'}}>-₹{v?.toLocaleString()}</span></div>)}<div className="ir" style={{borderBottom:'none'}}><span style={{fontWeight:700,color:'var(--danger)'}}>Total Deductions</span><span style={{fontWeight:700,color:'var(--danger)'}}>-₹{detail.totalDeductions?.toLocaleString()}</span></div></div>
          </div>
          <div style={{background:'var(--primary)',borderRadius:10,padding:'16px 20px',marginTop:16,display:'flex',justifyContent:'space-between',alignItems:'center',color:'#fff'}}>
            <span style={{fontWeight:600}}>NET SALARY</span><span style={{fontSize:24,fontWeight:800}}>₹{detail.netSalary?.toLocaleString()}</span></div>
        </div>
        <div className="modal-ftr"><button className="btn btn-ghost" onClick={()=>setDetail(null)}>Close</button><button className="btn btn-primary" onClick={()=>dl(detail)}><FiDownload/>Download PDF</button></div>
      </div></div>}
  </div>);
}
