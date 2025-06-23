'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Settings, HelpCircle, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

export function UserNav({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-x-1 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="sr-only">Open user menu</span>
        <div className="relative h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <User className="h-5 w-5 text-gray-600" />
          )}
        </div>
        <span className="hidden md:flex md:items-center">
          <span className="ml-1.5 text-sm font-medium text-gray-700 hover:text-gray-800">
            {user?.name || 'User'}
          </span>
          <ChevronDown className="ml-1 h-4 w-4 text-gray-400" aria-hidden="true" />
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="text-sm">Signed in as</p>
              <p className="truncate text-sm font-medium text-gray-900">{user?.email}</p>
            </div>
            <div className="py-1">
              <Link
                href="/profile"
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </div>
            <div className="border-t border-gray-100 py-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}