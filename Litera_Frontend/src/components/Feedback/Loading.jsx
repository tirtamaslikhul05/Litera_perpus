import React from 'react';

export default function Loading({ type = 'grid' }) {
  if (type === 'table') {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-10 bg-slate-100 rounded w-full"></div>
        <div className="h-10 bg-slate-100 rounded w-full"></div>
        <div className="h-10 bg-slate-100 rounded w-full"></div>
      </div>
    );
  }

  if (type === 'details') {
    return (
      <div className="p-6 space-y-5 animate-pulse max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-24 aspect-[3/4] bg-slate-200 rounded-lg mx-auto sm:mx-0"></div>
          <div className="flex-1 space-y-3 w-full">
            <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto sm:mx-0"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto sm:mx-0"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto sm:mx-0"></div>
            <div className="space-y-1.5 pt-2">
              <div className="h-3 bg-slate-100 rounded w-full"></div>
              <div className="h-3 bg-slate-100 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Shimmer Card Grid Layout
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="bg-white rounded-xl border border-slate-100 p-3 space-y-3 animate-pulse">
          <div className="w-full aspect-[3/4] bg-slate-200 rounded-lg"></div>
          <div className="h-3 bg-slate-200 rounded w-3/4"></div>
          <div className="h-8 bg-slate-100 rounded-lg w-full"></div>
        </div>
      ))}
    </div>
  );
}