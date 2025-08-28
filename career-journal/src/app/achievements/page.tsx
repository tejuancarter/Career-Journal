'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Filter, Star, Search, Target } from 'lucide-react'
import Layout from '@/components/Layout'
import { AchievementList } from '@/components/dashboard/AchievementCard'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

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

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSelected, setFilterSelected] = useState<'all' | 'selected' | 'unselected'>('all')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [allSkills, setAllSkills] = useState<string[]>([])

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/achievements?limit=100')
      const data = await response.json()
      setAchievements(data.achievements || [])
      
      // Extract all unique skills
      const skills = new Set<string>()
      data.achievements?.forEach((achievement: Achievement) => {
        achievement.skills.forEach(skill => skills.add(skill))
      })
      setAllSkills(Array.from(skills).sort())
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleSelect = async (id: string, isSelected: boolean) => {
    try {
      await fetch('/api/achievements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          achievementIds: [id],
          isSelected,
        }),
      })
      
      // Update local state
      setAchievements(prev =>
        prev.map(achievement =>
          achievement.id === id ? { ...achievement, isSelected } : achievement
        )
      )
    } catch (error) {
      console.error('Error updating achievement:', error)
    }
  }

  const handleBulkSelect = async (selected: boolean) => {
    const filteredIds = filteredAchievements.map((a: Achievement) => a.id)
    
    try {
      await fetch('/api/achievements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          achievementIds: filteredIds,
          isSelected: selected,
        }),
      })
      
      // Update local state
      setAchievements(prev =>
        prev.map(achievement =>
          filteredIds.includes(achievement.id) 
            ? { ...achievement, isSelected: selected } 
            : achievement
        )
      )
    } catch (error) {
      console.error('Error bulk updating achievements:', error)
    }
  }

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = !searchQuery || 
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = 
      filterSelected === 'all' ||
      (filterSelected === 'selected' && achievement.isSelected) ||
      (filterSelected === 'unselected' && !achievement.isSelected)
    
    const matchesSkill = !selectedSkill || achievement.skills.includes(selectedSkill)
    
    return matchesSearch && matchesFilter && matchesSkill
  })

  const selectedCount = achievements.filter(a => a.isSelected).length
  const totalCount = achievements.length

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">Achievements</h1>
            <p className="text-dark-text-muted mt-1">
              Manage your career accomplishments and select the best ones for your resume
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-dark-text-muted">
              {selectedCount} of {totalCount} selected
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-dark-accent mr-4" />
                <div>
                  <p className="text-sm font-medium text-dark-text-muted">Total Achievements</p>
                  <p className="text-2xl font-bold text-dark-text">
                    {totalCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-dark-success mr-4" />
                <div>
                  <p className="text-sm font-medium text-dark-text-muted">Selected for Resume</p>
                  <p className="text-2xl font-bold text-dark-text">
                    {selectedCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-dark-warning mr-4" />
                <div>
                  <p className="text-sm font-medium text-dark-text-muted">Unique Skills</p>
                  <p className="text-2xl font-bold text-dark-text">
                    {allSkills.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-dark-text-muted" />
                <Input
                  placeholder="Search achievements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-dark-text-muted" />
                  <span className="text-sm text-dark-text-muted">Status:</span>
                  <select
                    value={filterSelected}
                    onChange={(e) => setFilterSelected(e.target.value as 'all' | 'selected' | 'unselected')}
                    className="px-3 py-1 bg-dark-surface border border-dark-border rounded-lg text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-dark-accent"
                  >
                    <option value="all">All achievements</option>
                    <option value="selected">Selected only</option>
                    <option value="unselected">Not selected</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-dark-text-muted">Skill:</span>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="px-3 py-1 bg-dark-surface border border-dark-border rounded-lg text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-dark-accent"
                  >
                    <option value="">All skills</option>
                    {allSkills.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                {/* Bulk actions */}
                <div className="flex items-center space-x-2 ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBulkSelect(true)}
                    disabled={filteredAchievements.length === 0}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBulkSelect(false)}
                    disabled={filteredAchievements.length === 0}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-dark-surface-light rounded w-1/3"></div>
                    <div className="h-4 bg-dark-surface-light rounded w-full"></div>
                    <div className="h-4 bg-dark-surface-light rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAchievements.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AchievementList
              achievements={filteredAchievements}
              onToggleSelect={handleToggleSelect}
              showActions={true}
              title={`${filteredAchievements.length} Achievement${filteredAchievements.length !== 1 ? 's' : ''}`}
            />
          </motion.div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Award className="w-16 h-16 text-dark-text-disabled mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-text mb-2">
                {searchQuery || filterSelected !== 'all' || selectedSkill
                  ? 'No matching achievements'
                  : 'No achievements yet'
                }
              </h3>
              <p className="text-dark-text-muted mb-6">
                {searchQuery || filterSelected !== 'all' || selectedSkill
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start writing journal entries and let AI extract your accomplishments!'
                }
              </p>
              {!searchQuery && filterSelected === 'all' && !selectedSkill && (
                <Button onClick={() => window.location.href = '/journal'}>
                  Write a journal entry
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}