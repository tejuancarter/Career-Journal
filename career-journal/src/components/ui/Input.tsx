'use client'

import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-dark-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-xl
            text-dark-text placeholder-dark-text-disabled
            focus:outline-none focus:ring-2 focus:ring-dark-accent focus:border-transparent
            transition-all duration-200
            ${error ? 'border-dark-error focus:ring-dark-error' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-dark-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-dark-text-muted">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input