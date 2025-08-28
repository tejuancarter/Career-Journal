'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface AIProcessingAnimationProps {
  isVisible: boolean
  message?: string
  className?: string
}

export default function AIProcessingAnimation({ 
  isVisible, 
  message = "AI is analyzing your entry...",
  className = ""
}: AIProcessingAnimationProps) {
  const [dots, setDots] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // Generate random dots for the animation
    const newDots = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 200,
      y: Math.random() * 60,
      delay: Math.random() * 2,
    }))
    setDots(newDots)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}
    >
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-8 max-w-sm mx-4 text-center">
        {/* Siri-like wave animation */}
        <div className="relative h-16 mb-6 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {dots.map((dot) => (
              <motion.div
                key={dot.id}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${(dot.x / 200) * 100}%`,
                  top: `${(dot.y / 60) * 100}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: dot.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          
          {/* Center wave pattern */}
          <div className="absolute inset-0 flex items-center justify-center space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-white rounded-full"
                animate={{
                  scaleY: [1, 3, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>

        {/* Message */}
        <p className="text-dark-text-muted text-sm">
          {message}
        </p>

        {/* Animated dots text */}
        <div className="flex justify-center items-center space-x-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-dark-text-muted rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Alternative simplified version for inline use
export function InlineAIAnimation({ 
  isVisible, 
  size = "sm" 
}: { 
  isVisible: boolean
  size?: "sm" | "md" | "lg"
}) {
  if (!isVisible) return null

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`${sizeClasses[size]} bg-white rounded-full`}
          animate={{
            scaleY: [1, 2, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}