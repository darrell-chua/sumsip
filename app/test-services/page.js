'use client'
import { useState } from 'react'
import { authService, companiesService, transactionsService, accountsService } from '@/lib/services'

export default function TestServicesPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const addResult = (test, success, message) => {
    setResults(prev => [...prev, { test, success, message, timestamp: new Date().toISOString() }])
  }

  const runTests = async () => {
    setLoading(true)
    setResults([])

    try {
      // Test 1: Check current user
      addResult('Check Current User', true, 'Starting test...')
      const { user, profile } = await authService.getCurrentUser()
      if (user) {
        addResult('Current User', true, `Logged in as: ${user.email}`)
      } else {
        addResult('Current User', false, 'No user logged in')
      }

      // Test 2: Get companies
      addResult('Get Companies', true, 'Fetching companies...')
      const { companies, error: companiesError } = await companiesService.getUserCompanies()
      if (companiesError) {
        addResult('Get Companies', false, companiesError)
      } else {
        addResult('Get Companies', true, `Found ${companies.length} companies`)
      }

      // Test 3: If we have a company, test transactions
      if (companies && companies.length > 0) {
        const testCompany = companies[0]
        addResult('Test Company', true, `Using company: ${testCompany.name}`)

        // Get categories
        const { categories } = await transactionsService.getCategories(testCompany.id)
        addResult('Get Categories', true, `Found ${categories.length} categories`)

        // Get transactions
        const { transactions } = await transactionsService.getTransactions(testCompany.id)
        addResult('Get Transactions', true, `Found ${transactions.length} transactions`)

        // Get accounts
        const { accounts } = await accountsService.getAccounts(testCompany.id)
        addResult('Get Accounts', true, `Found ${accounts.length} accounts`)

        // Get financial summary
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
        const { summary } = await transactionsService.getFinancialSummary(
          testCompany.id,
          startDate.toISOString().split('T')[0],
          new Date().toISOString().split('T')[0]
        )
        addResult('Financial Summary', true, `Income: ${summary.total_income}, Expenses: ${summary.total_expenses}`)
      }

      addResult('All Tests', true, 'All tests completed!')
    } catch (error) {
      addResult('Test Error', false, error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Supabase Services</h1>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 mb-6"
      >
        {loading ? 'Running Tests...' : 'Run Tests'}
      </button>

      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded ${
              result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <div className="font-medium">
              {result.success ? '✅' : '❌'} {result.test}
            </div>
            <div className="text-sm">{result.message}</div>
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <p className="text-gray-600">Click "Run Tests" to test your services</p>
      )}
    </div>
  )
}