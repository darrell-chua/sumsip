'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useAuth } from '@/contexts/AuthContext'
import { useCompany } from '@/contexts/CompanyContext'
import { Button } from '@/components/ui/Button'
import { getLocalStorage } from '@/lib/utils'

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const { selectedCompany } = useCompany()
  const router = useRouter()
  
  const [transactions, setTransactions] = useState([])
  const [chartPeriod, setChartPeriod] = useState('daily')
  const [selectedCategories, setSelectedCategories] = useState([])

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
      setTransactions(saved)
    }
  }

  // Calculate financial metrics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const netProfit = totalIncome - totalExpenses

  // Calculate growth (comparing with previous period - simplified)
  const recentTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return transactionDate >= sevenDaysAgo
  })
  
  const recentIncome = recentTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  // Generate chart data based on period
  const getChartData = () => {
    if (transactions.length === 0) return []

    const groupedData = {}
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date)
      let key = ''
      
      if (chartPeriod === 'daily') {
        key = date.toISOString().split('T')[0] // YYYY-MM-DD
      } else if (chartPeriod === 'weekly') {
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
        key = weekStart.toISOString().split('T')[0]
      } else if (chartPeriod === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      }
      
      if (!groupedData[key]) {
        groupedData[key] = { 
          date: key, 
          income: 0, 
          expenses: 0, 
          profit: 0 
        }
      }
      
      if (transaction.type === 'income') {
        groupedData[key].income += transaction.amount
      } else {
        groupedData[key].expenses += transaction.amount
      }
      
      groupedData[key].profit = groupedData[key].income - groupedData[key].expenses
    })
    
    return Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  // Generate category comparison data for last 3 months
  const getCategoryComparisonData = () => {
    if (transactions.length === 0) return []

    // Get last 3 months
    const now = new Date()
    const months = []
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        name: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      })
    }

    // Group transactions by category and month
    const categoryData = {}
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      // Only include transactions from last 3 months
      if (!months.find(m => m.key === monthKey)) return
      
      const category = transaction.category || transaction.type
      
      if (!categoryData[category]) {
        categoryData[category] = {
          category: category,
          ...months.reduce((acc, month) => ({ ...acc, [month.name]: 0 }), {})
        }
      }
      
      const monthName = months.find(m => m.key === monthKey)?.name
      if (monthName) {
        categoryData[category][monthName] += transaction.amount
      }
    })

    const allData = Object.values(categoryData)
    
    // Filter by selected categories if any are selected
    if (selectedCategories.length > 0) {
      return allData.filter(item => selectedCategories.includes(item.category))
    }
    
    return allData
  }

  // Get all unique categories from transactions
  const getAllCategories = () => {
    const categories = transactions
      .map(t => t.category || t.type)
      .filter((category, index, self) => category && self.indexOf(category) === index)
      .sort()
    return categories
  }

  // Handle category selection
  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  // Select all categories
  const selectAllCategories = () => {
    setSelectedCategories(getAllCategories())
  }

  // Clear category selection
  const clearCategorySelection = () => {
    setSelectedCategories([])
  }

  const chartData = getChartData()
  const categoryComparisonData = getCategoryComparisonData()

  // Get the last 3 months for chart colors
  const now = new Date()
  const monthColors = ['#8884d8', '#82ca9d', '#ffc658']

  if (loading || !isAuthenticated) return null

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">
                {selectedCompany ? `Overview of ${selectedCompany.name}` : 'Select a company to view dashboard'}
              </p>
            </div>
            {selectedCompany && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => router.push('/accounts')}>
                  Add Transaction
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {selectedCompany ? (
            <>
              {/* Financial Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
                      <p className="text-2xl font-bold text-green-600">RM{totalIncome.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingDown className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
                      <p className="text-2xl font-bold text-red-600">RM{totalExpenses.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className={`h-8 w-8 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Net Profit</h3>
                      <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        RM{netProfit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Recent Income (7 days)</h3>
                      <p className="text-2xl font-bold text-blue-600">RM{recentIncome.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {transactions.length > 0 ? (
                <>
                  {/* Profit Trend Chart */}
                  <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold">Financial Trends</h2>
                      <div className="flex space-x-2">
                        <select
                          value={chartPeriod}
                          onChange={(e) => setChartPeriod(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => {
                              if (chartPeriod === 'daily') {
                                return new Date(value).toLocaleDateString()
                              }
                              return value
                            }}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value) => [`RM${value.toFixed(2)}`, '']}
                            labelFormatter={(value) => {
                              if (chartPeriod === 'daily') {
                                return new Date(value).toLocaleDateString()
                              }
                              return value
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="income" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            name="Income"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="expenses" 
                            stroke="#EF4444" 
                            strokeWidth={2}
                            name="Expenses"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="profit" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                            name="Profit"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Category Comparison Chart */}
                  {categoryComparisonData.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-lg font-semibold">Category Comparison (Last 3 Months)</h2>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedCategories.length === 0 
                              ? 'Showing all categories' 
                              : `Showing ${selectedCategories.length} selected ${selectedCategories.length === 1 ? 'category' : 'categories'}`}
                          </p>
                        </div>
                        
                        {/* Category Filter Dropdown */}
                        <div className="relative">
                          <details className="group">
                            <summary className="list-none cursor-pointer">
                              <div className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <span className="text-sm font-medium text-gray-700">
                                  Filter Categories
                                </span>
                                <svg className="w-4 h-4 ml-2 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </summary>
                            
                            <div className="absolute right-0 z-10 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg">
                              <div className="p-3">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-sm font-medium text-gray-700">Select Categories</span>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={selectAllCategories}
                                      className="text-xs text-indigo-600 hover:text-indigo-800"
                                    >
                                      All
                                    </button>
                                    <button
                                      onClick={clearCategorySelection}
                                      className="text-xs text-gray-600 hover:text-gray-800"
                                    >
                                      Clear
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="max-h-48 overflow-y-auto space-y-2">
                                  {getAllCategories().map(category => (
                                    <label key={category} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                      <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCategoryToggle(category)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      />
                                      <span className="text-sm text-gray-700">{category}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </details>
                        </div>
                      </div>
                      
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="category" 
                              tick={{ fontSize: 12 }}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip 
                              formatter={(value) => [`RM${value.toFixed(2)}`, '']}
                            />
                            <Legend />
                            {categoryComparisonData.length > 0 && 
                              Object.keys(categoryComparisonData[0])
                                .filter(key => key !== 'category')
                                .map((month, index) => (
                                  <Bar 
                                    key={month}
                                    dataKey={month} 
                                    fill={monthColors[index % monthColors.length]}
                                    name={month}
                                  />
                                ))
                            }
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Recent Transactions */}
                  <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-6">Recent Transactions</h2>
                    <div className="space-y-4">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{transaction.type}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}RM{transaction.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {transactions.length > 5 && (
                      <div className="mt-4 text-center">
                        <Link href="/accounts">
                          <Button variant="outline" size="sm">
                            View All Transactions
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No Financial Data Yet</h2>
                  <p className="text-gray-600 mb-6">
                    Start by adding your first transaction to see your financial overview and charts.
                  </p>
                  <Button onClick={() => router.push('/accounts')}>
                    Add Your First Transaction
                  </Button>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/accounts">
                    <Button variant="outline" className="w-full">
                      Add Transaction
                    </Button>
                  </Link>
                  <Link href="/companies">
                    <Button variant="outline" className="w-full">
                      Manage Companies
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" className="w-full">
                      Profile Settings
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={() => window.print()}>
                    Print Report
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">No Company Selected</h2>
              <p className="text-gray-600 mb-6">Please select or create a company to view the dashboard</p>
              <Button onClick={() => router.push('/companies')}>
                Manage Companies
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}