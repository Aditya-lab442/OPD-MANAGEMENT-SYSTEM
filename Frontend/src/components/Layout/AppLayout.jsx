import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ── SVG Icon primitives ─────────────────────────────── */
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const CircleIcon = ({ children, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

/* ── Sidebar ─────────────────────────────────────────── */
const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminLinks = [
    { name: 'Dashboard',    path: '/dashboard',       icon: 'grid' },
    { name: 'Patients',     path: '/patient',          icon: 'users' },
    { name: 'Doctors',      path: '/doctor',           icon: 'stethoscope' },
    { name: 'Appointments', path: '/opd',              icon: 'calendar' },
    { name: 'Hospital',     path: '/hospital',         icon: 'building' },
    { name: 'Receipts',     path: '/receipt',          icon: 'receipt' },
    { name: 'Treatment',    path: '/treatment',        icon: 'syringe' },
    { name: 'Diagnosis',    path: '/diagnosis',        icon: 'clipboard' },
  ];
  const doctorLinks = [
    { name: 'Dashboard',    path: '/doctor-dashboard', icon: 'grid' },
    { name: 'My Schedule',  path: '/opd',              icon: 'calendar' },
  ];
  const patientLinks = [
    { name: 'Dashboard',    path: '/patient-dashboard',icon: 'grid' },
    { name: 'Appointments', path: '/opd',              icon: 'calendar' },
  ];

  const links = user?.role === 'Admin' ? adminLinks
              : user?.role === 'Doctor' ? doctorLinks
              : patientLinks;

  const handleLogout = () => { logout(); navigate('/'); };

  const getIcon = (name) => {
    const icons = {
      grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
      users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
      stethoscope: <><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></>,
      calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
      building: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
      receipt: <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
      syringe: <><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></>,
      clipboard: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></>,
      logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    };
    return icons[name] || icons.grid;
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span className="sidebar-brand-text">Med<span>Saas</span></span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Navigation</span>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="link-icon">
                <CircleIcon size={18}>{getIcon(link.icon)}</CircleIcon>
              </span>
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <span className="link-icon">
              <CircleIcon size={18}>{getIcon('logout')}</CircleIcon>
            </span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

/* ── Top Navbar ──────────────────────────────────────── */
const TopNavbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { setDropdownOpen(false); logout(); navigate('/'); };

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'UN';

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button className="navbar-hamburger" onClick={onToggleSidebar}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="navbar-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search patients, doctors, appointments…" />
        </div>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="notif-dot"/>
        </button>

        <div className="navbar-divider"/>

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button className="navbar-profile" onClick={() => setDropdownOpen(o => !o)}>
            <div className="navbar-avatar">{initials}</div>
            <div className="navbar-profile-info">
              <div className="navbar-profile-name">{user?.username || 'Guest'}</div>
              <div className="navbar-profile-role">{user?.role || 'User'}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              style={{ color: 'var(--slate-400)', transition: 'transform .2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown">
              <button className="profile-dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                My Profile
              </button>
              <button className="profile-dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 1.41 1.42M4.93 4.93a10 10 0 0 0-1.41 1.42M19.07 19.07a10 10 0 0 1-1.42 1.41M4.93 19.07a10 10 0 0 0 1.42 1.41M2 12h2M20 12h2M12 2v2M12 20v2"/>
                </svg>
                Settings
              </button>
              <div className="profile-dropdown-divider"/>
              <button className="profile-dropdown-item danger" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

/* ── App Layout ──────────────────────────────────────── */
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <TopNavbar onToggleSidebar={() => setSidebarOpen(o => !o)} />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
