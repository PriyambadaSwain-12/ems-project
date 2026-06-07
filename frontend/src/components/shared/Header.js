import React from'react';import{useAuth}from'../../context/AuthContext';
const css=`.topbar{background:#fff;border-bottom:1px solid var(--border);padding:0 28px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}.tb-title{font-size:18px;font-weight:700;color:var(--dark);}.tb-sub{font-size:12.5px;color:var(--muted);margin-top:1px;}.tb-right{display:flex;align-items:center;gap:14px;}.tb-date{font-size:12.5px;color:var(--muted);}.tb-av{width:34px;height:34px;background:#6366f1;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;}`;
export default function Header({title,subtitle}){
  const{user}=useAuth();
  return(<><style>{css}</style>
    <header className="topbar">
      <div><h2 className="tb-title">{title}</h2>{subtitle&&<p className="tb-sub">{subtitle}</p>}</div>
      <div className="tb-right"><span className="tb-date">{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</span><div className="tb-av">{user?.name?.charAt(0)}</div></div>
    </header></>);
}
