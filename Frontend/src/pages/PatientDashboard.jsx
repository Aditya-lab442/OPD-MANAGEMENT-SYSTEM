import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/* ─── Helpers ─────────────────────────────────────── */
const fmtDate = (ds) => {
  const d = new Date(ds);
  return { day: d.getDate(), month: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear() };
};
const fmtTime = (ts) => {
  if (!ts) return 'TBD';
  const [h, m] = ts.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

/* ─── Modal ───────────────────────────────────────── */
const BookingModal = ({ user, token, onClose, onBooked }) => {
  const [form, setForm] = useState({ patientName: user?.name || user?.username || '', doctorName: '', date: '', time: '', problem: '' });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/appointments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) { onBooked(); onClose(); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Book Consultation</div>
            <div style={{ fontSize:'.8rem', color:'var(--slate-400)', marginTop:'2px', fontWeight:500 }}>Fill in the details to schedule your visit</div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ color:'var(--slate-400)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="modal-body">
          <form id="bookForm" onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              <div className="form-group">
                <label className="form-label">Patient Name</label>
                <input className="form-input" value={form.patientName} disabled style={{ opacity:.7 }}/>
              </div>
              <div className="form-group">
                <label className="form-label">Doctor Name</label>
                <input className="form-input" placeholder="e.g. Dr. Smith" required value={form.doctorName} onChange={set('doctorName')}/>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" required value={form.date} onChange={set('date')}/>
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input type="time" className="form-input" required value={form.time} onChange={set('time')}/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Symptoms / Problem</label>
              <textarea className="form-input" rows="3" placeholder="Describe your symptoms…" required style={{ resize:'vertical' }} value={form.problem} onChange={set('problem')}/>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" form="bookForm" className="btn btn-primary" disabled={loading}>
            {loading ? 'Booking…' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main component ──────────────────────────────── */
export default function PatientDashboard() {
  const { user, token } = useAuth();
  const [apts, setApts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [showModal, setShowModal] = useState(false);

  const fetchApts = async () => {
    setLoading(true);
    try {
      const name = user?.name || user?.username;
      const res = await fetch(`http://localhost:3001/appointments/${name}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        const today = new Date(); today.setHours(0, 0, 0, 0);
        setApts(data.map(a => {
          const d = new Date(a.date); d.setHours(0, 0, 0, 0);
          return { ...a, id: a._id, status: d >= today ? 'upcoming' : 'completed' };
        }));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (user) fetchApts(); }, [user, token]);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      const res = await fetch(`http://localhost:3001/appointments/delete/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) fetchApts();
    } catch (e) { console.error(e); }
  };

  const upcoming  = apts.filter(a => a.status === 'upcoming');
  const completed = apts.filter(a => a.status === 'completed');
  const displayed = tab === 'upcoming' ? upcoming : completed;

  const initials = (name) => (name || 'P').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarBg = ['#2563eb', '#0d9488', '#7c3aed', '#d97706', '#dc2626'];
  const nextApt  = upcoming[0];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }} className="anim-fade-up">

      {showModal && <BookingModal user={user} token={token} onClose={() => setShowModal(false)} onBooked={fetchApts}/>}

      {/* ── Hero ──────────────────────────────────── */}
      <div className="hero-banner" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
        <div style={{ position:'relative', zIndex:1 }}>
          <p className="hero-greeting">Welcome back 🌿</p>
          <h1 className="hero-title">{user?.name || user?.username || 'Patient'}</h1>
          <p className="hero-subtitle">Your health journey, managed with care.</p>
        </div>
        <button className="btn btn-lg" onClick={() => setShowModal(true)}
          style={{ position:'relative', zIndex:1, background:'rgba(255,255,255,.15)', color:'#fff', border:'1.5px solid rgba(255,255,255,.25)', backdropFilter:'blur(8px)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
          Book Consultation
        </button>
      </div>

      {/* ── Stats row ─────────────────────────────── */}
      <div className="grid grid-4">
        {[
          { label:'Upcoming',  value: upcoming.length,  color:'#2563eb', bg:'rgba(37,99,235,.08)',  accentGradient:'linear-gradient(90deg,#2563eb,#60a5fa)',  icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          { label:'Completed', value: completed.length, color:'#0d9488', bg:'rgba(13,148,136,.08)', accentGradient:'linear-gradient(90deg,#0d9488,#34d399)', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
          { label:'Blood Type',value: 'O+',             color:'#dc2626', bg:'rgba(220,38,38,.08)',  accentGradient:'linear-gradient(90deg,#dc2626,#f87171)',  icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> },
          { label:'Patient ID', value:'PT-029',         color:'#7c3aed', bg:'rgba(124,58,237,.08)', accentGradient:'linear-gradient(90deg,#7c3aed,#a78bfa)', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M6 21a6 6 0 0 1 12 0"/></svg> },
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

      {/* ── Main 2-col ────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'24px' }} className="patient-2col">

        {/* Left — appointments */}
        <div style={{ display:'flex', flexDirection:'column', gap:'24px', minWidth:0 }}>

          {/* Next appointment spotlight */}
          {nextApt && (
            <div className="card" style={{ background:'linear-gradient(135deg, #f0f9ff, #e0f2fe)', border:'1.5px solid #bae6fd', overflow:'hidden', position:'relative' }}>
              <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'140px', height:'140px', borderRadius:'50%', background:'radial-gradient(circle, rgba(37,99,235,.15), transparent)', pointerEvents:'none' }}/>
              <div className="card-body" style={{ display:'flex', alignItems:'center', gap:'24px', flexWrap:'wrap' }}>
                <div style={{ background:'#dbeafe', border:'1px solid #93c5fd', borderRadius:'var(--radius-lg)', padding:'16px 20px', textAlign:'center', flexShrink:0 }}>
                  <div style={{ fontSize:'.65rem', fontWeight:700, color:'var(--brand-600)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'4px' }}>{fmtDate(nextApt.date).month}</div>
                  <div style={{ fontSize:'2rem', fontWeight:900, color:'var(--slate-900)', lineHeight:1 }}>{fmtDate(nextApt.date).day}</div>
                  <div style={{ fontSize:'.65rem', fontWeight:700, color:'var(--slate-400)', marginTop:'4px' }}>{fmtDate(nextApt.date).year}</div>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'.72rem', fontWeight:700, color:'var(--brand-600)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'6px' }}>Next Appointment</div>
                  <div style={{ fontSize:'1.25rem', fontWeight:800, color:'var(--slate-900)', marginBottom:'6px' }}>Dr. {nextApt.doctorName}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap' }}>
                    <span style={{ fontSize:'.875rem', fontWeight:600, color:'var(--slate-500)', display:'flex', alignItems:'center', gap:'6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {fmtTime(nextApt.time)}
                    </span>
                    <span style={{ fontSize:'.875rem', fontWeight:600, color:'var(--slate-500)', display:'flex', alignItems:'center', gap:'6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      {nextApt.problem}
                    </span>
                  </div>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => cancel(nextApt.id)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Appointments list */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">My Appointments</div>
                <div className="card-subtitle">{apts.length} total visits on record</div>
              </div>
              <div className="tabs">
                <button className={`tab-btn${tab === 'upcoming' ? ' active' : ''}`} onClick={() => setTab('upcoming')}>
                  Upcoming {upcoming.length > 0 && <span style={{ background:'var(--brand-600)', color:'#fff', fontSize:'.65rem', padding:'1px 7px', borderRadius:'99px', fontWeight:700 }}>{upcoming.length}</span>}
                </button>
                <button className={`tab-btn${tab === 'past' ? ' active' : ''}`} onClick={() => setTab('past')}>Past</button>
              </div>
            </div>
            <div className="card-body no-pad">
              {loading ? (
                <div style={{ padding:'32px 24px', display:'flex', flexDirection:'column', gap:'16px' }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{ display:'flex', gap:'14px', alignItems:'center' }}>
                      <div className="skeleton" style={{ width:'56px', height:'60px', borderRadius:'var(--radius-md)' }}/>
                      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'8px' }}>
                        <div className="skeleton skeleton-text" style={{ width:'40%' }}/>
                        <div className="skeleton skeleton-text sm" style={{ width:'60%' }}/>
                      </div>
                      <div className="skeleton" style={{ width:'80px', height:'26px', borderRadius:'99px' }}/>
                    </div>
                  ))}
                </div>
              ) : displayed.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="10" y1="16" x2="10" y2="16"/></svg>
                  </div>
                  <div className="empty-state-title">No {tab} appointments</div>
                  <div className="empty-state-text">You don't have any {tab} visits scheduled.</div>
                  {tab === 'upcoming' && (
                    <button className="btn btn-primary" style={{ marginTop:'20px' }} onClick={() => setShowModal(true)}>Book Now</button>
                  )}
                </div>
              ) : (
                displayed.map((a, i) => {
                  const d = fmtDate(a.date);
                  return (
                    <div key={a.id || i} className="appt-card">
                      <div className="appt-date-box">
                        <div className="appt-date-day">{d.day}</div>
                        <div className="appt-date-month">{d.month}</div>
                      </div>
                      <div className="appt-info">
                        <div className="appt-doctor">Dr. {a.doctorName}</div>
                        <div className="appt-meta">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {fmtTime(a.time)}
                          <span>·</span>
                          {a.problem}
                        </div>
                      </div>
                      {tab === 'upcoming' ? (
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px', flexShrink:0 }}>
                          <span className="badge badge-brand">Scheduled</span>
                          <button className="btn btn-danger btn-sm" onClick={() => cancel(a.id)}>Cancel</button>
                        </div>
                      ) : (
                        <span className="badge badge-success">Completed</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right — profile + quick access */}
        <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>

          {/* Profile card */}
          <div className="card" style={{ background:'linear-gradient(160deg, var(--slate-900), var(--brand-900))', border:'none', overflow:'hidden', position:'relative' }}>
            <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'160px', height:'160px', borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,.2), transparent)', pointerEvents:'none' }}/>
            <div className="card-body" style={{ textAlign:'center', position:'relative', zIndex:1 }}>
              <div style={{ width:'72px', height:'72px', borderRadius:'var(--radius-xl)', background:'linear-gradient(135deg, var(--brand-600), #7c3aed)', color:'#fff', fontSize:'1.5rem', fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 8px 24px rgba(37,99,235,.4)' }}>
                {initials(user?.name)}
              </div>
              <div style={{ fontSize:'1.15rem', fontWeight:800, color:'#fff', marginBottom:'4px' }}>{user?.name || user?.username}</div>
              <div style={{ display:'inline-block', background:'rgba(255,255,255,.1)', color:'rgba(255,255,255,.7)', fontSize:'.72rem', fontWeight:700, padding:'4px 12px', borderRadius:'99px', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'20px' }}>
                Active Member
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                {[
                  { label:'Blood Type', val:'O+' },
                  { label:'Total Visits', val: apts.length },
                ].map((item, i) => (
                  <div key={i} style={{ background:'rgba(255,255,255,.07)', borderRadius:'var(--radius-md)', padding:'12px', border:'1px solid rgba(255,255,255,.08)' }}>
                    <div style={{ fontSize:'.65rem', fontWeight:700, color:'rgba(255,255,255,.45)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'4px' }}>{item.label}</div>
                    <div style={{ fontSize:'1rem', fontWeight:800, color:'#fff' }}>{item.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick access */}
          <div className="card">
            <div className="card-header"><div className="card-title">Quick Access</div></div>
            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {[
                { label:'Medical Records',   color:'#2563eb', bg:'rgba(37,99,235,.08)',  icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> },
                { label:'Prescriptions',     color:'#0d9488', bg:'rgba(13,148,136,.08)', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 2 4 4-14 14-4-4 14-14z"/><path d="m14.5 5.5 4 4"/><path d="M3 21v-4h4"/></svg> },
                { label:'Test Results',      color:'#7c3aed', bg:'rgba(124,58,237,.08)', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
                { label:'Book Appointment',  color:'#d97706', bg:'rgba(217,119,6,.08)',  icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg> },
              ].map((qa, idx) => (
                <button key={idx} className="quick-action" onClick={qa.label === 'Book Appointment' ? () => setShowModal(true) : undefined}>
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
        @media (max-width: 960px) {
          .patient-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}