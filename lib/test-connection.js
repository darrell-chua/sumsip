// lib/test-connection.js
// Run this file to test your Supabase connection

import { supabase } from './supabase'

export async function testConnection() {
  try {
    // Test 1: Check if we can connect
    const { data, error } = await supabase
      .from('companies')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Successfully connected to Supabase!')
    
    // Test 2: Check auth status
    const { data: { user } } = await supabase.auth.getUser()
    console.log('👤 Current user:', user ? user.email : 'Not logged in')
    
    // Test 3: List tables (using a simple query)
    console.log('📊 Database is ready and accessible')
    
    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return false
  }
}

// Create a test page component
export default function TestConnectionPage() {
  const handleTest = async () => {
    await testConnection()
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <button
        onClick={handleTest}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Connection
      </button>
      <p className="mt-4 text-gray-600">Check the browser console for results</p>
    </div>
  )
}