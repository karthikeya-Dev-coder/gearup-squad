import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusVariant = 'pending' | 'approved' | 'rejected' | 'returned' | 'overdue' | 'active' | 'suspended' | 'available' | 'in-use' | 'damaged';

const variantStyles: Record<StatusVariant, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  approved: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  returned: 'bg-info/10 text-info border-info/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
  active: 'bg-success/10 text-success border-success/20',
  suspended: 'bg-destructive/10 text-destructive border-destructive/20',
  available: 'bg-success/10 text-success border-success/20',
  'in-use': 'bg-info/10 text-info border-info/20',
  damaged: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status.toLowerCase().replace(' ', '-') as StatusVariant;
  return (
    <Badge variant="outline" className={cn("text-xs font-medium capitalize", variantStyles[key] || '', className)}>
      {status}
    </Badge>
  );
}
