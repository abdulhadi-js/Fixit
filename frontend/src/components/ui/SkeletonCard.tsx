import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-surface-high border border-border-soft rounded-xl overflow-hidden shadow-sm flex flex-col h-[380px] animate-pulse">
      <div className="h-48 w-full bg-surface-muted"></div>
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="h-6 bg-surface-muted rounded w-3/4"></div>
        <div className="h-4 bg-surface-muted rounded w-1/2"></div>
        <div className="mt-auto h-8 bg-surface-muted rounded w-1/3"></div>
        <div className="h-10 bg-surface-muted rounded w-full mt-4"></div>
      </div>
    </div>
  );
};
