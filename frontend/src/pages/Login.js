import React,{useState}from'react';import{useNavigate}from'react-router-dom';import{useAuth}from'../context/AuthContext';import{loginApi}from'../services/authService';import{toast}from'react-toastify';import{FiMail,FiLock,FiEye,FiEyeOff}from'react-icons/fi';
const css=`.lp{display:flex;min-height:100vh;}.ll{flex:1;background:#0f172a;padding:56px 64px;display:flex;flex-direction:column;justify-content:center;gap:32px;}.ll-logo{background:#6366f1;color:#fff;width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;}.ll h1{font-size:30px;font-weight:800;color:#f1f5f9;line-height:1.25;}.ll p{font-size:15px;color:#64748b;line-height:1.75;}.ll-feats{display:flex;flex-direction:column;gap:11px;}.lf{color:#94a3b8;font-size:14px;}.ll-tech{font-size:12px;color:#334155;}.lr{flex:0 0 480px;display:flex;align-items:center;justify-content:center;padding:40px;background:var(--bg);}.lc{background:#fff;border-radius:16px;border:1px solid var(--border);padding:40px;width:100%;max-width:420px;box-shadow:var(--shl);}.lc h2{font-size:24px;font-weight:800;}.lc-sub{font-size:13.5px;color:var(--muted);margin-top:4px;margin-bottom:28px;}.iw{position:relative;display:flex;align-items:center;}.ii{position:absolute;left:12px;color:var(--faint);font-size:15px;pointer-events:none;}.iw .form-control{padding-left:38px;padding-right:38px;}.ie{position:absolute;right:10px;background:none;border:none;cursor:pointer;color:var(--faint);padding:4px;}.lb-btn{width:100%;justify-content:center;margin-top:4px;}.lhint{margin-top:22px;border-top:1px solid var(--border);padding-top:18px;display:flex;flex-direction:column;gap:9px;}.hr{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--muted);}.hb{padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;}.hb.a{background:#eef2ff;color:#6366f1;}.hb.e{background:#d1fae5;color:#10b981;}`;
export default function Login(){
  const[form,setForm]=useState({email:'admin@ems.com',password:'Admin@123'});
  const[show,setShow]=useState(false);const[loading,setLoading]=useState(false);
  const{login}=useAuth();const navigate=useNavigate();
  const sub=e=>{e.preventDefault();setLoading(true);
    loginApi(form).then(r=>{const d=r.data.data;login(d);toast.success(`Welcome, ${d.name}!`);navigate(d.role==='ADMIN'?'/admin':'/employee');})
    .catch(err=>toast.error(err.response?.data?.message||'Invalid credentials'))
    .finally(()=>setLoading(false));};
  return(<><style>{css}</style>
    <div className="lp">
      <div className="ll">
        <div className="ll-logo">EMS</div>
        <h1>Employee Management System</h1>
        <p>Complete workforce management — payroll, attendance, leaves and more.</p>
        <div className="ll-feats">{['Role-Based Access (Admin + Employee)','Automated Payroll with PDF Slips','Attendance Tracking','Leave Approval Workflow'].map(f=><div key={f} className="lf">✓ {f}</div>)}</div>
        <div className="ll-tech">Spring Boot · React · MySQL · JWT</div>
      </div>
      <div className="lr"><div className="lc">
        <h2>Sign In</h2><p className="lc-sub">Enter credentials to continue</p>
        <form onSubmit={sub}>
          <div className="form-group"><label className="form-label">Email</label>
            <div className="iw"><FiMail className="ii"/><input className="form-control" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></div></div>
          <div className="form-group"><label className="form-label">Password</label>
            <div className="iw"><FiLock className="ii"/><input className="form-control" type={show?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/><button type="button" className="ie" onClick={()=>setShow(!show)}>{show?<FiEyeOff/>:<FiEye/>}</button></div></div>
          <button className="btn btn-primary btn-lg lb-btn" disabled={loading}>{loading?'Signing in…':'Sign In'}</button>
        </form>
        <div className="lhint">
          <div className="hr"><span className="hb a">Admin</span><span>admin@ems.com / Admin@123</span></div>
          <div className="hr"><span className="hb e">Employee</span><span>Credentials set by admin</span></div>
        </div>
      </div></div>
    </div></>);
}
