// lib/services/companies.service.js
import { supabase } from '@/lib/supabase'

export const companiesService = {
  // Get all companies for current user
  async getUserCompanies() {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return { companies: data, error: null }
    } catch (error) {
      console.error('Get user companies error:', error)
      return { companies: [], error: error.message }
    }
  },

  // Create new company
  async createCompany(companyData) {
    try {
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          ...companyData,
        })
        .select()
        .single()

      if (companyError) throw companyError

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
      // First, unset all as default
      await supabase
        .from('companies')
        .update({ is_default: false })
        .eq('id', companyId)

      // Then set the selected one as default
      const { error } = await supabase
        .from('companies')
        .update({ is_default: true })
        .eq('id', companyId)

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