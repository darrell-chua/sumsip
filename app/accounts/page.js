'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Search, Filter, Download, X, Calendar, Eye } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { Button } from '@/components/ui/Button'
import { getLocalStorage, setLocalStorage } from '@/lib/utils'
import { transactionsService } from '@/lib/services/transactions.service'

export default function AccountsPage() {
  const { selectedCompany } = useCompany()
  const router = useRouter()
  
  const [transactions, setTransactions] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('all')
  
  // Form data for adding transaction (simplified to 5 fields)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    type: 'income',
    category: '',
    description: ''
  })

  useEffect(() => {
    // Remove any authentication checks, redirects, or logic
    // Show accounts for a single user
    if (selectedCompany) {
      loadTransactions()
    }
  }, [selectedCompany])

  // Load transactions
  const loadTransactions = async () => {
    if (selectedCompany) {
      const { transactions } = await transactionsService.getTransactions(selectedCompany.id)
      setTransactions(transactions || [])
    }
  }

  // Add transaction
  const addTransaction = async (e) => {
    e.preventDefault()
    if (!selectedCompany) {
      alert('Please select a company first')
      return
    }
    const newTransaction = {
      company_id: selectedCompany.id,
      date: formData.date,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      description: formData.description,
      created_at: new Date().toISOString()
    }
    const { transaction, error } = await transactionsService.createTransaction(newTransaction)
    if (error) {
      alert('Error adding transaction: ' + error)
      return
    }
    await loadTransactions()
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      type: 'income',
      category: '',
      description: ''
    })
  }

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Get all unique categories from transactions
  const getAllCategories = () => {
    const categories = transactions
      .map(t => t.category)
      .filter((category, index, self) => category && self.indexOf(category) === index)
      .sort()
    return categories
  }

  // Filter transactions by selected category
  const getFilteredTransactions = () => {
    if (categoryFilter === 'all') {
      return transactions.slice(0, 10)
    }
    return transactions
      .filter(t => t.category === categoryFilter)
      .slice(0, 10)
  }

  // Delete transaction
  const deleteTransaction = async (transactionId) => {
    if (!selectedCompany) {
      alert('Please select a company first')
      return
    }

    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await transactionsService.deleteTransaction(transactionId)
      await loadTransactions()
    }
  }

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            NEW - Accounts
          </h1>
          <p className="mt-2 text-gray-600">Manage your financial transactions</p>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {selectedCompany ? (
            <>
              {/* Add Transaction Form */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Transaction
                </h2>
                
                <form onSubmit={addTransaction} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleFormChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        placeholder="e.g., Sales, Utilities, Rent, Marketing"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        placeholder="Transaction description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Button type="submit" className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Transaction
                    </Button>
                  </div>
                </form>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">Recent Transactions</h2>
                      {transactions.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          {categoryFilter === 'all' 
                            ? 'Showing latest 10 transactions' 
                            : `Showing transactions for "${categoryFilter}" category`}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => router.push('/accounts/view-all')}
                      variant="outline"
                      className="flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View All Records
                    </Button>
                  </div>

                  {/* Category Filter */}
                  {getAllCategories().length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter by Category
                      </label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="all">All Categories</option>
                        {getAllCategories().map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
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
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            No transactions yet. Add your first transaction above.
                          </td>
                        </tr>
                      ) : getFilteredTransactions().length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            No transactions found for "{categoryFilter}" category.
                          </td>
                        </tr>
                      ) : (
                        getFilteredTransactions().map((transaction) => (
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
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">No Company Selected</h2>
              <p className="text-gray-600 mb-6">Please select a company to manage accounts</p>
              <Button onClick={() => router.push('/companies')}>
                Go to Companies
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}