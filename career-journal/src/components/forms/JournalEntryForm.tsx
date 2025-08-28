'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Tag, Save, Sparkles } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import AIProcessingAnimation from '../ui/AIProcessingAnimation'
import { InlineAIAnimation } from '../ui/AIProcessingAnimation'

const journalEntrySchema = z.object({
  title: z.string().optional(),
  content: z.string().min(10, 'Entry must be at least 10 characters long'),
  tags: z.array(z.string()),
})

type JournalEntryForm = z.infer<typeof journalEntrySchema>

interface JournalEntryFormProps {
  initialData?: Partial<JournalEntryForm>
  onSubmit: (data: JournalEntryForm) => Promise<void>
  onAIAnalyze?: (content: string) => Promise<void>
  isLoading?: boolean
  isAnalyzing?: boolean
}

const predefinedTags = [
  'Research', 'Design', 'Leadership', 'Development', 'Collaboration',
  'Problem Solving', 'Innovation', 'Communication', 'Strategy', 'Learning'
]

export default function JournalEntryForm({
  initialData,
  onSubmit,
  onAIAnalyze,
  isLoading = false,
  isAnalyzing = false
}: JournalEntryFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || [])
  const [customTag, setCustomTag] = useState('')
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<JournalEntryForm>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      tags: selectedTags,
    }
  })

  const content = watch('content')

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty && content && content.length > 10) {
        setAutoSaveStatus('saving')
        // Simulate auto-save (you'd implement actual auto-save here)
        setTimeout(() => setAutoSaveStatus('saved'), 1000)
      }
    }, 5000) // Auto-save every 5 seconds

    return () => clearInterval(interval)
  }, [isDirty, content])

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newTags)
    setValue('tags', newTags, { shouldDirty: true })
  }

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      const newTags = [...selectedTags, customTag.trim()]
      setSelectedTags(newTags)
      setValue('tags', newTags, { shouldDirty: true })
      setCustomTag('')
    }
  }

  const handleFormSubmit = async (data: JournalEntryForm) => {
    await onSubmit({ ...data, tags: selectedTags })
    setAutoSaveStatus('saved')
  }

  const handleAIAnalyze = async () => {
    if (content && onAIAnalyze) {
      await onAIAnalyze(content)
    }
  }

  return (
    <>
      <AIProcessingAnimation 
        isVisible={isAnalyzing} 
        message="AI is extracting achievements from your entry..."
      />
      
      <motion.form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with auto-save status */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-dark-text">
            Journal Entry
          </h2>
          <div className="flex items-center space-x-2 text-sm text-dark-text-muted">
            {autoSaveStatus === 'saving' && (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span>Saving...</span>
              </>
            )}
            {autoSaveStatus === 'saved' && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Saved</span>
              </>
            )}
            {autoSaveStatus === 'unsaved' && (
              <>
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                <span>Unsaved changes</span>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <Input
          {...register('title')}
          label="Title (optional)"
          placeholder="What did you accomplish today?"
          error={errors.title?.message}
        />

        {/* Content */}
        <Textarea
          {...register('content')}
          label="Your Journal Entry"
          placeholder="Describe your day, achievements, challenges, and learnings. Be specific about what you accomplished, who you worked with, and the impact of your work..."
          rows={8}
          error={errors.content?.message}
          helperText="Write in detail about your accomplishments. The AI will help extract achievements and generate resume-worthy bullets."
        />

        {/* Tags */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-dark-text">
            <Tag className="inline w-4 h-4 mr-1" />
            Categories
          </label>
          
          {/* Predefined tags */}
          <div className="flex flex-wrap gap-2">
            {predefinedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`
                  px-3 py-1 rounded-full text-sm transition-all duration-200
                  ${selectedTags.includes(tag)
                    ? 'bg-dark-accent text-white'
                    : 'bg-dark-surface border border-dark-border text-dark-text-muted hover:bg-dark-surface-light'
                  }
                `}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Custom tag input */}
          <div className="flex space-x-2">
            <Input
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Add custom tag..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddCustomTag}
              disabled={!customTag.trim()}
            >
              Add
            </Button>
          </div>

          {/* Selected tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-dark-accent text-white text-sm rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            isLoading={isLoading}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </Button>

          {onAIAnalyze && content && content.length > 50 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleAIAnalyze}
              disabled={isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <InlineAIAnimation isVisible={true} size="sm" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'AI Analyze'}
            </Button>
          )}
        </div>
      </motion.form>
    </>
  )
}