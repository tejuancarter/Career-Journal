'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The sign in link is no longer valid. It may have been used already or expired.',
  Default: 'An error occurred during sign in.',
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')
  
  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="min-h-screen bg-dark-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-dark-error" />
              <CardTitle className="text-dark-error">Authentication Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-dark-text-muted mb-6">
              {errorMessage}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/auth/signin')}
                className="w-full"
              >
                Try signing in again
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="animate-pulse text-dark-text">Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}