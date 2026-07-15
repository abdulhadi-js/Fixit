import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  loading, 
  variant = 'primary', 
  fullWidth, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = 'inline-flex justify-center items-center font-label-md text-label-md rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-accent-hover focus:ring-primary',
    secondary: 'bg-surface-muted text-primary hover:bg-surface-variant focus:ring-primary',
    outline: 'border border-border-soft text-text-primary hover:border-primary hover:text-primary focus:ring-primary',
    ghost: 'bg-transparent text-secondary hover:text-primary hover:bg-surface-muted focus:ring-primary',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const paddingStyle = 'py-3 px-4';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${paddingStyle} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin mr-2 text-base">
          progress_activity
        </span>
      ) : null}
      {children}
    </button>
  );
};
