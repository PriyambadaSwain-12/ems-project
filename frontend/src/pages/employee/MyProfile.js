import React,{useEffect,useState,useRef}from'react';
import{getMyProfile,updateMyProfile}from'../../services/employeeService';
import{toast}from'react-toastify';
import{FiEdit2,FiSave,FiX,FiCamera,FiUser,FiPhone,FiMapPin,FiMail,FiBriefcase,FiCalendar,FiCheck}from'react-icons/fi';

export default function MyProfile(){
  const[profile,setProfile]=useState(null);const[editing,setEditing]=useState(false);const[form,setForm]=useState({});const[uploading,setUploading]=useState(false);const[saving,setSaving]=useState(false);
  const fileRef=useRef();
  const load=()=>getMyProfile().then(r=>{setProfile(r.data.data);setForm(r.data.data);}).catch(()=>{});
  useEffect(()=>{load();},[]);

  const save=()=>{setSaving(true);updateMyProfile({phone:form.phone,address:form.address}).then(()=>{toast.success('Profile updated!');setEditing(false);load();}).catch(()=>toast.error('Error')).finally(()=>setSaving(false));};

  const handlePhoto=e=>{const file=e.target.files[0];if(!file)return;if(file.size>2*1024*1024){toast.error('Max 2MB');return;}setUploading(true);const r=new FileReader();r.onload=ev=>{updateMyProfile({profilePhoto:ev.target.result}).then(()=>{toast.success('Photo updated!');load();}).catch(()=>toast.error('Error')).finally(()=>setUploading(false));};r.readAsDataURL(file);};

  if(!profile)return<div className="loader">Loading…</div>;

  const ini=profile.name?.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();

  return(<div style={{maxWidth:800}} className="fade-in">
    {/* Profile Hero Card */}
    <div className="card" style={{marginBottom:20,padding:0,overflow:'hidden'}}>
      {/* Gradient banner */}
      <div style={{height:100,background:'linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#2563eb 100%)',position:'relative'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle at 20% 50%,rgba(255,255,255,.1) 0%,transparent 60%)'}}/>
      </div>

      <div style={{padding:'0 28px 28px'}}>
        {/* Avatar overlapping banner */}
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginTop:-44,marginBottom:20}}>
          <div style={{position:'relative'}}>
            {profile.profilePhoto
              ?<img src={profile.profilePhoto} alt="" style={{width:88,height:88,borderRadius:'50%',objectFit:'cover',border:'4px solid #fff',boxShadow:'0 4px 16px rgba(0,0,0,.15)'}}/>
              :<div style={{width:88,height:88,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:800,color:'#fff',border:'4px solid #fff',boxShadow:'0 4px 16px rgba(0,0,0,.15)'}}>
                {ini}
              </div>}
            <button onClick={()=>fileRef.current.click()} disabled={uploading}
              style={{position:'absolute',bottom:2,right:2,width:28,height:28,borderRadius:'50%',background:'var(--primary)',color:'#fff',border:'2px solid #fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:13,boxShadow:'0 2px 8px rgba(99,102,241,.4)'}}>
              {uploading?'…':<FiCamera size={12}/>}
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handlePhoto}/>
          </div>

          <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
            {profile.profilePhoto&&<button className="btn btn-ghost btn-sm" style={{fontSize:12,color:'var(--danger)'}} onClick={()=>{updateMyProfile({profilePhoto:''}).then(()=>{toast.success('Photo removed');load();});}}>Remove</button>}
            <button className={`btn btn-sm ${editing?'btn-ghost':'btn-outline'}`} onClick={()=>setEditing(!editing)}>
              {editing?<><FiX/>Cancel</>:<><FiEdit2/>Edit Profile</>}
            </button>
          </div>
        </div>

        <h2 style={{fontSize:22,fontWeight:800,color:'var(--dark)'}}>{profile.name}</h2>
        <p style={{color:'var(--muted)',fontSize:14,marginTop:3,display:'flex',alignItems:'center',gap:8}}>
          <span style={{background:'var(--primary-light)',color:'var(--primary)',padding:'2px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{profile.empCode}</span>
          <span>{profile.designation||'Employee'}</span>
          {profile.departmentName&&<><span style={{color:'var(--border)'}}>·</span><span>{profile.departmentName}</span></>}
        </p>
      </div>
    </div>

    <div className="d2">
      {/* Info card */}
      <div className="card">
        <div className="sec-title">Work Information</div>
        {[{i:<FiMail size={15}/>,l:'Email',v:profile.email},{i:<FiBriefcase size={15}/>,l:'Department',v:profile.departmentName},{i:<FiBriefcase size={15}/>,l:'Designation',v:profile.designation},{i:<FiCalendar size={15}/>,l:'Joining Date',v:profile.joiningDate},{i:<FiUser size={15}/>,l:'Gender',v:profile.gender},{i:<FiCalendar size={15}/>,l:'Date of Birth',v:profile.dateOfBirth}].map(({i,l,v})=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid var(--bl)'}}>
            <div style={{width:32,height:32,borderRadius:8,background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--muted)',flexShrink:0}}>{i}</div>
            <div style={{flex:1}}><div style={{fontSize:11,color:'var(--faint)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:1}}>{l}</div><div style={{fontSize:14,fontWeight:600}}>{v||'—'}</div></div>
          </div>))}
      </div>

      {/* Contact card */}
      <div className="card">
        <div className="sec-title">Contact Details {editing&&<span style={{fontSize:11,color:'var(--primary)',fontWeight:500,marginLeft:6,textTransform:'none',letterSpacing:'normal'}}>editing</span>}</div>

        <div className="form-group">
          <label className="form-label"><FiPhone size={11} style={{marginRight:4}}/>Phone</label>
          <input className="form-control" value={form.phone||''} onChange={e=>setForm({...form,phone:e.target.value})} disabled={!editing} placeholder={editing?'Enter phone number':'Not provided'}/>
        </div>
        <div className="form-group">
          <label className="form-label"><FiMapPin size={11} style={{marginRight:4}}/>Home Address</label>
          <textarea className="form-control" rows={4} value={form.address||''} onChange={e=>setForm({...form,address:e.target.value})} disabled={!editing} placeholder={editing?'Enter full address':'Not provided'}/>
        </div>

        {editing&&<button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={save} disabled={saving}>
          {saving?'Saving…':<><FiCheck/>Save Changes</>}
        </button>}

        {!editing&&<div style={{background:'var(--bg)',borderRadius:10,padding:'12px 14px',marginTop:8,fontSize:13,color:'var(--muted)',textAlign:'center'}}>
          Click <strong>Edit Profile</strong> to update your contact information
        </div>}
      </div>
    </div>
  </div>);
}
