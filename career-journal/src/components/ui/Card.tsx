'use client'

import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ 
  children, 
  className = '', 
  hover = false, 
  onClick 
}: CardProps) {
  const Component = onClick ? motion.button : motion.div

  return (
    <Component
      className={`
        bg-dark-surface border border-dark-border rounded-2xl p-6
        transition-all duration-200
        ${hover ? 'hover:bg-dark-surface-light hover:border-dark-text-disabled cursor-pointer' : ''}
        ${onClick ? 'text-left w-full' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </Component>
  )
}

export function CardHeader({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <h3 className={`text-lg font-semibold text-dark-text ${className}`}>
      {children}
    </h3>
  )
}

export function CardContent({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}