import React from 'react';

const StatusBadge = ({ status }) => {
  let colorStyles = "bg-slate-100 text-slate-600 border-slate-200"; // Default
  
  const statusLower = status?.toLowerCase() || '';
  
  if (['completed', 'active', 'success', 'approved'].includes(statusLower)) {
    colorStyles = "bg-emerald-50 text-emerald-600 border-emerald-200";
  } else if (['pending', 'waiting', 'in progress', 'scheduled'].includes(statusLower)) {
    colorStyles = "bg-amber-50 text-amber-600 border-amber-200";
  } else if (['cancelled', 'failed', 'error', 'inactive'].includes(statusLower)) {
    colorStyles = "bg-red-50 text-red-600 border-red-200";
  }

  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${colorStyles} uppercase tracking-wider`}>
      {status}
    </span>
  );
};

export default StatusBadge;
