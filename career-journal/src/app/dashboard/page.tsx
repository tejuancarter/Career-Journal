'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  PenTool, 
  Award, 
  TrendingUp, 
  Calendar,
  Target,
  Sparkles
} from 'lucide-react'
import Layout from '@/components/Layout'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
// import { AchievementList } from '@/components/dashboard/AchievementCard'

interface DashboardStats {
  totalEntries: number
  totalAchievements: number
  selectedAchievements: number
  weeklyEntries: number
}

interface RecentEntry {
  id: string
  title?: string
  content: string
  date: string
  achievements: { id: string; title: string }[]
}

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

export default function Dashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalEntries: 0,
    totalAchievements: 0,
    selectedAchievements: 0,
    weeklyEntries: 0
  })
  const [recentEntries, setRecentEntries] = useState<RecentEntry[]>([])
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch recent journal entries
      const entriesResponse = await fetch('/api/journal?limit=5')
      const entriesData = await entriesResponse.json()
      
      // Fetch recent achievements
      const achievementsResponse = await fetch('/api/achievements?limit=5')
      const achievementsData = await achievementsResponse.json()
      
      // Calculate stats
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      
      setRecentEntries(entriesData.entries || [])
      setRecentAchievements(achievementsData.achievements || [])
      
      setStats({
        totalEntries: entriesData.pagination?.total || 0,
        totalAchievements: achievementsData.pagination?.total || 0,
        selectedAchievements: achievementsData.achievements?.filter((a: Achievement) => a.isSelected).length || 0,
        weeklyEntries: entriesData.entries?.filter((e: RecentEntry) => 
          new Date(e.date) > weekAgo
        ).length || 0
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleAchievement = async (id: string, isSelected: boolean) => {
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
      setRecentAchievements(prev =>
        prev.map(achievement =>
          achievement.id === id ? { ...achievement, isSelected } : achievement
        )
      )
      
      // Update stats
      setStats(prev => ({
        ...prev,
        selectedAchievements: prev.selectedAchievements + (isSelected ? 1 : -1)
      }))
    } catch (error) {
      console.error('Error updating achievement:', error)
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">
              Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-dark-text-muted mt-1">
              Here&apos;s an overview of your career journey
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/journal'}
            className="flex items-center space-x-2"
          >
            <PenTool className="w-4 h-4" />
            <span>New Entry</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PenTool className="w-8 h-8 text-dark-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-dark-text-muted">Total Entries</p>
                  <p className="text-2xl font-bold text-dark-text">
                    {isLoading ? '-' : stats.totalEntries}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="w-8 h-8 text-dark-success" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-dark-text-muted">Achievements</p>
                  <p className="text-2xl font-bold text-dark-text">
                    {isLoading ? '-' : stats.totalAchievements}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Target className="w-8 h-8 text-dark-warning" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-dark-text-muted">Selected for Resume</p>
                  <p className="text-2xl font-bold text-dark-text">
                    {isLoading ? '-' : stats.selectedAchievements}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-dark-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-dark-text-muted">This Week</p>
                  <p className="text-2xl font-bold text-dark-text">
                    {isLoading ? '-' : stats.weeklyEntries}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Journal Entries */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Recent Entries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-dark-surface-light rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-dark-surface-light rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentEntries.length > 0 ? (
                  <div className="space-y-4">
                    {recentEntries.map((entry) => (
                      <div key={entry.id} className="border-b border-dark-border last:border-b-0 pb-4 last:pb-0">
                        <h4 className="font-medium text-dark-text line-clamp-1">
                          {entry.title || 'Untitled Entry'}
                        </h4>
                        <p className="text-sm text-dark-text-muted line-clamp-2 mt-1">
                          {entry.content}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-dark-text-disabled">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                          {entry.achievements.length > 0 && (
                            <span className="text-xs text-dark-success flex items-center">
                              <Sparkles className="w-3 h-3 mr-1" />
                              {entry.achievements.length} achievement{entry.achievements.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PenTool className="w-12 h-12 text-dark-text-disabled mx-auto mb-4" />
                    <p className="text-dark-text-muted">No entries yet</p>
                    <Button 
                      className="mt-4"
                      onClick={() => window.location.href = '/journal'}
                    >
                      Write your first entry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-dark-surface-light rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-dark-surface-light rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentAchievements.length > 0 ? (
                  <div className="space-y-4">
                    {recentAchievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="border-b border-dark-border last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-dark-text line-clamp-1">
                              {achievement.title}
                            </h4>
                            <p className="text-sm text-dark-text-muted line-clamp-2 mt-1">
                              {achievement.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-dark-text-disabled">
                                {new Date(achievement.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant={achievement.isSelected ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => handleToggleAchievement(achievement.id, !achievement.isSelected)}
                            className="ml-2 p-1"
                          >
                            <Target className={`w-3 h-3 ${achievement.isSelected ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-dark-text-disabled mx-auto mb-4" />
                    <p className="text-dark-text-muted">No achievements yet</p>
                    <p className="text-sm text-dark-text-disabled mt-1">
                      Write journal entries and let AI extract your wins!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="secondary"
                  onClick={() => window.location.href = '/journal'}
                  className="p-6 h-auto flex flex-col items-center space-y-2"
                >
                  <PenTool className="w-8 h-8" />
                  <span>Write New Entry</span>
                </Button>
                
                <Button 
                  variant="secondary"
                  onClick={() => window.location.href = '/achievements'}
                  className="p-6 h-auto flex flex-col items-center space-y-2"
                >
                  <Award className="w-8 h-8" />
                  <span>View Achievements</span>
                </Button>
                
                <Button 
                  variant="secondary"
                  onClick={() => window.location.href = '/resume'}
                  className="p-6 h-auto flex flex-col items-center space-y-2"
                >
                  <Target className="w-8 h-8" />
                  <span>Build Resume</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  )
}