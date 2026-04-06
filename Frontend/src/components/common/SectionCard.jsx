import React from 'react';

const SectionCard = ({ title, action, children, className = "", noPadding = false }) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white z-10">
          {title && <h2 className="text-xl font-extrabold text-slate-800">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`flex-1 ${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
