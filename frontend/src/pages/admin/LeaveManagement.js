import React,{useEffect,useState}from'react';
import{getAllLeaves,actionOnLeave}from'../../services/leaveService';
import{toast}from'react-toastify';
import{FiCheck,FiX,FiEye,FiFileText,FiClock,FiCheckCircle,FiXCircle}from'react-icons/fi';

export default function LeaveManagement(){
  const[leaves,setLeaves]=useState([]);const[filter,setFilter]=useState('ALL');const[review,setReview]=useState(null);const[comment,setComment]=useState('');
  const load=()=>getAllLeaves().then(r=>setLeaves(r.data.data||[])).catch(()=>{});
  useEffect(()=>{load();},[]);
  const act=status=>{actionOnLeave(review.id,{status,adminComment:comment}).then(()=>{toast.success(`Leave ${status.toLowerCase()}!`);setReview(null);setComment('');load();}).catch(()=>toast.error('Error'));};
  const filtered=filter==='ALL'?leaves:leaves.filter(l=>l.status===filter);
  const days=(f,t)=>Math.ceil((new Date(t)-new Date(f))/(864e5))+1;
  const pending=leaves.filter(l=>l.status==='PENDING').length;

  const FILTERS=['ALL','PENDING','APPROVED','REJECTED'];
  const FILTER_COUNT={ALL:leaves.length,PENDING:leaves.filter(l=>l.status==='PENDING').length,APPROVED:leaves.filter(l=>l.status==='APPROVED').length,REJECTED:leaves.filter(l=>l.status==='REJECTED').length};

  return(<div className="fade-in">
    <div className="ph">
      <div><h2 className="pt">Leave Management</h2><p className="ps">{pending} pending approval</p></div>
      <div className="pa">
        {FILTERS.map(f=>(
          <button key={f} className={`btn btn-sm ${filter===f?'btn-primary':'btn-outline'}`} onClick={()=>setFilter(f)}>
            {f} <span style={{background:filter===f?'rgba(255,255,255,.25)':'var(--bl)',color:filter===f?'#fff':'var(--muted)',borderRadius:99,padding:'0 6px',fontSize:11,fontWeight:700,marginLeft:4}}>{FILTER_COUNT[f]}</span>
          </button>))}
      </div>
    </div>

    <div className="tbl-wrap"><table className="tbl">
      <thead><tr><th>Employee</th><th>Type</th><th>Duration</th><th>Days</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>{filtered.map(l=>(
        <tr key={l.id} className="fade-in">
          <td><div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:34,height:34,borderRadius:'50%',background:'var(--primary-light)',color:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,flexShrink:0}}>
              {l.employee?.user?.name?.charAt(0)}
            </div>
            <div><div style={{fontWeight:600,fontSize:13.5}}>{l.employee?.user?.name}</div><div style={{fontSize:12,color:'var(--muted)'}}>{l.employee?.empCode}</div></div>
          </div></td>
          <td><span className={`badge ${l.type==='SICK'?'badge-danger':l.type==='EARNED'?'badge-success':l.type==='UNPAID'?'badge-gray':'badge-info'}`}>{l.type}</span></td>
          <td style={{fontSize:13}}>{l.fromDate} <span style={{color:'var(--faint)'}}>→</span> {l.toDate}</td>
          <td><span className="badge badge-gray">{days(l.fromDate,l.toDate)}d</span></td>
          <td style={{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:13,color:'var(--muted)'}}>{l.reason}</td>
          <td><span className={`badge ${l.status==='PENDING'?'badge-warning':l.status==='APPROVED'?'badge-success':'badge-danger'}`} style={{display:'inline-flex',alignItems:'center',gap:4}}>
            {l.status==='PENDING'?<FiClock size={10}/>:l.status==='APPROVED'?<FiCheckCircle size={10}/>:<FiXCircle size={10}/>}{l.status}
          </span></td>
          <td>{l.status==='PENDING'
            ?<button className="btn btn-outline btn-sm" onClick={()=>{setReview(l);setComment('');}}><FiEye/>Review</button>
            :<span style={{fontSize:12,color:'var(--faint)',fontStyle:'italic'}}>{l.adminComment||'—'}</span>}</td>
        </tr>))}</tbody>
    </table>
    {filtered.length===0&&<div className="empty"><div className="empty-ic"><FiFileText/></div><h4>No {filter==='ALL'?'':''+filter.toLowerCase()} leaves</h4></div>}
    </div>

    {review&&<div className="modal-bg">
      <div className="modal modal-sm">
        <div className="modal-hdr">
          <div className="modal-hdr-left"><div className="modal-hdr-icon"><FiFileText/></div><h3>Review Leave Request</h3></div>
          <button className="modal-x" onClick={()=>setReview(null)}><FiX/></button>
        </div>
        <div className="modal-body">
          <div style={{background:'var(--bg)',borderRadius:12,padding:16,marginBottom:16,border:'1px solid var(--border)'}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
              <div style={{width:44,height:44,borderRadius:'50%',background:'var(--primary-light)',color:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:16}}>{review.employee?.user?.name?.charAt(0)}</div>
              <div><div style={{fontWeight:700,fontSize:15}}>{review.employee?.user?.name}</div><div style={{fontSize:12,color:'var(--muted)'}}>{review.employee?.empCode} · {review.employee?.departmentName}</div></div>
            </div>
            {[['Leave Type',review.type],['From',review.fromDate],['To',review.toDate],['Duration',`${days(review.fromDate,review.toDate)} days`]].map(([k,v])=>(
              <div key={k} className="ir"><span className="ik">{k}</span><span className="iv">{v}</span></div>))}
            <div style={{marginTop:10,paddingTop:10,borderTop:'1px solid var(--bl)'}}><div style={{fontSize:12,color:'var(--faint)',marginBottom:4}}>Reason</div><div style={{fontSize:13}}>{review.reason}</div></div>
          </div>
          <div className="form-group"><label className="form-label">Comment (optional)</label><textarea className="form-control" rows={3} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a note for the employee…" autoFocus/></div>
        </div>
        <div className="modal-ftr">
          <button className="btn btn-ghost" onClick={()=>setReview(null)}>Cancel</button>
          <button className="btn btn-sm" style={{background:'var(--danger-light)',color:'var(--danger)',border:'1.5px solid #fecaca',display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:8,fontWeight:500,cursor:'pointer'}} onClick={()=>act('REJECTED')}><FiX/>Reject</button>
          <button className="btn btn-primary" onClick={()=>act('APPROVED')}><FiCheck/>Approve</button>
        </div>
      </div>
    </div>}
  </div>);
}
