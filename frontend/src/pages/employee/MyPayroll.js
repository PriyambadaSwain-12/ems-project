import React,{useState}from'react';import{getMyPayroll,downloadSalarySlip}from'../../services/payrollService';import{toast}from'react-toastify';import{FiSearch,FiDownload,FiDollarSign}from'react-icons/fi';
const M=['','January','February','March','April','May','June','July','August','September','October','November','December'];
export default function MyPayroll(){
  const[p,setP]=useState(null);const[month,setMonth]=useState(new Date().getMonth()+1);const[year,setYear]=useState(new Date().getFullYear());const[loading,setLoading]=useState(false);
  const fetch=()=>{setLoading(true);getMyPayroll(month,year).then(r=>setP(r.data.data)).catch(()=>{toast.error('No payroll found. Ask admin to generate.');setP(null);}).finally(()=>setLoading(false));};
  const dl=()=>downloadSalarySlip(p.id).then(r=>{const url=URL.createObjectURL(new Blob([r.data],{type:'application/pdf'}));const a=document.createElement('a');a.href=url;a.download=`salary-slip-${M[p.month]}-${p.year}.pdf`;a.click();URL.revokeObjectURL(url);toast.success('Downloaded!');}).catch(()=>toast.error('Download failed'));
  return(<div>
    <div className="ph"><h2 className="pt">My Payroll</h2></div>
    <div className="card" style={{marginBottom:22}}>
      <div style={{display:'flex',gap:14,alignItems:'flex-end'}}>
        <div className="form-group" style={{margin:0}}><label className="form-label">Month</label><select className="form-control" style={{width:160}} value={month} onChange={e=>setMonth(e.target.value)}>{M.slice(1).map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}</select></div>
        <div className="form-group" style={{margin:0}}><label className="form-label">Year</label><input type="number" className="form-control" style={{width:100}} value={year} onChange={e=>setYear(e.target.value)}/></div>
        <button className="btn btn-primary" onClick={fetch} disabled={loading}><FiSearch/>{loading?'Loading…':'View Payslip'}</button>
      </div></div>
    {p?(<div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
        <div><h3 style={{fontSize:18,fontWeight:800}}>Salary Slip — {M[p.month]} {p.year}</h3><p style={{fontSize:13,color:'var(--muted)',marginTop:2}}>Generated {p.generatedDate}</p></div>
        <button className="btn btn-primary" onClick={dl}><FiDownload/>Download PDF</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:22}}>
        {[['Emp Code',p.empCode],['Department',p.departmentName],['Designation',p.designation],['Working Days',p.workingDays],['Present Days',p.presentDays],['LOP Days',p.workingDays-p.presentDays]].map(([k,v])=>(
          <div key={k} style={{background:'var(--bg)',borderRadius:9,padding:'12px 14px'}}><div style={{fontSize:11,color:'var(--faint)',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:3}}>{k}</div><div style={{fontWeight:700,fontSize:15}}>{v??'—'}</div></div>))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:22,marginBottom:20}}>
        <div style={{background:'var(--success-light)',borderRadius:12,padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:'#065f46',marginBottom:14,textTransform:'uppercase',letterSpacing:'.6px'}}>Earnings</div>
          {[['Basic Salary',p.basicSalary],['HRA (40%)',p.hra],['DA (20%)',p.da]].map(([k,v])=><div key={k} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(0,0,0,.06)'}}><span style={{fontSize:13,color:'#065f46'}}>{k}</span><span style={{fontWeight:700,fontSize:13}}>₹{v?.toLocaleString()}</span></div>)}
          <div style={{display:'flex',justifyContent:'space-between',paddingTop:10,fontWeight:800,color:'#064e3b'}}><span>Total</span><span style={{fontSize:16}}>₹{p.totalEarnings?.toLocaleString()}</span></div>
        </div>
        <div style={{background:'var(--danger-light)',borderRadius:12,padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:'#991b1b',marginBottom:14,textTransform:'uppercase',letterSpacing:'.6px'}}>Deductions</div>
          {[['PF (12%)',p.pfDeduction],['Income Tax',p.taxDeduction],['Loss of Pay',p.lossOfPayDeduction]].map(([k,v])=><div key={k} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(0,0,0,.06)'}}><span style={{fontSize:13,color:'#991b1b'}}>{k}</span><span style={{fontWeight:700,fontSize:13,color:'var(--danger)'}}>-₹{v?.toLocaleString()}</span></div>)}
          <div style={{display:'flex',justifyContent:'space-between',paddingTop:10,fontWeight:800,color:'#7f1d1d'}}><span>Total</span><span style={{fontSize:16}}>-₹{p.totalDeductions?.toLocaleString()}</span></div>
        </div>
      </div>
      <div style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed)',borderRadius:12,padding:'20px 28px',display:'flex',justifyContent:'space-between',alignItems:'center',color:'#fff'}}>
        <div><div style={{fontSize:13,opacity:.8,textTransform:'uppercase',letterSpacing:'.8px'}}>Net Salary</div><div style={{fontSize:12,opacity:.6,marginTop:2}}>{M[p.month]} {p.year}</div></div>
        <div style={{fontSize:34,fontWeight:900}}>₹{p.netSalary?.toLocaleString()}</div>
      </div>
    </div>):(<div className="card"><div className="empty"><div className="empty-ic"><FiDollarSign/></div><h4>No payroll found</h4><p>Select month/year and click View Payslip. Contact admin if not generated.</p></div></div>)}
  </div>);
}
