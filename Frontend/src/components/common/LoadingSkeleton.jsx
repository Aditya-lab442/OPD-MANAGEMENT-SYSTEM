import React from 'react';

const LoadingSkeleton = ({ count = 3, type = "card" }) => {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="w-1/2">
                <div className="h-4 bg-slate-200 rounded-md w-full mb-3"></div>
                <div className="h-8 bg-slate-200 rounded-md w-2/3"></div>
              </div>
              <div className="h-14 w-14 bg-slate-200 rounded-2xl"></div>
            </div>
            <div className="mt-8 h-4 bg-slate-200 rounded-md w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Row skeleton
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex gap-4 animate-pulse p-4 rounded-xl border border-slate-100 items-center">
          <div className="h-10 w-10 bg-slate-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
            <div className="h-3 bg-slate-200 rounded-md w-1/5"></div>
          </div>
          <div className="h-8 w-24 bg-slate-200 rounded-full flex-shrink-0"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
