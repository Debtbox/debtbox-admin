import { forwardRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  error?: any;
  helperText?: string;
  fullWidth?: boolean;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ label, error, helperText, fullWidth = true, options, value, onChange, placeholder, className }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (optionValue: string) => {
      if (value.includes(optionValue)) {
        onChange(value.filter(v => v !== optionValue));
      } else {
        onChange([...value, optionValue]);
      }
    };

    const handleRemove = (optionValue: string) => {
      onChange(value.filter(v => v !== optionValue));
    };

    const selectedLabels = options.filter(option => value.includes(option.value)).map(option => option.label);

    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')} ref={ref}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <div
            className={cn(
              'min-h-[38px] px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer flex flex-wrap gap-1',
              error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
              fullWidth && 'w-full',
              className
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label, index) => (
                <span
                  key={value[index]}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800"
                >
                  {label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(value[index]);
                    }}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-500">{placeholder || 'Select options...'}</span>
            )}
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'px-3 py-2 cursor-pointer hover:bg-gray-100',
                    value.includes(option.value) && 'bg-blue-50'
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value.includes(option.value)}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    {option.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600">{error.message}</p>
        )}
        {helperText && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);