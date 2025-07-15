'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useCompany } from '@/contexts/CompanyContext'
import { useReports } from '@/contexts/ReportsContext'

export default function TestContextsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { companies, selectedCompany, loading: companyLoading } = useCompany()
  const { savedReports, scheduledReports, loading: reportsLoading } = useReports()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Updated Contexts</h1>
      
      {/* Auth Context Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Auth Context</h2>
        <div className="space-y-1 text-sm">
          <p>Loading: {authLoading ? 'Yes' : 'No'}</p>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {user?.email || 'Not logged in'}</p>
        </div>
      </div>

      {/* Company Context Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Company Context</h2>
        <div className="space-y-1 text-sm">
          <p>Loading: {companyLoading ? 'Yes' : 'No'}</p>
          <p>Companies: {companies.length}</p>
          <p>Selected: {selectedCompany?.name || 'None'}</p>
          {companies.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">All Companies:</p>
              <ul className="ml-4">
                {companies.map(company => (
                  <li key={company.id} className="text-xs">
                    • {company.name} {company.id === selectedCompany?.id && '(selected)'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Reports Context Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Reports Context</h2>
        <div className="space-y-1 text-sm">
          <p>Loading: {reportsLoading ? 'Yes' : 'No'}</p>
          <p>Saved Reports: {savedReports.length}</p>
          <p>Scheduled Reports: {scheduledReports.length}</p>
        </div>
      </div>

      {/* Overall Status */}
      <div className="p-4 bg-blue-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Overall Status</h2>
        {!isAuthenticated ? (
          <p className="text-sm">
            User is not authenticated. Contexts are waiting for login.
            This is normal if you haven't set up authentication yet.
          </p>
        ) : (
          <div className="text-sm space-y-1">
            <p>✅ Auth context is working</p>
            <p>{companies.length > 0 ? '✅' : '⏳'} Company context: {companies.length > 0 ? 'Has companies' : 'No companies yet'}</p>
            <p>✅ Reports context is ready</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-100 rounded">
        <p className="text-sm">
          <strong>Note:</strong> If you see "Not logged in", you need to either:
        </p>
        <ul className="text-sm mt-2 list-disc ml-5">
          <li>Implement Supabase Auth in your login page</li>
          <li>Create a test user directly in Supabase</li>
          <li>Keep using your current auth (we'll handle that in migration)</li>
        </ul>
      </div>
    </div>
  )
}