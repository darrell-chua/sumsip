// lib/services/accounts.service.js
import { supabase } from '@/lib/supabase'

export const accountsService = {
  // Get all accounts for a company
  async getAccounts(companyId) {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select(`
          *,
          category:account_categories(id, name, type)
        `)
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('name')

      if (error) throw error

      return { accounts: data, error: null }
    } catch (error) {
      console.error('Get accounts error:', error)
      return { accounts: [], error: error.message }
    }
  },

  // Create account
  async createAccount(accountData) {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert({
          ...accountData,
          current_balance: accountData.initial_balance || 0
        })
        .select()
        .single()

      if (error) throw error

      return { account: data, error: null }
    } catch (error) {
      console.error('Create account error:', error)
      return { account: null, error: error.message }
    }
  },

  // Update account
  async updateAccount(accountId, updates) {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', accountId)
        .select()
        .single()

      if (error) throw error

      return { account: data, error: null }
    } catch (error) {
      console.error('Update account error:', error)
      return { account: null, error: error.message }
    }
  },

  // Delete account (soft delete)
  async deleteAccount(accountId) {
    try {
      const { error } = await supabase
        .from('accounts')
        .update({ is_active: false })
        .eq('id', accountId)

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Delete account error:', error)
      return { error: error.message }
    }
  },

  // Get account balance history
  async getAccountBalanceHistory(accountId, days = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .eq('account_id', accountId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date')

      if (error) throw error

      // Get initial balance
      const { data: account } = await supabase
        .from('accounts')
        .select('initial_balance')
        .eq('id', accountId)
        .single()

      // Calculate running balance
      let balance = parseFloat(account?.initial_balance || 0)
      const history = []

      // Get all transactions before start date to calculate starting balance
      const { data: previousTransactions } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('account_id', accountId)
        .lt('date', startDate.toISOString().split('T')[0])

      previousTransactions?.forEach(t => {
        balance += t.type === 'income' ? parseFloat(t.amount) : -parseFloat(t.amount)
      })

      // Build daily balance history
      const dailyBalances = {}
      let currentBalance = balance

      transactions.forEach(t => {
        const date = t.date
        if (!dailyBalances[date]) {
          dailyBalances[date] = currentBalance
        }
        currentBalance += t.type === 'income' ? parseFloat(t.amount) : -parseFloat(t.amount)
        dailyBalances[date] = currentBalance
      })

      // Convert to array
      Object.keys(dailyBalances).forEach(date => {
        history.push({
          date,
          balance: dailyBalances[date]
        })
      })

      return { history, error: null }
    } catch (error) {
      console.error('Get balance history error:', error)
      return { history: [], error: error.message }
    }
  },

  // Get account summary
  async getAccountSummary(companyId) {
    try {
      const { data: accounts, error } = await supabase
        .from('accounts')
        .select('type, current_balance')
        .eq('company_id', companyId)
        .eq('is_active', true)

      if (error) throw error

      // Summarize by type
      const summary = accounts.reduce((acc, account) => {
        const type = account.type
        if (!acc[type]) {
          acc[type] = {
            count: 0,
            total_balance: 0
          }
        }
        acc[type].count += 1
        acc[type].total_balance += parseFloat(account.current_balance)
        return acc
      }, {})

      // Calculate total assets and liabilities
      const totalAssets = Object.entries(summary)
        .filter(([type]) => ['cash', 'bank', 'asset'].includes(type))
        .reduce((sum, [_, data]) => sum + data.total_balance, 0)

      const totalLiabilities = Object.entries(summary)
        .filter(([type]) => ['credit_card', 'liability'].includes(type))
        .reduce((sum, [_, data]) => sum + Math.abs(data.total_balance), 0)

      return {
        summary: {
          ...summary,
          total_assets: totalAssets,
          total_liabilities: totalLiabilities,
          net_worth: totalAssets - totalLiabilities
        },
        error: null
      }
    } catch (error) {
      console.error('Get account summary error:', error)
      return { summary: null, error: error.message }
    }
  },

  // Transfer between accounts
  async transferBetweenAccounts(fromAccountId, toAccountId, amount, description) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // Get both accounts to ensure they belong to same company
      const { data: accounts } = await supabase
        .from('accounts')
        .select('id, company_id')
        .in('id', [fromAccountId, toAccountId])

      if (accounts.length !== 2 || accounts[0].company_id !== accounts[1].company_id) {
        throw new Error('Invalid accounts for transfer')
      }

      const companyId = accounts[0].company_id

      // Create two transactions - expense from source, income to destination
      const transactions = [
        {
          company_id: companyId,
          account_id: fromAccountId,
          type: 'expense',
          amount: amount,
          date: new Date().toISOString().split('T')[0],
          description: `Transfer to account: ${description}`,
          created_by: user.id
        },
        {
          company_id: companyId,
          account_id: toAccountId,
          type: 'income',
          amount: amount,
          date: new Date().toISOString().split('T')[0],
          description: `Transfer from account: ${description}`,
          created_by: user.id
        }
      ]

      const { error } = await supabase
        .from('transactions')
        .insert(transactions)

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Transfer error:', error)
      return { error: error.message }
    }
  }
}