import React,{useEffect,useState}from'react';
import{getAllDepartments,createDepartment,updateDepartment,deleteDepartment}from'../../services/departmentService';
import{getAllEmployees}from'../../services/employeeService';
import{toast}from'react-toastify';
import{FiPlus,FiEdit2,FiTrash2,FiBriefcase,FiX,FiCheck,FiUsers}from'react-icons/fi';

const COLORS=['#6366f1','#10b981','#f59e0b','#3b82f6','#ef4444','#8b5cf6','#ec4899','#14b8a6'];
const BG=['#eef2ff','#d1fae5','#fef3c7','#dbeafe','#fee2e2','#ede9fe','#fce7f3','#ccfbf1'];

export default function Departments(){
  const[depts,setDepts]=useState([]);const[emps,setEmps]=useState([]);
  const[modal,setModal]=useState(false);const[form,setForm]=useState({name:'',description:''});
  const[editId,setEditId]=useState(null);const[delTarget,setDelTarget]=useState(null);

  const load=()=>{
    getAllDepartments().then(r=>setDepts(r.data.data||[])).catch(()=>{});
    getAllEmployees().then(r=>setEmps(r.data.data||[])).catch(()=>{});
  };
  useEffect(()=>{load();},[]);

  const save=e=>{e.preventDefault();
    const p=editId?updateDepartment(editId,form):createDepartment(form);
    p.then(()=>{toast.success(editId?'Department updated!':'Department created!');setModal(false);load();})
    .catch(err=>toast.error(err.response?.data?.message||'Error'));};

  return(<div className="fade-in">
    <div className="ph">
      <div><h2 className="pt">Departments</h2><p className="ps">{depts.length} departments · {emps.length} total employees</p></div>
      <button className="btn btn-primary" onClick={()=>{setForm({name:'',description:''});setEditId(null);setModal(true);}}><FiPlus/>New Department</button>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:18}}>
      {depts.map((d,i)=>{
        const cnt=emps.filter(e=>e.departmentName===d.name).length;
        const c=COLORS[i%COLORS.length];const bg=BG[i%BG.length];
        return(
        <div key={d.id} className="card" style={{padding:0,overflow:'hidden',transition:'transform .2s,box-shadow .2s',cursor:'default'}}
          onMouseEnter={e=>e.currentTarget.style.cssText+=';transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.1)'}
          onMouseLeave={e=>e.currentTarget.style.cssText+=';transform:none;box-shadow:var(--sh)'}>
          {/* Color top bar */}
          <div style={{height:4,background:c}}/>
          <div style={{padding:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
              <div style={{width:44,height:44,background:bg,color:c,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}><FiBriefcase/></div>
              <div style={{display:'flex',gap:6}}>
                <button className="btn btn-outline btn-sm" onClick={()=>{setForm({name:d.name,description:d.description||''});setEditId(d.id);setModal(true);}}><FiEdit2/></button>
                <button className="btn btn-sm" style={{background:'var(--danger-light)',color:'var(--danger)',border:'1.5px solid #fecaca'}} onClick={()=>setDelTarget(d)}><FiTrash2/></button>
              </div>
            </div>
            <h3 style={{fontSize:16,fontWeight:700,color:'var(--dark)',marginBottom:4}}>{d.name}</h3>
            <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.5,minHeight:36}}>{d.description||'No description provided'}</p>
            <div style={{marginTop:14,paddingTop:12,borderTop:'1px solid var(--bl)',display:'flex',alignItems:'center',gap:6}}>
              <div style={{background:bg,color:c,borderRadius:6,padding:'3px 10px',fontSize:12,fontWeight:700,display:'flex',alignItems:'center',gap:5}}><FiUsers size={12}/>{cnt}</div>
              <span style={{fontSize:12,color:'var(--muted)'}}>employee{cnt!==1?'s':''}</span>
            </div>
          </div>
        </div>);})}
      {depts.length===0&&<div className="card" style={{gridColumn:'1/-1'}}><div className="empty"><div className="empty-ic"><FiBriefcase/></div><h4>No departments yet</h4><p>Create your first department</p></div></div>}
    </div>

    {modal&&<div className="modal-bg" onClick={e=>e.target.className==='modal-bg'&&setModal(false)}>
      <div className="modal modal-sm">
        <div className="modal-hdr">
          <div className="modal-hdr-left"><div className="modal-hdr-icon"><FiBriefcase/></div><h3>{editId?'Edit':'New'} Department</h3></div>
          <button className="modal-x" onClick={()=>setModal(false)}><FiX/></button>
        </div>
        <form onSubmit={save}><div className="modal-body">
          <div className="form-group"><label className="form-label">Department Name *</label><input className="form-control" placeholder="e.g. Human Resources" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required autoFocus/></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" rows={3} placeholder="Brief description of this department's function…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
        </div>
        <div className="modal-ftr">
          <button type="button" className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
          <button type="submit" className="btn btn-primary"><FiCheck/>{editId?'Save Changes':'Create'}</button>
        </div></form>
      </div>
    </div>}

    {delTarget&&<div className="modal-bg">
      <div className="modal modal-sm modal-confirm">
        <div className="modal-body">
          <div className="modal-confirm-icon danger"><FiTrash2/></div>
          <h4>Delete Department?</h4>
          <p>Delete <strong>{delTarget.name}</strong>? Employees in this department will be unassigned.</p>
        </div>
        <div className="modal-ftr" style={{justifyContent:'center',gap:12}}>
          <button className="btn btn-outline" onClick={()=>setDelTarget(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={()=>{deleteDepartment(delTarget.id).then(()=>{toast.success('Deleted');load();}).catch(()=>toast.error('Cannot delete — employees assigned'));setDelTarget(null);}}><FiTrash2/>Delete</button>
        </div>
      </div>
    </div>}
  </div>);
}
