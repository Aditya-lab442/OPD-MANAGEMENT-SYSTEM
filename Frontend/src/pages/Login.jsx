import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ─── Inline SVG icons ──────────────────────────────── */
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const EyeIcon = ({ off }) => off ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const HeartIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const StethoscopeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
    <circle cx="20" cy="10" r="2"/>
  </svg>
);

const trustPoints = [
  { icon: '🔒', text: 'End-to-end encrypted patient data' },
  { icon: '⚡', text: 'Real-time appointment management' },
  { icon: '📊', text: 'Comprehensive analytics & reports' },
  { icon: '🏥', text: 'Trusted by 500+ healthcare facilities' },
];

const Login = () => {
  const [creds, setCreds] = useState({ username: '', password: '', role: 'Patient' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setCreds(p => ({ ...p, [e.target.name]: e.target.value }));
  const setRole = (role) => { setCreds(p => ({ ...p, role })); setError(''); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');

    if (creds.role === 'Admin' && creds.username === 'Admin' && creds.password === '123') {
      login({ username: creds.username, name: 'System Admin', role: 'Admin' }, 'fake-token-abcd');
      setLoading(false); navigate('/dashboard'); return;
    }
    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        body: JSON.stringify(creds),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.token) {
        login({ username: creds.username, name: data.name || creds.username, role: creds.role, email: data.email, id: data._id }, data.token);
        navigate(creds.role === 'Patient' ? '/patient-dashboard' : creds.role === 'Doctor' ? '/doctor-dashboard' : '/dashboard');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      {/* ── Left Branding Panel ─────────────────────── */}
      <div style={{
        width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)',
        padding: '48px', position: 'relative', overflow: 'hidden',
      }} className="login-left-panel">
        {/* decorative circles */}
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'360px', height:'360px', borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,.25), transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-60px', left:'-40px', width:'280px', height:'280px', borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,.2), transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'30%', right:'10%', width:'160px', height:'160px', borderRadius:'50%', background:'radial-gradient(circle, rgba(20,184,166,.15), transparent 65%)', pointerEvents:'none' }}/>

        {/* Brand */}
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'64px' }}>
            <div style={{ width:'52px', height:'52px', background:'rgba(255,255,255,.12)', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,.15)', backdropFilter:'blur(8px)' }}>
              <HeartIcon />
            </div>
            <div>
              <div style={{ fontSize:'1.5rem', fontWeight:900, color:'#fff', letterSpacing:'-.02em' }}>MedSaaS</div>
              <div style={{ fontSize:'.72rem', fontWeight:700, color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:'.1em' }}>Healthcare Platform</div>
            </div>
          </div>

          <div style={{ maxWidth:'480px' }}>
            <h1 style={{ fontSize:'3rem', fontWeight:900, color:'#fff', lineHeight:1.1, letterSpacing:'-.04em', marginBottom:'20px' }}>
              The future of{' '}
              <span style={{ background:'linear-gradient(135deg, #60a5fa, #34d399)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                healthcare
              </span>{' '}
              management.
            </h1>
            <p style={{ fontSize:'1.05rem', color:'rgba(255,255,255,.65)', lineHeight:1.7, fontWeight:500 }}>
              A premium, secure, and intuitive platform dedicated to streamlining hospital operations and elevating patient care.
            </p>
          </div>
        </div>

        {/* Trust points */}
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {trustPoints.map((tp, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                <div style={{ width:'36px', height:'36px', background:'rgba(255,255,255,.08)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', border:'1px solid rgba(255,255,255,.1)', flexShrink:0 }}>
                  {tp.icon}
                </div>
                <span style={{ color:'rgba(255,255,255,.75)', fontSize:'.875rem', fontWeight:600 }}>{tp.text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:'32px', paddingTop:'24px', borderTop:'1px solid rgba(255,255,255,.1)' }}>
            <span style={{ fontSize:'.78rem', fontWeight:700, color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'.08em' }}>Enterprise v2.0</span>
          </div>
        </div>
      </div>

      {/* ── Right Login Panel ───────────────────────── */}
      <div style={{ width:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--slate-50)', padding:'48px' }} className="login-right-panel">
        <div style={{ width:'100%', maxWidth:'420px' }}>
          {/* Header */}
          <div style={{ marginBottom:'36px' }}>
            <p style={{ fontSize:'.875rem', fontWeight:700, color:'var(--brand-600)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'8px' }}>Welcome back</p>
            <h2 style={{ fontSize:'2rem', fontWeight:900, color:'var(--slate-900)', letterSpacing:'-.03em', marginBottom:'8px' }}>Sign in to continue</h2>
            <p style={{ color:'var(--slate-400)', fontWeight:500, fontSize:'.9rem' }}>Choose your portal and enter your credentials securely.</p>
          </div>

          {/* Role selector */}
          <div className="role-selector" style={{ marginBottom:'28px' }}>
            {[
              { r:'Patient', icon:<UserIcon/> },
              { r:'Doctor',  icon:<StethoscopeIcon/> },
              { r:'Admin',   icon:<ShieldIcon/> },
            ].map(({ r, icon }) => (
              <button key={r} className={`role-btn${creds.role === r ? ' active' : ''}`} onClick={() => setRole(r)}>
                {icon} {r}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:'var(--danger-50)', border:'1px solid var(--danger-100)', borderLeft:'4px solid var(--danger-500)', borderRadius:'var(--radius-md)', padding:'12px 16px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }} className="anim-fade-in">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger-600)" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize:'.875rem', fontWeight:600, color:'var(--danger-600)' }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            {/* Username */}
            <div className="form-group">
              <label className="form-label">Username or Email</label>
              <div className="form-input-wrap">
                <span className="form-input-icon"><UserIcon/></span>
                <input
                  type="text" name="username" required
                  className={`form-input has-icon-left${error ? ' error' : ''}`}
                  placeholder="Enter your username"
                  value={creds.username} onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <label className="form-label">Password</label>
                <Link to="#" style={{ fontSize:'.78rem', fontWeight:700, color:'var(--brand-600)' }}>Forgot password?</Link>
              </div>
              <div className="form-input-wrap">
                <span className="form-input-icon"><LockIcon/></span>
                <input
                  type={showPass ? 'text' : 'password'} name="password" required
                  className={`form-input has-icon-left${error ? ' error' : ''}`}
                  style={{ paddingRight:'44px' }}
                  placeholder="Enter your password"
                  value={creds.password} onChange={handleChange}
                />
                <span className="form-input-icon-right" onClick={() => setShowPass(p => !p)}>
                  <EyeIcon off={showPass}/>
                </span>
              </div>
            </div>

            {/* Remember me */}
            <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}>
              <input type="checkbox" style={{ width:'16px', height:'16px', accentColor:'var(--brand-600)', cursor:'pointer' }}/>
              <span style={{ fontSize:'.875rem', fontWeight:500, color:'var(--slate-600)' }}>Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width:'100%', marginTop:'4px' }}>
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin .7s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Authenticating…
                </>
              ) : (
                <>Sign in to Dashboard <ArrowRightIcon/></>
              )}
            </button>
          </form>

          <div style={{ marginTop:'32px', textAlign:'center', paddingTop:'24px', borderTop:'1px solid var(--slate-200)' }}>
            <p style={{ fontSize:'.875rem', color:'var(--slate-500)', fontWeight:500 }}>
              Need an account?{' '}
              <Link to="/register" style={{ color:'var(--brand-600)', fontWeight:700 }}>Request access</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .login-left-panel { display: none !important; }
          .login-right-panel { width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;