import React,{useEffect,useState,useRef}from'react';
import{getAllEmployees,createEmployee,updateEmployee,deleteEmployee}from'../../services/employeeService';
import{getAllDepartments}from'../../services/departmentService';
import{toast}from'react-toastify';
import{FiPlus,FiEdit2,FiTrash2,FiSearch,FiUsers,FiUser,FiBriefcase,FiDollarSign,FiX,FiCheck,FiChevronRight,FiChevronLeft,FiCamera}from'react-icons/fi';

const blank={name:'',email:'',password:'',departmentId:'',designation:'',phone:'',address:'',gender:'',basicSalary:'',joiningDate:new Date().toISOString().split('T')[0],dateOfBirth:''};

function ConfirmModal({onConfirm,onCancel,name}){
  return(
    <div className="modal-bg">
      <div className="modal modal-sm modal-confirm" style={{animation:'modalIn .2s cubic-bezier(.34,1.56,.64,1)'}}>
        <div className="modal-body">
          <div className="modal-confirm-icon danger"><FiTrash2/></div>
          <h4>Delete Employee?</h4>
          <p>This will permanently remove <strong>{name}</strong> and all their data. This cannot be undone.</p>
        </div>
        <div className="modal-ftr" style={{justifyContent:'center',gap:12}}>
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}><FiTrash2/>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function Employees(){
  const[emps,setEmps]=useState([]);const[depts,setDepts]=useState([]);
  const[modal,setModal]=useState(false);const[editId,setEditId]=useState(null);
  const[form,setForm]=useState(blank);const[q,setQ]=useState('');
  const[loading,setLoading]=useState(false);const[step,setStep]=useState(1);
  const[delTarget,setDelTarget]=useState(null);
  const fileRef=useRef();

  const load=()=>{
    getAllEmployees().then(r=>setEmps(r.data.data||[])).catch(()=>{});
    getAllDepartments().then(r=>setDepts(r.data.data||[])).catch(()=>{});
  };
  useEffect(()=>{load();},[]);

  const openAdd=()=>{setForm(blank);setEditId(null);setStep(1);setModal(true);};
  const openEdit=e=>{setForm({...e,password:'',departmentId:e.departmentId||''});setEditId(e.id);setStep(1);setModal(true);};
  const close=()=>{setModal(false);setStep(1);};

  const handlePhoto=e=>{
    const file=e.target.files[0];if(!file)return;
    if(file.size>2*1024*1024){toast.error('Max 2MB');return;}
    const r=new FileReader();r.onload=ev=>setForm(f=>({...f,profilePhoto:ev.target.result}));r.readAsDataURL(file);
  };

  const save=async()=>{
    setLoading(true);
    try{
      if(editId)await updateEmployee(editId,form);else await createEmployee(form);
      toast.success(editId?'Employee updated!':'Employee created successfully!');
      close();load();
    }catch(err){toast.error(err.response?.data?.message||'Something went wrong');}
    finally{setLoading(false);}
  };

  const filtered=emps.filter(e=>[e.name,e.email,e.empCode,e.departmentName,e.designation].some(v=>v?.toLowerCase().includes(q.toLowerCase())));
  const steps=['Basic Info','Work Details','Contact'];

  const step1Valid=form.name&&form.email&&(editId||true);

  return(<div className="fade-in">
    <div className="ph">
      <div><h2 className="pt">Employees</h2><p className="ps">{emps.length} team members</p></div>
      <div className="pa">
        <div className="sw-box"><FiSearch className="sw-icon"/><input className="form-control" style={{width:240}} placeholder="Search name, email, role…" value={q} onChange={e=>setQ(e.target.value)}/></div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus/>Add Employee</button>
      </div>
    </div>

    <div className="tbl-wrap"><table className="tbl">
      <thead><tr><th>Employee</th><th>Code</th><th>Department</th><th>Designation</th><th>Phone</th><th>Basic Salary</th><th style={{width:100}}>Actions</th></tr></thead>
      <tbody>{filtered.map(e=>(
        <tr key={e.id} className="fade-in">
          <td><div style={{display:'flex',alignItems:'center',gap:11}}>
            {e.profilePhoto
              ?<img src={e.profilePhoto} alt="" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover',flexShrink:0,border:'2px solid var(--border)'}}/>
              :<div style={{width:36,height:36,borderRadius:'50%',background:`hsl(${(e.name?.charCodeAt(0)||65)*5},70%,88%)`,color:`hsl(${(e.name?.charCodeAt(0)||65)*5},60%,35%)`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,flexShrink:0}}>{e.name?.charAt(0)}</div>}
            <div><div style={{fontWeight:600,fontSize:14}}>{e.name}</div><div style={{fontSize:12,color:'var(--muted)'}}>{e.email}</div></div>
          </div></td>
          <td><span className="badge badge-purple">{e.empCode}</span></td>
          <td><span style={{fontSize:13}}>{e.departmentName||'—'}</span></td>
          <td><span style={{fontSize:13}}>{e.designation||'—'}</span></td>
          <td><span style={{fontSize:13}}>{e.phone||'—'}</span></td>
          <td><span style={{fontWeight:700,color:'var(--success)',fontSize:14}}>₹{e.basicSalary?.toLocaleString()}</span></td>
          <td><div style={{display:'flex',gap:6}}>
            <button className="btn btn-outline btn-sm" onClick={()=>openEdit(e)} title="Edit"><FiEdit2/></button>
            <button className="btn btn-sm" style={{background:'var(--danger-light)',color:'var(--danger)',border:'1.5px solid #fecaca'}} onClick={()=>setDelTarget(e)} title="Delete"><FiTrash2/></button>
          </div></td>
        </tr>))}
      </tbody>
    </table>
    {filtered.length===0&&<div className="empty"><div className="empty-ic"><FiUsers/></div><h4>{q?'No results found':'No employees yet'}</h4><p>{q?'Try a different search term':'Click Add Employee to get started'}</p></div>}
    </div>

    {/* ── Add/Edit Modal with Stepper ── */}
    {modal&&<div className="modal-bg" onClick={e=>e.target.className==='modal-bg'&&close()}>
      <div className="modal modal-lg">

        {/* Header */}
        <div className="modal-hdr">
          <div className="modal-hdr-left">
            <div className="modal-hdr-icon">{editId?<FiEdit2/>:<FiUsers/>}</div>
            <div>
              <h3>{editId?'Edit Employee':'Add New Employee'}</h3>
              <p style={{fontSize:12,color:'var(--muted)',marginTop:2}}>Step {step} of {steps.length} — {steps[step-1]}</p>
            </div>
          </div>
          <button className="modal-x" onClick={close}><FiX/></button>
        </div>

        {/* Stepper */}
        <div className="modal-steps">
          {steps.map((s,i)=>(
            <React.Fragment key={s}>
              <div className={`ms-step ${step===i+1?'active':step>i+1?'done':''}`} style={{cursor:step>i+1?'pointer':'default'}} onClick={()=>step>i+1&&setStep(i+1)}>
                <div className="ms-dot">{step>i+1?<FiCheck size={11}/>:i+1}</div>
                <span>{s}</span>
              </div>
              {i<steps.length-1&&<div className={`ms-line ${step>i+1?'done':''}`}/>}
            </React.Fragment>))}
        </div>

        <div className="modal-body">

          {/* ── Step 1: Basic Info ── */}
          {step===1&&<div className="fade-in">
            {/* Photo upload */}
            <div style={{display:'flex',justifyContent:'center',marginBottom:24}}>
              <div style={{position:'relative',cursor:'pointer'}} onClick={()=>fileRef.current.click()}>
                {form.profilePhoto
                  ?<img src={form.profilePhoto} alt="" style={{width:80,height:80,borderRadius:'50%',objectFit:'cover',border:'3px solid var(--primary)'}}/>
                  :<div style={{width:80,height:80,borderRadius:'50%',background:'var(--primary-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,color:'var(--primary)',border:'2px dashed var(--primary)'}}><FiUser/></div>}
                <div style={{position:'absolute',bottom:0,right:0,width:26,height:26,borderRadius:'50%',background:'var(--primary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,border:'2px solid #fff'}}><FiCamera/></div>
                <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handlePhoto}/>
              </div>
            </div>
            <div style={{textAlign:'center',fontSize:12,color:'var(--muted)',marginTop:-16,marginBottom:20}}>Click to upload photo (optional)</div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div className="input-group"><FiUser className="input-icon"/><input className="form-control" placeholder="e.g. Priyambada Swain" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-control" type="email" placeholder="email@company.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required disabled={!!editId}/>
              </div>
            </div>
            {!editId&&<div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" placeholder="Leave blank to use Employee@123" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
              <p style={{fontSize:11.5,color:'var(--faint)',marginTop:5}}>Default password: <code style={{background:'var(--bg)',padding:'1px 6px',borderRadius:4,fontSize:11}}>Employee@123</code></p>
            </div>}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-control" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                  <option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input className="form-control" type="date" value={form.dateOfBirth||''} onChange={e=>setForm({...form,dateOfBirth:e.target.value})}/>
              </div>
            </div>
          </div>}

          {/* ── Step 2: Work Details ── */}
          {step===2&&<div className="fade-in">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Department</label>
                <div className="input-group"><FiBriefcase className="input-icon"/>
                  <select className="form-control" value={form.departmentId} onChange={e=>setForm({...form,departmentId:e.target.value})}>
                    <option value="">Select department</option>{depts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <input className="form-control" placeholder="e.g. Senior Developer" value={form.designation} onChange={e=>setForm({...form,designation:e.target.value})}/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Basic Salary (₹) *</label>
                <div className="input-group"><FiDollarSign className="input-icon"/><input className="form-control" type="number" placeholder="e.g. 50000" value={form.basicSalary} onChange={e=>setForm({...form,basicSalary:e.target.value})} required/></div>
              </div>
              <div className="form-group">
                <label className="form-label">Joining Date</label>
                <input className="form-control" type="date" value={form.joiningDate} onChange={e=>setForm({...form,joiningDate:e.target.value})}/>
              </div>
            </div>
            {form.basicSalary&&<div style={{background:'var(--primary-light)',borderRadius:10,padding:'12px 16px',fontSize:13}}>
              <div style={{fontWeight:600,color:'var(--primary)',marginBottom:6}}>Estimated Salary Breakdown</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                {[['Basic',form.basicSalary],['HRA (40%)',Math.round(form.basicSalary*0.4)],['DA (20%)',Math.round(form.basicSalary*0.2)]].map(([k,v])=>(
                  <div key={k} style={{background:'#fff',borderRadius:8,padding:'8px 12px'}}><div style={{fontSize:11,color:'var(--muted)'}}>{k}</div><div style={{fontWeight:700,fontSize:14}}>₹{Number(v).toLocaleString()}</div></div>))}
              </div>
              <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid var(--border)',fontSize:13,fontWeight:700,color:'#1e40af'}}>
                Gross: ₹{Math.round(Number(form.basicSalary)*1.6).toLocaleString()} / month
              </div>
            </div>}
          </div>}

          {/* ── Step 3: Contact ── */}
          {step===3&&<div className="fade-in">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-control" placeholder="e.g. 9876543210" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
            </div>
            <div className="form-group">
              <label className="form-label">Home Address</label>
              <textarea className="form-control" rows={3} placeholder="Full residential address…" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
            </div>
            {/* Review card */}
            <div style={{background:'var(--bg)',borderRadius:12,padding:16,border:'1px solid var(--border)',marginTop:4}}>
              <div style={{fontSize:12,fontWeight:700,color:'var(--faint)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Review Summary</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {[['Name',form.name],['Email',form.email],['Department',depts.find(d=>d.id==form.departmentId)?.name||'—'],['Designation',form.designation||'—'],['Salary',form.basicSalary?`₹${Number(form.basicSalary).toLocaleString()}`:'—'],['Joining',form.joiningDate||'—']].map(([k,v])=>(
                  <div key={k} style={{background:'var(--surface)',borderRadius:8,padding:'8px 12px',border:'1px solid var(--border)'}}>
                    <div style={{fontSize:10,color:'var(--faint)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:600,color:'var(--dark)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v||'—'}</div>
                  </div>))}
              </div>
            </div>
          </div>}
        </div>

        {/* Footer */}
        <div className="modal-ftr">
          <button className="btn btn-ghost" onClick={close}>Cancel</button>
          {step>1&&<button className="btn btn-outline" onClick={()=>setStep(s=>s-1)}><FiChevronLeft/>Back</button>}
          {step<3
            ?<button className="btn btn-primary" onClick={()=>setStep(s=>s+1)} disabled={step===1&&!form.name}>Next<FiChevronRight/></button>
            :<button className="btn btn-primary" onClick={save} disabled={loading||!form.name||!form.email||(!editId&&!form.basicSalary)}>{loading?'Saving…':<><FiCheck/>{editId?'Update Employee':'Create Employee'}</>}</button>}
        </div>
      </div>
    </div>}

    {/* ── Confirm Delete Modal ── */}
    {delTarget&&<ConfirmModal name={delTarget.name} onCancel={()=>setDelTarget(null)} onConfirm={()=>{deleteEmployee(delTarget.id).then(()=>{toast.success('Employee deleted');load();}).catch(()=>toast.error('Cannot delete'));setDelTarget(null);}}/>}
  </div>);
}
