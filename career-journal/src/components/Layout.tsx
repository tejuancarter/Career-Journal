'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  LayoutDashboard, 
  PenTool, 
  Award, 
  Download, 
  User, 
  // LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import Button from './ui/Button'
import ThemeToggle from './ui/ThemeToggle'

interface LayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Journal', href: '/journal', icon: PenTool },
  { name: 'Achievements', href: '/achievements', icon: Award },
  { name: 'Resume', href: '/resume', icon: Download },
]

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="animate-pulse text-dark-text">Loading...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-dark-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-dark-surface border-r border-dark-border overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <BookOpen className="w-8 h-8 text-dark-accent" />
            <span className="ml-2 text-xl font-semibold text-dark-text">Career Journal</span>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <motion.button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left
                    ${isActive
                      ? 'bg-dark-accent text-white'
                      : 'text-dark-text-muted hover:bg-dark-surface-light hover:text-dark-text'
                    }
                  `}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-dark-text-disabled'
                    }`}
                  />
                  {item.name}
                </motion.button>
              )
            })}
          </nav>

          {/* User section */}
          <div className="flex-shrink-0 flex border-t border-dark-border p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                {session?.user?.image ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    // eslint-disable-next-line @next/next/no-img-element
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-dark-accent flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-dark-text truncate">
                  {session?.user?.name || session?.user?.email}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="mt-1 p-0 h-auto text-xs text-dark-text-muted hover:text-dark-text"
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-dark-surface border-b border-dark-border">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-dark-accent" />
            <span className="text-lg font-semibold text-dark-text">Career Journal</span>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 flex flex-col w-64 bg-dark-surface border-r border-dark-border"
            >
              <div className="flex items-center h-16 px-4 border-b border-dark-border">
                <BookOpen className="w-6 h-6 text-dark-accent" />
                <span className="ml-2 text-lg font-semibold text-dark-text">Career Journal</span>
              </div>
              
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        router.push(item.href)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`
                        group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left
                        ${isActive
                          ? 'bg-dark-accent text-white'
                          : 'text-dark-text-muted hover:bg-dark-surface-light hover:text-dark-text'
                        }
                      `}
                    >
                      <item.icon
                        className={`mr-3 flex-shrink-0 h-5 w-5 ${
                          isActive ? 'text-white' : 'text-dark-text-disabled'
                        }`}
                      />
                      {item.name}
                    </button>
                  )
                })}
              </nav>

              <div className="border-t border-dark-border p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {session?.user?.image ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        // eslint-disable-next-line @next/next/no-img-element
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-dark-accent flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-dark-text truncate">
                      {session?.user?.name || session?.user?.email}
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="mt-1 text-xs text-dark-text-muted hover:text-dark-text"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}