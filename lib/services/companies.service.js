// lib/services/companies.service.js
import { supabase } from '@/lib/supabase'

export const companiesService = {
  // Get all companies for current user
  async getUserCompanies() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('user_companies')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Flatten the data structure
      const companies = data.map(item => ({
        ...item.company,
        role: item.role,
        is_default: item.is_default,
        user_company_id: item.id
      }))

      return { companies, error: null }
    } catch (error) {
      console.error('Get user companies error:', error)
      return { companies: [], error: error.message }
    }
  },

  // Create new company
  async createCompany(companyData) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // Start a Supabase transaction
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          ...companyData,
          created_by: user.id
        })
        .select()
        .single()

      if (companyError) throw companyError

      // Add user as owner of the company
      const { error: userCompanyError } = await supabase
        .from('user_companies')
        .insert({
          user_id: user.id,
          company_id: company.id,
          role: 'owner',
          is_default: true // Make it default if it's the first company
        })

      if (userCompanyError) throw userCompanyError

      // Create default categories for the company
      const { error: categoriesError } = await supabase
        .rpc('create_default_categories_for_company', {
          company_id: company.id
        })

      if (categoriesError) throw categoriesError

      return { company, error: null }
    } catch (error) {
      console.error('Create company error:', error)
      return { company: null, error: error.message }
    }
  },

  // Update company
  async updateCompany(companyId, updates) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', companyId)
        .select()
        .single()

      if (error) throw error

      return { company: data, error: null }
    } catch (error) {
      console.error('Update company error:', error)
      return { company: null, error: error.message }
    }
  },

  // Delete company
  async deleteCompany(companyId) {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId)

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Delete company error:', error)
      return { error: error.message }
    }
  },

  // Set default company
  async setDefaultCompany(companyId) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // First, unset all as default
      await supabase
        .from('user_companies')
        .update({ is_default: false })
        .eq('user_id', user.id)

      // Then set the selected one as default
      const { error } = await supabase
        .from('user_companies')
        .update({ is_default: true })
        .eq('user_id', user.id)
        .eq('company_id', companyId)

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Set default company error:', error)
      return { error: error.message }
    }
  },

  // Invite user to company
  async inviteUserToCompany(companyId, email, role = 'member') {
    try {
      // First check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (!existingUser) {
        return { error: 'User not found. They must sign up first.' }
      }

      // Add user to company
      const { error } = await supabase
        .from('user_companies')
        .insert({
          user_id: existingUser.id,
          company_id: companyId,
          role: role
        })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Invite user error:', error)
      return { error: error.message }
    }
  },

  // Get company by ID
  async getCompanyById(companyId) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single()

      if (error) throw error

      return { company: data, error: null }
    } catch (error) {
      console.error('Get company error:', error)
      return { company: null, error: error.message }
    }
  }
}