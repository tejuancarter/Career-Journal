'use client'

import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    disabled,
    children, 
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95"
    
    const variants = {
      primary: "bg-dark-accent text-white hover:bg-dark-accent-hover focus-visible:ring-dark-accent",
      secondary: "bg-dark-surface border border-dark-border text-dark-text hover:bg-dark-surface-light focus-visible:ring-dark-border",
      ghost: "text-dark-text hover:bg-dark-surface-light focus-visible:ring-dark-border",
      destructive: "bg-dark-error text-white hover:bg-red-600 focus-visible:ring-dark-error"
    }
    
    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg"
    }

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button