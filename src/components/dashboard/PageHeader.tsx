import React from 'react';

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="min-w-0 max-w-full">
        <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-tight break-words">{title}</h2>
        {description && <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-none">{description}</p>}
      </div>
      {action ? (
        <div className="flex shrink-0 items-center gap-2 w-full sm:w-auto">
          {action}
        </div>
      ) : null}
    </div>
  );
}
