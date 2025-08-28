'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles, Download } from 'lucide-react'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="animate-pulse text-dark-text">Loading...</div>
      </div>
    )
  }

  if (status === 'authenticated') {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-dark-background text-dark-text">
      {/* Header */}
      <header className="absolute top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-dark-accent" />
              <span className="text-xl font-semibold">Career Journal</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                onClick={() => router.push('/auth/signin')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Your Career Journey,{' '}
              <span className="text-dark-accent">AI-Powered</span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-dark-text-muted max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform daily experiences into career achievements. 
              Let AI extract your wins and build your professional story.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button 
                size="lg"
                onClick={() => router.push('/auth/signin')}
                className="px-8 py-4 text-lg"
              >
                Start Journaling
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                className="px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-dark-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-dark-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Journaling</h3>
              <p className="text-dark-text-muted">
                Capture your daily accomplishments, challenges, and learnings with our intuitive interface.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-dark-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-dark-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-dark-text-muted">
                Our AI identifies achievements and transforms them into compelling STAR-format stories.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-dark-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-dark-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resume Export</h3>
              <p className="text-dark-text-muted">
                Generate ATS-friendly resume bullets and export professional PDFs with one click.
              </p>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <div className="bg-dark-surface py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Ready to Accelerate Your Career?
            </motion.h2>
            <motion.p
              className="text-lg text-dark-text-muted mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              Join thousands of professionals who are already tracking their achievements and building better careers.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Button 
                size="lg"
                onClick={() => router.push('/auth/signin')}
                className="px-8 py-4 text-lg"
              >
                Get Started Free
              </Button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-dark-accent" />
              <span className="font-semibold">Career Journal</span>
            </div>
            <p className="text-sm text-dark-text-muted">
              © 2024 Career Journal. Built with AI for career growth.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
