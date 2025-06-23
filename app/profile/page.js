'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { User } from 'lucide-react'

export default function ProfilePage() {
  const { user, isAuthenticated, loading, updateProfile } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [bugReport, setBugReport] = useState({
    title: '',
    description: ''
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || ''
      })
    }
  }, [user, isAuthenticated, loading, router])

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    alert('Profile updated successfully!')
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    alert('Password changed successfully!')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleBugSubmit = (e) => {
    e.preventDefault()
    alert('Bug report submitted. Thank you!')
    setBugReport({ title: '', description: '' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBugChange = (e) => {
    const { name, value } = e.target
    setBugReport(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading || !isAuthenticated) return null

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'security', label: 'Security Settings' },
    { id: 'bug', label: 'Report Bug' }
  ]

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account settings</p>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
                  <p className="text-gray-600 mb-6">Update your account information</p>

                  <div className="flex items-center mb-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mr-6">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-md">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <Button type="submit">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Security Settings</h2>
                  <p className="text-gray-600 mb-6">Manage your password and security preferences</p>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <Button type="submit">
                        Change Password
                      </Button>
                    </div>
                  </form>
                  
                  <div className="border-t border-gray-200 mt-8 pt-8 max-w-md">
                    <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                    <p className="text-gray-600 mb-4">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <Button variant="outline">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'bug' && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Report a Bug</h2>
                  <p className="text-gray-600 mb-6">Help us improve by reporting any issues you encounter</p>
                  
                  <form onSubmit={handleBugSubmit} className="space-y-6 max-w-lg">
                    <div>
                      <label htmlFor="bugTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Bug Title
                      </label>
                      <input
                        type="text"
                        id="bugTitle"
                        name="title"
                        value={bugReport.title}
                        onChange={handleBugChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Brief description of the issue"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bugDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="bugDescription"
                        name="description"
                        value={bugReport.description}
                        onChange={handleBugChange}
                        rows="6"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Please provide detailed information about the bug..."
                        required
                      />
                    </div>
                    
                    <div>
                      <Button type="submit">
                        Submit Bug Report
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}