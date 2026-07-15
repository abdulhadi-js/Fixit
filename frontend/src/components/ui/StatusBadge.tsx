import React from 'react';
import { BookingStatus } from '../../lib/types';

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const styles: Record<BookingStatus, string> = {
    PENDING_PAYMENT: 'bg-surface-muted text-text-secondary border-border-soft',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    IN_PROGRESS: 'bg-primary-container text-on-primary-container border-primary/20',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    CANCELLED: 'bg-error-container text-on-error-container border-error/20',
  };

  const formattedStatus = status.replace('_', ' ');

  return (
    <span className={`px-3 py-1 rounded-full border font-label-md text-xs tracking-wide uppercase ${styles[status]} ${className}`}>
      {formattedStatus}
    </span>
  );
};
