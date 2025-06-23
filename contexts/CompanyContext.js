'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getLocalStorage, setLocalStorage } from '@/lib/utils'

const CompanyContext = createContext({})

export function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Load companies from localStorage
      const savedCompanies = getLocalStorage(`sumsip_companies_${user.id}`, [])
      
      // If no companies exist, create sample data
      if (savedCompanies.length === 0) {
        const sampleCompanies = [
          {
            id: Date.now().toString(),
            name: 'My Coffee Shop',
            industry: 'Food & Beverage',
            status: 'active',
            createdAt: new Date().toISOString()
          }
        ]
        setCompanies(sampleCompanies)
        setSelectedCompany(sampleCompanies[0])
        setLocalStorage(`sumsip_companies_${user.id}`, sampleCompanies)
        setLocalStorage(`sumsip_selected_company_${user.id}`, sampleCompanies[0].id)
        
        // Create sample transactions for the demo company
        const sampleTransactions = [
          {
            id: '1',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
            description: 'Coffee Sales',
            category: 'Sales',
            type: 'income',
            amount: 450.00
          },
          {
            id: '2',
            date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 days ago
            description: 'Coffee Beans Purchase',
            category: 'Inventory',
            type: 'expense',
            amount: 120.00
          },
          {
            id: '3',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
            description: 'Daily Sales',
            category: 'Sales',
            type: 'income',
            amount: 380.00
          },
          {
            id: '4',
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days ago
            description: 'Electricity Bill',
            category: 'Utilities',
            type: 'expense',
            amount: 85.00
          },
          {
            id: '5',
            date: new Date().toISOString().split('T')[0], // Today
            description: 'Morning Sales',
            category: 'Sales',
            type: 'income',
            amount: 280.00
          }
        ]
        setLocalStorage(`sumsip_transactions_${sampleCompanies[0].id}`, sampleTransactions)
      } else {
        setCompanies(savedCompanies)
        
        // Get selected company from localStorage or select the first one
        const savedSelectedId = getLocalStorage(`sumsip_selected_company_${user.id}`)
        if (savedSelectedId) {
          const selected = savedCompanies.find(c => c.id === savedSelectedId)
          if (selected) {
            setSelectedCompany(selected)
          } else if (savedCompanies.length > 0) {
            setSelectedCompany(savedCompanies[0])
          }
        } else if (savedCompanies.length > 0) {
          setSelectedCompany(savedCompanies[0])
        }
      }
    }
  }, [user])

  const addCompany = (companyData) => {
    if (!user) return null
    
    const newCompany = { 
      ...companyData, 
      id: Date.now().toString(),
      status: companyData.status || 'active',
      createdAt: new Date().toISOString()
    }
    
    const updatedCompanies = [...companies, newCompany]
    setCompanies(updatedCompanies)
    setSelectedCompany(newCompany)
    
    setLocalStorage(`sumsip_companies_${user.id}`, updatedCompanies)
    setLocalStorage(`sumsip_selected_company_${user.id}`, newCompany.id)
    
    return newCompany
  }

  const updateCompany = (id, data) => {
    if (!user) return null
    
    const updatedCompanies = companies.map(company => {
      if (company.id === id) {
        return { ...company, ...data }
      }
      return company
    })
    
    setCompanies(updatedCompanies)
    
    // If the updated company is the selected one, update selectedCompany as well
    if (selectedCompany && selectedCompany.id === id) {
      const updated = updatedCompanies.find(c => c.id === id)
      setSelectedCompany(updated)
    }
    
    setLocalStorage(`sumsip_companies_${user.id}`, updatedCompanies)
    
    return updatedCompanies.find(c => c.id === id)
  }

  const deleteCompany = (id) => {
    if (!user) return false
    
    const updatedCompanies = companies.filter(company => company.id !== id)
    setCompanies(updatedCompanies)
    
    // Delete company's transactions as well
    localStorage.removeItem(`sumsip_transactions_${id}`)
    
    // If the deleted company is the selected one, select another one
    if (selectedCompany && selectedCompany.id === id) {
      if (updatedCompanies.length > 0) {
        setSelectedCompany(updatedCompanies[0])
        setLocalStorage(`sumsip_selected_company_${user.id}`, updatedCompanies[0].id)
      } else {
        setSelectedCompany(null)
        setLocalStorage(`sumsip_selected_company_${user.id}`, null)
      }
    }
    
    setLocalStorage(`sumsip_companies_${user.id}`, updatedCompanies)
    
    return true
  }

  const selectCompany = (id) => {
    if (!user) return null
    
    const company = companies.find(c => c.id === id)
    if (company) {
      setSelectedCompany(company)
      setLocalStorage(`sumsip_selected_company_${user.id}`, id)
      return company
    }
    return null
  }

  return (
    <CompanyContext.Provider value={{ 
      companies, 
      selectedCompany, 
      addCompany, 
      updateCompany,
      deleteCompany,
      selectCompany 
    }}>
      {children}
    </CompanyContext.Provider>
  )
}

export const useCompany = () => useContext(CompanyContext)