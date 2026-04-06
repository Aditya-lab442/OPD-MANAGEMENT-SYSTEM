import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--slate-50)', fontFamily: 'var(--font-sans)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', border: '3px solid var(--slate-200)',
            borderTopColor: 'var(--brand-600)', borderRadius: '50%',
            animation: 'spin .7s linear infinite', margin: '0 auto 16px',
          }} />
          <div style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--slate-400)' }}>Loading…</div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
