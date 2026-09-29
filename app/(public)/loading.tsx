import React from 'react';

export default function PublicLoading() {
  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <div className="h-4 bg-slate-200 rounded-full w-32 mx-auto" />
        <div className="h-8 bg-slate-200 rounded-2xl w-3/4 mx-auto" />
        <div className="h-4 bg-slate-100 rounded-full w-5/6 mx-auto" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
          >
            <div className="w-full aspect-video bg-slate-100 rounded-2xl" />
            <div className="h-4 bg-slate-200 rounded-full w-1/3" />
            <div className="h-6 bg-slate-200 rounded-xl w-3/4" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-100 rounded-full w-full" />
              <div className="h-3 bg-slate-100 rounded-full w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
