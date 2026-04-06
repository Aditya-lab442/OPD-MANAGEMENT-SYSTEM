import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/* ─── Helpers ─────────────────────────────────────── */
const fmtTime = (ts) => {
  if (!ts) return 'TBD';
  const [h, m] = ts.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};
const fmtDate = (ds) => new Date(ds).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const isCompleted = (date, time) => new Date(`${date}T${time}:00`) < new Date();

const avatarColors = ['#2563eb', '#0d9488', '#7c3aed', '#d97706', '#dc2626', '#0284c7'];
const initials = (name) => (name || 'P')[0].toUpperCase();

/* ─── Main component ──────────────────────────────── */
export default function DoctorDashboard() {
  const { user, token } = useAuth();
  const [appts, setAppts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]  = useState('All');
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/appointments/doctor/${user?.username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setAppts(await res.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    if (user) fetch_();
  }, [user, token]);

  const withStatus = appts.map(a => ({
    ...a,
    status: isCompleted(a.date, a.time) ? 'Completed' : 'Upcoming',
  }));

  const total     = withStatus.length;
  const completed = withStatus.filter(a => a.status === 'Completed').length;
  const upcoming  = withStatus.filter(a => a.status === 'Upcoming').length;
  const todayStr  = new Date().toISOString().slice(0, 10);
  const todayApts = withStatus.filter(a => a.date?.slice(0, 10) === todayStr);

  const filtered = filter === 'All' ? withStatus
                 : withStatus.filter(a => a.status === filter);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }} className="anim-fade-up">

      {/* ── Hero ──────────────────────────────────── */}
      <div className="hero-banner" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
        <div style={{ position:'relative', zIndex:1 }}>
          <p className="hero-greeting">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="2" strokeLinecap="round" style={{ display:'inline', marginRight:'6px', verticalAlign:'middle' }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {today}
          </p>
          <h1 className="hero-title">Dr. {user?.name || user?.username}</h1>
          <p className="hero-subtitle">Your patient queue and schedule overview.</p>
        </div>

        {/* Availability toggle */}
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ background:'rgba(255,255,255,.1)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,.15)', borderRadius:'var(--radius-xl)', padding:'12px 20px', display:'flex', alignItems:'center', gap:'14px' }}>
            <div>
              <div style={{ fontSize:'.72rem', fontWeight:700, color:'rgba(255,255,255,.55)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'2px' }}>Availability</div>
              <div style={{ fontSize:'.95rem', fontWeight:700, color: available ? '#34d399' : '#f87171' }}>
                {available ? 'Available' : 'Unavailable'}
              </div>
            </div>
            <button
              onClick={() => setAvailable(p => !p)}
              style={{
                width:'48px', height:'26px',
                borderRadius:'99px',
                background: available ? '#22c55e' : '#64748b',
                border:'none', position:'relative', cursor:'pointer',
                transition:'background .25s',
                flexShrink:0,
              }}
            >
              <span style={{
                position:'absolute', top:'3px',
                left: available ? '24px' : '3px',
                width:'20px', height:'20px',
                background:'#fff', borderRadius:'50%',
                transition:'left .25s',
                boxShadow:'0 1px 4px rgba(0,0,0,.2)',
                display:'block',
              }}/>
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────── */}
      <div className="grid grid-4">
        {[
          { label:"Today's Patients", value: todayApts.length, color:'#2563eb', bg:'rgba(37,99,235,.08)', accentGradient:'linear-gradient(90deg,#2563eb,#60a5fa)', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
          { label:'Total Booked',     value: total,            color:'#7c3aed', bg:'rgba(124,58,237,.08)',accentGradient:'linear-gradient(90deg,#7c3aed,#a78bfa)', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          { label:'Completed',        value: completed,         color:'#0d9488', bg:'rgba(13,148,136,.08)',accentGradient:'linear-gradient(90deg,#0d9488,#34d399)', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
          { label:'Upcoming',         value: upcoming,          color:'#d97706', bg:'rgba(217,119,6,.08)', accentGradient:'linear-gradient(90deg,#d97706,#fbbf24)', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--accent-gradient': s.accentGradient }}>
            <div className="stat-card-top">
              <div>
                <div className="stat-card-value">{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
              <div className="stat-card-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main 2-col layout ─────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'24px' }} className="doctor-2col">

        {/* Left — patient queue */}
        <div>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Patient Queue</div>
                <div className="card-subtitle">{filtered.length} appointments found</div>
              </div>
              <div className="tabs">
                {['All', 'Upcoming', 'Completed'].map(f => (
                  <button key={f} className={`tab-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div className="card-body no-pad">
              {loading ? (
                <div style={{ padding:'24px' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'16px', padding:'14px 0', borderBottom:'1px solid var(--slate-50)' }}>
                      <div className="skeleton skeleton-avatar" style={{ width:'44px', height:'44px' }}/>
                      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'8px' }}>
                        <div className="skeleton skeleton-text" style={{ width:'35%' }}/>
                        <div className="skeleton skeleton-text sm" style={{ width:'55%' }}/>
                      </div>
                      <div className="skeleton" style={{ width:'90px', height:'26px', borderRadius:'99px' }}/>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  </div>
                  <div className="empty-state-title">No appointments</div>
                  <div className="empty-state-text">There are no {filter.toLowerCase()} appointments in your queue.</div>
                </div>
              ) : (
                <div>
                  {filtered.map((a, i) => {
                    const done = a.status === 'Completed';
                    return (
                      <div key={a._id || i} className="queue-item" style={{ padding:'14px 24px', display:'flex', alignItems:'center', gap:'16px', borderBottom:'1px solid var(--slate-50)', transition:'background .15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {/* Time */}
                        <div style={{ textAlign:'right', minWidth:'68px', flexShrink:0 }}>
                          <div style={{ fontSize:'.875rem', fontWeight:700, color: done ? 'var(--slate-400)' : 'var(--slate-700)' }}>{fmtTime(a.time)}</div>
                          <div style={{ fontSize:'.72rem', fontWeight:600, color:'var(--slate-300)', marginTop:'2px' }}>{fmtDate(a.date)}</div>
                        </div>

                        {/* Dot */}
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0', alignSelf:'stretch', paddingTop:'4px', paddingBottom:'4px' }}>
                          <div style={{ width:'12px', height:'12px', borderRadius:'50%', background: done ? 'var(--success-500)' : 'var(--brand-500)', border:`2px solid ${done ? 'var(--success-500)' : 'var(--brand-500)'}`, flexShrink:0, boxShadow: done ? 'none' : '0 0 0 4px rgba(37,99,235,.15)' }}/>
                          {i < filtered.length - 1 && <div style={{ width:'2px', flex:1, background:'var(--slate-100)', marginTop:'4px' }}/>}
                        </div>

                        {/* Avatar */}
                        <div style={{ width:'44px', height:'44px', borderRadius:'var(--radius-md)', background: avatarColors[i % avatarColors.length], color:'#fff', fontSize:'1rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          {initials(a.patientName)}
                        </div>

                        {/* Info */}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:'.9rem', fontWeight:700, color:'var(--slate-800)', marginBottom:'3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.patientName}</div>
                          <div style={{ fontSize:'.78rem', fontWeight:500, color:'var(--slate-400)', display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                            {a.problem}
                            {a.specialty && <><span>·</span>{a.specialty}</>}
                          </div>
                        </div>

                        {/* Status */}
                        <span className={done ? 'badge badge-success' : 'badge badge-brand'}>{a.status}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>

          {/* Doctor profile */}
          <div className="card" style={{ background:'linear-gradient(160deg, var(--slate-900), var(--brand-900))', border:'none', overflow:'hidden', position:'relative' }}>
            <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,.25), transparent)', pointerEvents:'none' }}/>
            <div className="card-body" style={{ textAlign:'center', position:'relative', zIndex:1 }}>
              <div style={{ width:'64px', height:'64px', borderRadius:'var(--radius-lg)', background:'linear-gradient(135deg, var(--brand-500), #0d9488)', color:'#fff', fontSize:'1.3rem', fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', boxShadow:'0 6px 20px rgba(37,99,235,.4)' }}>
                {(user?.username || 'D')[0].toUpperCase()}
              </div>
              <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#fff', marginBottom:'4px' }}>Dr. {user?.name || user?.username}</div>
              <div style={{ fontSize:'.78rem', fontWeight:600, color:'rgba(255,255,255,.55)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'16px' }}>General Physician</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background: available ? 'rgba(34,197,94,.15)' : 'rgba(100,116,139,.15)', borderRadius:'99px', padding:'5px 14px', border:`1px solid ${available ? 'rgba(34,197,94,.3)' : 'rgba(100,116,139,.2)'}` }}>
                <div style={{ width:'7px', height:'7px', borderRadius:'50%', background: available ? '#22c55e' : 'var(--slate-400)', animation: available ? 'pulse 2s ease-in-out infinite' : 'none' }}/>
                <span style={{ fontSize:'.75rem', fontWeight:700, color: available ? '#4ade80' : 'var(--slate-400)' }}>{available ? 'Available for Patients' : 'Currently Unavailable'}</span>
              </div>
            </div>
          </div>

          {/* Performance summary */}
          <div className="card">
            <div className="card-header"><div className="card-title">Today's Summary</div></div>
            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {[
                { label:"Patients Seen",     val: completed,          color:'var(--success-600)', bg:'var(--success-50)' },
                { label:"Pending Visits",    val: upcoming,           color:'var(--warning-600)', bg:'var(--warning-50)' },
                { label:"Total Scheduled",   val: total,              color:'var(--brand-600)',   bg:'var(--brand-50)' },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background: item.bg, borderRadius:'var(--radius-md)', border:`1px solid ${item.bg}` }}>
                  <span style={{ fontSize:'.875rem', fontWeight:600, color:'var(--slate-600)' }}>{item.label}</span>
                  <span style={{ fontSize:'1.1rem', fontWeight:900, color: item.color }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card">
            <div className="card-header"><div className="card-title">Quick Actions</div></div>
            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {[
                { label:'Write Prescription', color:'#2563eb', bg:'rgba(37,99,235,.08)', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 2 4 4-14 14-4-4 14-14z"/><path d="m14.5 5.5 4 4"/></svg> },
                { label:'View OPD Records',   color:'#0d9488', bg:'rgba(13,148,136,.08)', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
                { label:'Update Schedule',    color:'#d97706', bg:'rgba(217,119,6,.08)',  icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
              ].map((qa, idx) => (
                <button key={idx} className="quick-action">
                  <div className="quick-action-icon" style={{ background: qa.bg, color: qa.color }}>{qa.icon}</div>
                  {qa.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft:'auto', color:'var(--slate-300)' }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .doctor-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}