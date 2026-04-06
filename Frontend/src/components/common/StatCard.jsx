import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, colorClass = "text-brand-600", bgClass = "bg-brand-50" }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-800">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-4 rounded-2xl ${bgClass} ${colorClass}`}>
            <Icon size={26} strokeWidth={2.5} />
          </div>
        )}
      </div>
      {(trend !== undefined || trendLabel) && (
        <div className="mt-auto flex items-center text-sm">
          {trend !== undefined && (
             <span className={`font-bold mr-2 ${trend > 0 ? 'text-success-500' : 'text-danger-500'}`}>
               {trend > 0 ? '+' : ''}{trend}%
             </span>
          )}
          {trendLabel && <span className="text-slate-400 font-medium">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
