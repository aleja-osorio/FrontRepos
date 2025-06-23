import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder,
      disabled = false,
      required = false,
      name,
      id,
      label,
      error,
      helperText,
      className = '',
      ...rest
    },
    ref
  ) => {
    const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200';
    const stateClasses = error
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';
    const disabledClasses = disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white';
    const classes = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={id || name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={classes}
          {...rest}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 