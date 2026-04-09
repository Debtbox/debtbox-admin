import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';
import { cn } from '@/utils/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: FieldError;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2',
              error && 'border-red-300',
              className
            )}
            {...props}
          />
          {label && (
            <span className="text-sm text-gray-700">{label}</span>
          )}
        </label>
        {error && (
          <p className="text-sm text-red-600">{error.message}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';