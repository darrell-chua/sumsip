'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { companiesService } from '@/lib/services/companies.service';

const CompanyContext = createContext({
  companies: [],
  selectedCompany: null,
  loading: false,
  error: null,
  createCompany: async () => {},
  updateCompany: async () => {},
  deleteCompany: async () => {},
  selectCompany: () => {},
  refreshCompanies: async () => {},
});

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load companies when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCompanies();
    } else {
      // Clear data when not authenticated
      setCompanies([]);
      setSelectedCompany(null);
    }
  }, [isAuthenticated, user]);

  // Load selected company from localStorage
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      const savedCompanyId = localStorage.getItem('sumsip_selected_company_id');
      if (savedCompanyId) {
        const company = companies.find(c => c.id === savedCompanyId);
        if (company) {
          setSelectedCompany(company);
        } else {
          // If saved company not found, select the default one
          const defaultCompany = companies.find(c => c.is_default) || companies[0];
          selectCompany(defaultCompany);
        }
      } else {
        // No saved selection, use default
        const defaultCompany = companies.find(c => c.is_default) || companies[0];
        selectCompany(defaultCompany);
      }
    }
  }, [companies]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const { companies: loadedCompanies, error: loadError } = await companiesService.getUserCompanies();
      
      if (loadError) {
        setError(loadError);
        return;
      }
      
      setCompanies(loadedCompanies);
    } catch (err) {
      console.error('Error loading companies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { company, error: createError } = await companiesService.createCompany(companyData);
      
      if (createError) {
        setError(createError);
        return { success: false, error: createError };
      }
      
      // Reload companies to get the updated list
      await loadCompanies();
      
      // Select the new company
      if (company) {
        selectCompany(company);
      }
      
      return { success: true, company };
    } catch (err) {
      console.error('Error creating company:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (companyId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const { company, error: updateError } = await companiesService.updateCompany(companyId, updates);
      
      if (updateError) {
        setError(updateError);
        return { success: false, error: updateError };
      }
      
      // Update local state
      setCompanies(prevCompanies => 
        prevCompanies.map(c => c.id === companyId ? { ...c, ...updates } : c)
      );
      
      // Update selected company if it's the one being updated
      if (selectedCompany?.id === companyId) {
        setSelectedCompany(prev => ({ ...prev, ...updates }));
      }
      
      return { success: true, company };
    } catch (err) {
      console.error('Error updating company:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (companyId) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: deleteError } = await companiesService.deleteCompany(companyId);
      
      if (deleteError) {
        setError(deleteError);
        return { success: false, error: deleteError };
      }
      
      // Remove from local state
      setCompanies(prevCompanies => prevCompanies.filter(c => c.id !== companyId));
      
      // If deleted company was selected, select another
      if (selectedCompany?.id === companyId) {
        const remainingCompanies = companies.filter(c => c.id !== companyId);
        const newSelection = remainingCompanies.find(c => c.is_default) || remainingCompanies[0] || null;
        selectCompany(newSelection);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting company:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const selectCompany = (company) => {
    if (!company) {
      setSelectedCompany(null);
      localStorage.removeItem('sumsip_selected_company_id');
      return;
    }
    
    setSelectedCompany(company);
    localStorage.setItem('sumsip_selected_company_id', company.id);
    
    // Also save to localStorage for backward compatibility during migration
    localStorage.setItem('sumsip_selected_company', JSON.stringify(company));
  };

  const refreshCompanies = async () => {
    await loadCompanies();
  };

  const value = {
    companies,
    selectedCompany,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    selectCompany,
    refreshCompanies,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};