import React from 'react';

export const SkeletonChat: React.FC = () => {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      {/* User message skeleton */}
      <div className="flex justify-end">
        <div className="w-2/3 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-slate-700/30 to-transparent animate-shimmer" />
        </div>
      </div>
      {/* Assistant message skeleton */}
      <div className="flex justify-start items-start space-x-3">
        <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
        <div className="w-3/4 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-full relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-slate-700/30 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonSidebar: React.FC = () => {
  return (
    <div className="p-3 space-y-3 animate-pulse">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
      <div className="space-y-2 pt-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
        ))}
      </div>
    </div>
  );
};
