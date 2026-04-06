import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ─── Stat data ──────────────────────────────────── */
const stats = [
  {
    label: 'Total Patients', value: '1,248', trend: '+12%', trendDir: 'up', trendNote: 'vs last month',
    color: '#2563eb', bg: 'rgba(37,99,235,.08)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    accentGradient: 'linear-gradient(90deg,#2563eb,#60a5fa)',
  },
  {
    label: 'Active Doctors', value: '45', trend: 'Stable', trendDir: 'neutral', trendNote: 'no change',
    color: '#0d9488', bg: 'rgba(13,148,136,.08)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>
      </svg>
    ),
    accentGradient: 'linear-gradient(90deg,#0d9488,#34d399)',
  },
  {
    label: "Today's Appointments", value: '112', trend: '+5%', trendDir: 'up', trendNote: 'vs yesterday',
    color: '#d97706', bg: 'rgba(217,119,6,.08)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    accentGradient: 'linear-gradient(90deg,#d97706,#fbbf24)',
  },
  {
    label: 'Pending Bills', value: '24', trend: '-2%', trendDir: 'up', trendNote: 'this week',
    color: '#dc2626', bg: 'rgba(220,38,38,.08)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    accentGradient: 'linear-gradient(90deg,#dc2626,#f87171)',
  },
];

/* ─── Module cards ───────────────────────────────── */
const modules = [
  { title: 'Hospital Master',   desc: 'Manage hospital records',         path: '/hospital',     color: '#2563eb', bg: 'rgba(37,99,235,.06)',   icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { title: 'Doctor Master',     desc: 'Doctors & specialists',           path: '/doctor',       color: '#0d9488', bg: 'rgba(13,148,136,.06)',  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg> },
  { title: 'Patient Registry',  desc: 'New patient admissions',         path: '/patient',      color: '#7c3aed', bg: 'rgba(124,58,237,.06)', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg> },
  { title: 'OPD Entries',       desc: 'Outpatient departments',          path: '/opd',          color: '#d97706', bg: 'rgba(217,119,6,.06)',  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> },
  { title: 'Diagnosis Master',  desc: 'Diagnosis codes & records',       path: '/diagnosis',    color: '#db2777', bg: 'rgba(219,39,119,.06)', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
  { title: 'Treatment Types',   desc: 'Define treatment categories',     path: '/treatment',    color: '#0284c7', bg: 'rgba(2,132,199,.06)',  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 2 4 4-14 14-4-4 14-14z"/><path d="m14.5 5.5 4 4"/><path d="M3 21v-4h4"/></svg> },
  { title: 'Sub Treatments',    desc: 'Specific procedure mapping',      path: '/subtreatment', color: '#0f766e', bg: 'rgba(15,118,110,.06)', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> },
  { title: 'Receipt Entry',     desc: 'Billing & invoices',              path: '/receipt',      color: '#dc2626', bg: 'rgba(220,38,38,.06)',  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> },
];

/* ─── Recent activity ────────────────────────────── */
const activities = [
  { title: 'New patient registered — Priya Sharma', time: '2 minutes ago', color: '#2563eb' },
  { title: 'Appointment completed — Dr. Rajesh Kumar', time: '14 minutes ago', color: '#0d9488' },
  { title: 'Receipt generated — OPD-2847', time: '31 minutes ago', color: '#d97706' },
  { title: 'New doctor onboarded — Dr. Ananya Singh', time: '1 hour ago', color: '#7c3aed' },
  { title: 'Appointment cancelled — Patient #1093', time: '2 hours ago', color: '#dc2626' },
];

/* ─── Recent appointments ────────────────────────── */
const recentAppts = [
  { patient: 'Aarav Mehta',   doctor: 'Dr. Patel',   time: '09:00 AM', status: 'Completed', day: '04', month: 'APR' },
  { patient: 'Sneha Reddy',   doctor: 'Dr. Kumar',   time: '09:30 AM', status: 'Completed', day: '04', month: 'APR' },
  { patient: 'Rohan Das',     doctor: 'Dr. Singh',   time: '10:00 AM', status: 'Pending',   day: '04', month: 'APR' },
  { patient: 'Nisha Patel',   doctor: 'Dr. Sharma',  time: '10:30 AM', status: 'Scheduled', day: '04', month: 'APR' },
  { patient: 'Vikram Gupta',  doctor: 'Dr. Anand',   time: '11:00 AM', status: 'Scheduled', day: '04', month: 'APR' },
];

const statusBadgeClass = (s) => {
  if (s === 'Completed') return 'badge badge-success';
  if (s === 'Pending')   return 'badge badge-warning';
  if (s === 'Cancelled') return 'badge badge-danger';
  return 'badge badge-brand';
};

/* ─── Avatar colors ──────────────────────────────── */
const avatarColors = ['#2563eb', '#0d9488', '#7c3aed', '#d97706', '#dc2626', '#0284c7'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'28px' }} className="anim-fade-up">

      {/* ── Hero ────────────────────────────────────── */}
      <div className="hero-banner" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
        <div style={{ position:'relative', zIndex:1 }}>
          <p className="hero-greeting">👋 Good morning</p>
          <h1 className="hero-title">{user?.name || user?.username || 'Administrator'}</h1>
          <p className="hero-subtitle">Here's what's happening at your facility today.</p>
        </div>
        <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
          <div style={{ background:'rgba(255,255,255,.1)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,.15)', borderRadius:'var(--radius-md)', padding:'10px 18px', display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'8px', height:'8px', background:'#34d399', borderRadius:'50%', animation:'pulse 2s ease-in-out infinite' }}/>
            <span style={{ color:'rgba(255,255,255,.9)', fontSize:'.875rem', fontWeight:600 }}>{today}</span>
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────── */}
      <div className="grid grid-4">
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ '--accent-gradient': s.accentGradient }}>
            <div className="stat-card-top">
              <div>
                <div className="stat-card-value">{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
              <div className="stat-card-icon" style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
            </div>
            <div className={`stat-card-trend trend-${s.trendDir}`}>
              <span style={{ fontWeight:800 }}>{s.trend}</span>
              <span style={{ color:'var(--slate-400)', fontWeight:500 }}>{s.trendNote}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main 2-col layout ───────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'24px' }}>

        {/* Left column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'24px', minWidth:0 }}>

          {/* Recent Appointments */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Recent Appointments</div>
                <div className="card-subtitle">Today's patient visits</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/opd')}>
                View All
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
            <div className="card-body no-pad">
              {recentAppts.map((a, i) => (
                <div key={i} className="appt-card">
                  <div className="appt-date-box">
                    <div className="appt-date-day">{a.day}</div>
                    <div className="appt-date-month">{a.month}</div>
                  </div>
                  <div className="appt-info">
                    <div className="appt-doctor">{a.patient}</div>
                    <div className="appt-meta">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {a.time}
                      <span>·</span>
                      {a.doctor}
                    </div>
                  </div>
                  <span className={statusBadgeClass(a.status)}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Module grid */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Management Modules</div>
                <div className="card-subtitle">Quick access to all facility operations</div>
              </div>
            </div>
            <div className="card-body">
              <div className="grid grid-4" style={{ gap:'14px' }}>
                {modules.map((m, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(m.path)}
                    style={{
                      padding:'20px 16px', borderRadius:'var(--radius-lg)',
                      border:'1.5px solid var(--slate-100)',
                      cursor:'pointer', transition:'all .25s ease',
                      display:'flex', flexDirection:'column', gap:'12px',
                      background:'#fff',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = m.color + '40'; e.currentTarget.style.background = m.bg; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--slate-100)'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ width:'44px', height:'44px', borderRadius:'12px', background: m.bg, color: m.color, display:'flex', alignItems:'center', justifyContent:'center' }}>{m.icon}</div>
                    <div>
                      <div style={{ fontSize:'.875rem', fontWeight:700, color:'var(--slate-800)', marginBottom:'3px' }}>{m.title}</div>
                      <div style={{ fontSize:'.75rem', fontWeight:500, color:'var(--slate-400)' }}>{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>

          {/* Activity feed */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Activity Feed</div>
                <div className="card-subtitle">Latest system events</div>
              </div>
            </div>
            <div className="card-body">
              {activities.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" style={{ background: a.color, marginTop:'6px' }}/>
                  <div className="activity-content">
                    <div className="activity-title">{a.title}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Quick Actions</div>
            </div>
            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {[
                { label:'Register Patient', path:'/patient', color:'#2563eb', bg:'rgba(37,99,235,.08)' },
                { label:'New Appointment', path:'/opd',     color:'#0d9488', bg:'rgba(13,148,136,.08)' },
                { label:'Add Doctor',       path:'/doctor',  color:'#7c3aed', bg:'rgba(124,58,237,.08)' },
                { label:'Create Receipt',   path:'/receipt', color:'#d97706', bg:'rgba(217,119,6,.08)' },
              ].map((qa, i) => (
                <button key={i} className="quick-action" onClick={() => navigate(qa.path)}>
                  <div className="quick-action-icon" style={{ background: qa.bg, color: qa.color }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </div>
                  {qa.label}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft:'auto', color:'var(--slate-300)' }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              ))}
            </div>
          </div>

          {/* Summary widget */}
          <div className="card" style={{ background:'linear-gradient(135deg, var(--slate-900), var(--brand-900))', border:'none' }}>
            <div className="card-body">
              <div style={{ color:'rgba(255,255,255,.6)', fontSize:'.78rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'8px' }}>Weekly Summary</div>
              <div style={{ color:'#fff', fontSize:'2.2rem', fontWeight:900, letterSpacing:'-.03em', marginBottom:'4px' }}>87%</div>
              <div style={{ color:'rgba(255,255,255,.75)', fontSize:'.875rem', fontWeight:600, marginBottom:'16px' }}>Bed Occupancy Rate</div>
              <div style={{ height:'6px', background:'rgba(255,255,255,.1)', borderRadius:'99px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:'87%', background:'linear-gradient(90deg, #60a5fa, #34d399)', borderRadius:'99px' }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:'8px' }}>
                <span style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)', fontWeight:600 }}>0%</span>
                <span style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)', fontWeight:600 }}>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .dashboard-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
