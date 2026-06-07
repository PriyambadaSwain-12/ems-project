import React,{useEffect,useState}from'react';
import{getMyLeaves,applyLeave}from'../../services/leaveService';
import{toast}from'react-toastify';
import{FiPlus,FiCalendar,FiX,FiCheck,FiClock,FiCheckCircle,FiXCircle}from'react-icons/fi';

const blank={type:'CASUAL',fromDate:'',toDate:'',reason:''};
const TYPE_COLORS={CASUAL:'badge-info',SICK:'badge-danger',EARNED:'badge-success',UNPAID:'badge-gray'};
const STATUS_COLORS={PENDING:'badge-warning',APPROVED:'badge-success',REJECTED:'badge-danger'};
const STATUS_ICONS={PENDING:<FiClock size={11}/>,APPROVED:<FiCheckCircle size={11}/>,REJECTED:<FiXCircle size={11}/>};

export default function MyLeaves(){
  const[leaves,setLeaves]=useState([]);const[modal,setModal]=useState(false);const[form,setForm]=useState(blank);const[loading,setLoading]=useState(false);
  const load=()=>getMyLeaves().then(r=>setLeaves(r.data.data||[])).catch(()=>{});
  useEffect(()=>{load();},[]);
  const save=e=>{e.preventDefault();setLoading(true);applyLeave(form).then(()=>{toast.success('Leave request submitted!');setModal(false);setForm(blank);load();}).catch(err=>toast.error(err.response?.data?.message||'Error')).finally(()=>setLoading(false));};
  const days=(f,t)=>f&&t?Math.ceil((new Date(t)-new Date(f))/(864e5))+1:0;
  const pending=leaves.filter(l=>l.status==='PENDING').length;
  const approved=leaves.filter(l=>l.status==='APPROVED').length;
  const rejected=leaves.filter(l=>l.status==='REJECTED').length;

  return(<div className="fade-in">
    <div className="ph">
      <div><h2 className="pt">My Leaves</h2><p className="ps">{pending} pending · {approved} approved</p></div>
      <button className="btn btn-primary" onClick={()=>{setForm(blank);setModal(true);}}><FiPlus/>Apply for Leave</button>
    </div>

    {/* Stats */}
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
      {[{l:'Pending',v:pending,c:'#f59e0b',bg:'#fef3c7',i:<FiClock/>},
        {l:'Approved',v:approved,c:'#10b981',bg:'#d1fae5',i:<FiCheckCircle/>},
        {l:'Rejected',v:rejected,c:'#ef4444',bg:'#fee2e2',i:<FiXCircle/>}].map(s=>(
        <div key={s.l} className="card" style={{padding:20,borderTop:`3px solid ${s.c}`,transition:'transform .2s'}}
          onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
          onMouseLeave={e=>e.currentTarget.style.transform='none'}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><div style={{fontSize:28,fontWeight:800,color:s.c,lineHeight:1}}>{s.v}</div><div style={{fontSize:13,color:'var(--muted)',marginTop:4}}>{s.l} Requests</div></div>
            <div style={{width:44,height:44,background:s.bg,color:s.c,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{s.i}</div>
          </div>
        </div>))}
    </div>

    {/* Table */}
    <div className="tbl-wrap"><table className="tbl">
      <thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Admin Comment</th></tr></thead>
      <tbody>{leaves.map(l=>(
        <tr key={l.id} className="fade-in">
          <td><span className={`badge ${TYPE_COLORS[l.type]||'badge-gray'}`}>{l.type}</span></td>
          <td style={{fontSize:13}}>{l.fromDate}</td><td style={{fontSize:13}}>{l.toDate}</td>
          <td><span className="badge badge-gray">{days(l.fromDate,l.toDate)}d</span></td>
          <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:13,color:'var(--muted)'}}>{l.reason}</td>
          <td><span className={`badge ${STATUS_COLORS[l.status]}`} style={{display:'inline-flex',alignItems:'center',gap:4}}>{STATUS_ICONS[l.status]}{l.status}</span></td>
          <td style={{fontSize:13,color:'var(--muted)'}}>{l.adminComment||'—'}</td>
        </tr>))}
      </tbody>
    </table>
    {leaves.length===0&&<div className="empty"><div className="empty-ic"><FiCalendar/></div><h4>No leave requests</h4><p>Apply for your first leave using the button above</p></div>}
    </div>

    {/* Apply Modal */}
    {modal&&<div className="modal-bg" onClick={e=>e.target.className==='modal-bg'&&setModal(false)}>
      <div className="modal modal-sm">
        <div className="modal-hdr">
          <div className="modal-hdr-left"><div className="modal-hdr-icon"><FiCalendar/></div><h3>Apply for Leave</h3></div>
          <button className="modal-x" onClick={()=>setModal(false)}><FiX/></button>
        </div>
        <form onSubmit={save}><div className="modal-body">
          <div className="form-group"><label className="form-label">Leave Type *</label>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {[['CASUAL','Casual'],['SICK','Sick'],['EARNED','Earned'],['UNPAID','Unpaid']].map(([v,l])=>(
                <div key={v} onClick={()=>setForm({...form,type:v})}
                  style={{padding:'10px 14px',borderRadius:10,border:`2px solid ${form.type===v?'var(--primary)':'var(--border)'}`,background:form.type===v?'var(--primary-light)':'var(--surface)',cursor:'pointer',fontSize:13,fontWeight:form.type===v?600:400,color:form.type===v?'var(--primary)':'var(--text)',transition:'all .15s',display:'flex',alignItems:'center',gap:6}}>
                  {form.type===v&&<FiCheck size={13}/>}{l}
                </div>))}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">From *</label><input type="date" className="form-control" value={form.fromDate} onChange={e=>setForm({...form,fromDate:e.target.value})} required min={new Date().toISOString().split('T')[0]}/></div>
            <div className="form-group"><label className="form-label">To *</label><input type="date" className="form-control" value={form.toDate} onChange={e=>setForm({...form,toDate:e.target.value})} required min={form.fromDate}/></div>
          </div>
          {form.fromDate&&form.toDate&&days(form.fromDate,form.toDate)>0&&
            <div style={{background:'var(--primary-light)',color:'var(--primary)',borderRadius:10,padding:'10px 14px',fontSize:13,fontWeight:600,marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
              <FiCalendar size={14}/>{days(form.fromDate,form.toDate)} day{days(form.fromDate,form.toDate)!==1?'s':''} requested
            </div>}
          <div className="form-group"><label className="form-label">Reason *</label><textarea className="form-control" rows={3} value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} required placeholder="Briefly explain the reason for your leave request…"/></div>
        </div>
        <div className="modal-ftr"><button type="button" className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={loading||!form.reason}>{loading?'Submitting…':<><FiCheck/>Submit Request</>}</button></div>
        </form>
      </div>
    </div>}
  </div>);
}
