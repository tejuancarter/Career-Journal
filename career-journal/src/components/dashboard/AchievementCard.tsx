'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Award, ChevronDown, ChevronUp, Calendar, Tag } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card'
import Button from '../ui/Button'

interface Achievement {
  id: string
  title: string
  description: string
  starFormat?: string
  skills: string[]
  quantifiableMetrics?: string
  impact?: string
  isSelected: boolean
  createdAt: string
  journalEntry?: {
    title?: string
    date: string
  }
}

interface AchievementCardProps {
  achievement: Achievement
  onToggleSelect?: (id: string, isSelected: boolean) => void
  onEdit?: (id: string) => void
  showActions?: boolean
}

export default function AchievementCard({
  achievement,
  onToggleSelect,
  onEdit,
  showActions = true
}: AchievementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggleSelect = () => {
    if (onToggleSelect) {
      onToggleSelect(achievement.id, !achievement.isSelected)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`transition-all duration-200 ${
          achievement.isSelected ? 'ring-2 ring-dark-accent' : ''
        }`}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-dark-accent" />
                <span>{achievement.title}</span>
              </CardTitle>
              
              {achievement.journalEntry && (
                <div className="flex items-center space-x-2 mt-2 text-sm text-dark-text-muted">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(achievement.journalEntry.date).toLocaleDateString()}
                    {achievement.journalEntry.title && ` • ${achievement.journalEntry.title}`}
                  </span>
                </div>
              )}
            </div>

            {showActions && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
                
                {onToggleSelect && (
                  <Button
                    variant={achievement.isSelected ? "primary" : "secondary"}
                    size="sm"
                    onClick={handleToggleSelect}
                  >
                    <Star className={`w-4 h-4 ${achievement.isSelected ? 'fill-current' : ''}`} />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-dark-text-muted mb-4">
            {achievement.description}
          </p>

          {/* Skills */}
          {achievement.skills.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="w-4 h-4 text-dark-text-muted" />
                <span className="text-sm font-medium text-dark-text">Skills</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {achievement.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-dark-surface-light text-dark-text text-xs rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantifiable metrics */}
          {achievement.quantifiableMetrics && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-dark-text mb-2">Metrics</h4>
              <p className="text-sm text-dark-text-muted bg-dark-surface-light p-3 rounded-lg">
                {achievement.quantifiableMetrics}
              </p>
            </div>
          )}

          {/* Impact */}
          {achievement.impact && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-dark-text mb-2">Impact</h4>
              <p className="text-sm text-dark-text-muted bg-dark-surface-light p-3 rounded-lg">
                {achievement.impact}
              </p>
            </div>
          )}

          {/* Expanded content - STAR format */}
          <AnimatePresence>
            {isExpanded && achievement.starFormat && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-dark-border"
              >
                <h4 className="text-sm font-medium text-dark-text mb-2 flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  STAR Format Summary
                </h4>
                <div className="text-sm text-dark-text-muted bg-dark-surface-light p-3 rounded-lg whitespace-pre-wrap">
                  {achievement.starFormat}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          {showActions && onEdit && (
            <div className="mt-4 pt-4 border-t border-dark-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(achievement.id)}
              >
                Edit Achievement
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Achievement list component
interface AchievementListProps {
  achievements: Achievement[]
  onToggleSelect?: (id: string, isSelected: boolean) => void
  onEdit?: (id: string) => void
  showActions?: boolean
  title?: string
}

export function AchievementList({
  achievements,
  onToggleSelect,
  onEdit,
  showActions = true,
  title = "Achievements"
}: AchievementListProps) {
  if (achievements.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Award className="w-12 h-12 text-dark-text-disabled mx-auto mb-4" />
          <p className="text-dark-text-muted">No achievements yet.</p>
          <p className="text-sm text-dark-text-disabled mt-1">
            Start journaling to extract your accomplishments!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-dark-text">{title}</h2>
      <div className="space-y-4">
        <AnimatePresence>
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onToggleSelect={onToggleSelect}
              onEdit={onEdit}
              showActions={showActions}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}