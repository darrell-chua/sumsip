'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, Search, Filter, Trash2, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCompany } from '@/contexts/CompanyContext'
import { Button } from '@/components/ui/Button'
import { getLocalStorage, setLocalStorage } from '@/lib/utils'

export default function ViewAllRecordsPage() {
  const { isAuthenticated, loading } = useAuth()
  const { selectedCompany } = useCompany()
  const router = useRouter()
  
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (selectedCompany) {
      loadTransactions()
    }
  }, [selectedCompany])

  const loadTransactions = () => {
    if (selectedCompany) {
      const saved = getLocalStorage(`sumsip_transactions_${selectedCompany.id}`, [])
      const sorted = saved.sort((a, b) => new Date(b.date) - new Date(a.date))
      setTransactions(sorted)
    }
  }

  const deleteTransaction = (transactionId) => {
    if (!selectedCompany) {
      alert('Please select a company first')
      return
    }

    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const updatedTransactions = transactions.filter(t => t.id !== transactionId)
      setTransactions(updatedTransactions)
      
      try {
        setLocalStorage(`sumsip_transactions_${selectedCompany.id}`, updatedTransactions)
      } catch (error) {
        console.error('Error saving to localStorage:', error)
        // Fallback to native localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(`sumsip_transactions_${selectedCompany.id}`, JSON.stringify(updatedTransactions))
        }
      }
    }
  }

  // Filter transactions based on search term, type filter, category filter, and date range
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.amount.toString().includes(searchTerm) ||
                         (transaction.category && transaction.category.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === 'all' || transaction.type === filterType
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter
    
    // Date filtering
    let matchesDate = true
    if (dateFrom || dateTo) {
      const transactionDate = new Date(transaction.date)
      if (dateFrom) {
        const fromDate = new Date(dateFrom)
        matchesDate = matchesDate && transactionDate >= fromDate
      }
      if (dateTo) {
        const toDate = new Date(dateTo)
        matchesDate = matchesDate && transactionDate <= toDate
      }
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesDate
  })

  // Get all unique categories from transactions
  const getAllCategories = () => {
    const categories = transactions
      .map(t => t.category)
      .filter((category, index, self) => category && self.indexOf(category) === index)
      .sort()
    return categories
  }

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const netBalance = totalIncome - totalExpenses

  const clearFilters = () => {
    setSearchTerm('')
    setFilterType('all')
    setCategoryFilter('all')
    setDateFrom('')
    setDateTo('')
  }

  if (loading || !isAuthenticated) return null

  if (!selectedCompany) {
    return (
      <div className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No Company Selected</h2>
            <p className="text-gray-600 mb-6">Please select a company to view records</p>
            <Button onClick={() => router.push('/companies')}>
              Go to Companies
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                className="mr-4 flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                  All Transaction Records
                </h1>
                <p className="mt-2 text-gray-600">
                  Complete transaction history for {selectedCompany.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Records</h3>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
              <p className="text-2xl font-bold text-green-600">RM{totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-600">RM{totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Net Balance</h3>
              <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                RM{netBalance.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
            
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions by description, category, or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expenses Only</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Categories</option>
                  {getAllCategories().map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(searchTerm || filterType !== 'all' || categoryFilter !== 'all' || dateFrom || dateTo) && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Active Filters:</strong>
                  {searchTerm && <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Search: "{searchTerm}"</span>}
                  {filterType !== 'all' && <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Type: {filterType}</span>}
                  {categoryFilter !== 'all' && <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Category: {categoryFilter}</span>}
                  {dateFrom && <span className="ml-2 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">From: {dateFrom}</span>}
                  {dateTo && <span className="ml-2 bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">To: {dateTo}</span>}
                </p>
              </div>
            )}
          </div>

          {/* All Transactions Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">All Transactions</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Showing {filteredTransactions.length} of {transactions.length} transactions
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        {transactions.length === 0 
                          ? 'No transactions found.' 
                          : 'No transactions match your search criteria.'}
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {transaction.category || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          RM{transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => deleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete transaction"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}