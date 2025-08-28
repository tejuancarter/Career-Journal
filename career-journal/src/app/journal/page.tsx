'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Calendar, Sparkles, Filter } from 'lucide-react'
import Layout from '@/components/Layout'
import JournalEntryForm from '@/components/forms/JournalEntryForm'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface JournalEntry {
  id: string
  title?: string
  content: string
  tags: string[]
  date: string
  processed: boolean
  achievements: { id: string; title: string }[]
}

export default function Journal() {
  // const { data: session } = useSession()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/journal?limit=20')
      const data = await response.json()
      setEntries(data.entries || [])
      
      // Extract all unique tags
      const tags = new Set<string>()
      data.entries?.forEach((entry: JournalEntry) => {
        entry.tags.forEach(tag => tags.add(tag))
      })
      setAllTags(Array.from(tags))
    } catch (error) {
      console.error('Error fetching entries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitEntry = async (data: { title?: string; content: string; tags: string[] }) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const newEntry = await response.json()
        setEntries(prev => [newEntry, ...prev])
        setShowNewEntry(false)
        
        // Update tags
        const newTags = new Set([...allTags, ...data.tags])
        setAllTags(Array.from(newTags))
      }
    } catch (error) {
      console.error('Error creating entry:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyzeEntry = async (_content: string) => {
    try {
      setIsAnalyzing(true)
      // This would typically analyze the current entry being written
      // For now, we'll just simulate the analysis
      await new Promise(resolve => setTimeout(resolve, 3000))
    } catch (error) {
      console.error('Error analyzing entry:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAnalyzeExistingEntry = async (entryId: string) => {
    try {
      setIsAnalyzing(true)
      const response = await fetch(`/api/journal/${entryId}/analyze`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        // Update the entry to show it's been processed
        setEntries(prev => 
          prev.map(entry => 
            entry.id === entryId 
              ? { ...entry, processed: true, achievements: data.achievements }
              : entry
          )
        )
      }
    } catch (error) {
      console.error('Error analyzing entry:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Filter entries based on search and tag
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchQuery || 
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.title?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTag = !selectedTag || entry.tags.includes(selectedTag)
    
    return matchesSearch && matchesTag
  })

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">Journal</h1>
            <p className="text-dark-text-muted mt-1">
              Track your daily achievements and let AI extract your wins
            </p>
          </div>
          <Button 
            onClick={() => setShowNewEntry(!showNewEntry)}
            className="flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>{showNewEntry ? 'Cancel' : 'New Entry'}</span>
          </Button>
        </div>

        {/* New Entry Form */}
        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <JournalEntryForm
                  onSubmit={handleSubmitEntry}
                  onAIAnalyze={handleAnalyzeEntry}
                  isLoading={isLoading}
                  isAnalyzing={isAnalyzing}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-dark-text-muted" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-3 py-2 bg-dark-surface border border-dark-border rounded-xl text-dark-text focus:outline-none focus:ring-2 focus:ring-dark-accent"
                >
                  <option value="">All tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entries List */}
        <div className="space-y-6">
          {isLoading && entries.length === 0 ? (
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
          ) : filteredEntries.length > 0 ? (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card hover>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {entry.title || 'Untitled Entry'}
                          </CardTitle>
                          <p className="text-sm text-dark-text-muted mt-1">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        {!entry.processed && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleAnalyzeExistingEntry(entry.id)}
                            disabled={isAnalyzing}
                            className="flex items-center space-x-1"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Analyze</span>
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-dark-text-muted mb-4 whitespace-pre-wrap">
                        {entry.content}
                      </p>
                      
                      {/* Tags */}
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {entry.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-dark-surface-light text-dark-text text-xs rounded-lg"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Achievements */}
                      {entry.achievements.length > 0 && (
                        <div className="border-t border-dark-border pt-4">
                          <h4 className="text-sm font-medium text-dark-text mb-2 flex items-center">
                            <Sparkles className="w-4 h-4 mr-1 text-dark-success" />
                            AI-Extracted Achievements ({entry.achievements.length})
                          </h4>
                          <div className="space-y-2">
                            {entry.achievements.map(achievement => (
                              <div
                                key={achievement.id}
                                className="text-sm text-dark-text-muted bg-dark-surface-light p-2 rounded-lg"
                              >
                                {achievement.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.processed && entry.achievements.length === 0 && (
                        <div className="border-t border-dark-border pt-4">
                          <p className="text-sm text-dark-text-muted italic">
                            No specific achievements were extracted from this entry.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-dark-text-disabled mx-auto mb-4" />
                <h3 className="text-lg font-medium text-dark-text mb-2">
                  {searchQuery || selectedTag ? 'No matching entries' : 'No journal entries yet'}
                </h3>
                <p className="text-dark-text-muted mb-6">
                  {searchQuery || selectedTag 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start documenting your daily achievements and career journey.'
                  }
                </p>
                {!searchQuery && !selectedTag && (
                  <Button onClick={() => setShowNewEntry(true)}>
                    Write your first entry
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}