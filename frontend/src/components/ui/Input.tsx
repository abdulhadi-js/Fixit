import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="block font-label-md text-label-md text-text-primary" htmlFor={inputId}>
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-secondary text-lg">
                {icon}
              </span>
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`block w-full ${icon ? 'pl-10' : 'px-4'} pr-3 py-3 font-body-md text-body-md bg-surface-muted border ${error ? 'border-error text-error' : 'border-border-soft'} rounded-lg text-text-primary focus:outline-none focus:ring-1 ${error ? 'focus:ring-error focus:border-error' : 'focus:ring-primary focus:border-primary'} transition-shadow ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="font-caption text-caption text-error-container-text mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
