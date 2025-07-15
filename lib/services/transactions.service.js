// lib/services/transactions.service.js
import { supabase } from '@/lib/supabase'

export const transactionsService = {
  // Get transactions for a company
  async getTransactions(companyId, filters = {}) {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          category:transaction_categories(id, name, type, color),
          account:accounts(id, name, type)
        `)
        .eq('company_id', companyId)
        .order('date', { ascending: false })

      // Apply filters
      if (filters.startDate) {
        query = query.gte('date', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('date', filters.endDate)
      }
      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId)
      }
      if (filters.accountId) {
        query = query.eq('account_id', filters.accountId)
      }

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit)
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error, count } = await query

      if (error) throw error

      return { transactions: data, count, error: null }
    } catch (error) {
      console.error('Get transactions error:', error)
      return { transactions: [], count: 0, error: error.message }
    }
  },

  // Create transaction
  async createTransaction(transactionData) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transactionData,
          created_by: user.id
        })
        .select(`
          *,
          category:transaction_categories(id, name, type, color),
          account:accounts(id, name, type)
        `)
        .single()

      if (error) throw error

      return { transaction: data, error: null }
    } catch (error) {
      console.error('Create transaction error:', error)
      return { transaction: null, error: error.message }
    }
  },

  // Update transaction
  async updateTransaction(transactionId, updates) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', transactionId)
        .select(`
          *,
          category:transaction_categories(id, name, type, color),
          account:accounts(id, name, type)
        `)
        .single()

      if (error) throw error

      return { transaction: data, error: null }
    } catch (error) {
      console.error('Update transaction error:', error)
      return { transaction: null, error: error.message }
    }
  },

  // Delete transaction
  async deleteTransaction(transactionId) {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Delete transaction error:', error)
      return { error: error.message }
    }
  },

  // Get transaction categories
  async getCategories(companyId, type = null) {
    try {
      let query = supabase
        .from('transaction_categories')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('name')

      if (type) {
        query = query.eq('type', type)
      }

      const { data, error } = await query

      if (error) throw error

      return { categories: data, error: null }
    } catch (error) {
      console.error('Get categories error:', error)
      return { categories: [], error: error.message }
    }
  },

  // Create category
  async createCategory(companyId, categoryData) {
    try {
      const { data, error } = await supabase
        .from('transaction_categories')
        .insert({
          company_id: companyId,
          ...categoryData
        })
        .select()
        .single()

      if (error) throw error

      return { category: data, error: null }
    } catch (error) {
      console.error('Create category error:', error)
      return { category: null, error: error.message }
    }
  },

  // Get financial summary
  async getFinancialSummary(companyId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .rpc('get_financial_summary', {
          p_company_id: companyId,
          p_start_date: startDate,
          p_end_date: endDate
        })

      if (error) throw error

      return { 
        summary: data[0] || {
          total_income: 0,
          total_expenses: 0,
          net_profit: 0,
          transaction_count: 0
        }, 
        error: null 
      }
    } catch (error) {
      console.error('Get financial summary error:', error)
      return { summary: null, error: error.message }
    }
  },

  // Get transactions by category
  async getTransactionsByCategory(companyId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          amount,
          type,
          category:transaction_categories(name)
        `)
        .eq('company_id', companyId)
        .gte('date', startDate)
        .lte('date', endDate)

      if (error) throw error

      // Group by category
      const grouped = data.reduce((acc, transaction) => {
        const categoryName = transaction.category?.name || 'Uncategorized'
        const type = transaction.type

        if (!acc[type]) acc[type] = {}
        if (!acc[type][categoryName]) acc[type][categoryName] = 0

        acc[type][categoryName] += parseFloat(transaction.amount)
        return acc
      }, { income: {}, expense: {} })

      return { data: grouped, error: null }
    } catch (error) {
      console.error('Get transactions by category error:', error)
      return { data: null, error: error.message }
    }
  },

  // Bulk import transactions
  async bulkImportTransactions(companyId, transactions) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // Add company_id and created_by to each transaction
      const transactionsWithMeta = transactions.map(t => ({
        ...t,
        company_id: companyId,
        created_by: user.id
      }))

      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionsWithMeta)
        .select()

      if (error) throw error

      return { transactions: data, error: null }
    } catch (error) {
      console.error('Bulk import error:', error)
      return { transactions: [], error: error.message }
    }
  }
}