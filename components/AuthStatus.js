// components/AuthStatus.js
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export function AuthStatus() {
  const { user, isAuthenticated } = useAuth()

  const createTestUser = async () => {
    const email = 'test@sumsip.com'
    const password = 'testpassword123'
    
    try {
      // Try to sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error && error.message.includes('already registered')) {
        // User exists, try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (signInError) {
          alert('Error signing in: ' + signInError.message)
        } else {
          alert('Signed in as test user!')
          window.location.reload()
        }
      } else if (error) {
        alert('Error creating test user: ' + error.message)
      } else {
        alert('Test user created! You may need to confirm the email.')
        // Try to sign in immediately
        await supabase.auth.signInWithPassword({ email, password })
        window.location.reload()
      }
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (isAuthenticated) {
    return (
      <div className="fixed bottom-4 left-4 bg-green-100 p-4 rounded shadow-lg z-50">
        <p className="text-sm font-medium">Signed in as: {user?.email}</p>
        <button
          onClick={signOut}
          className="mt-2 text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 bg-yellow-100 p-4 rounded shadow-lg z-50">
      <p className="text-sm font-medium mb-2">Not authenticated</p>
      <button
        onClick={createTestUser}
        className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Create Test User
      </button>
    </div>
  )
}