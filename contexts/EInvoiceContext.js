'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';

const EInvoiceContext = createContext({});

export const useEInvoice = () => useContext(EInvoiceContext);

export const EInvoiceProvider = ({ children }) => {
  const { user } = useAuth();
  const { selectedCompany } = useCompany();
  const [einvoices, setEInvoices] = useState([]);
  const [settings, setSettings] = useState({
    tin: '', // Tax Identification Number
    sst: '', // SST Registration Number
    msic: '', // MSIC Code
    businessActivity: '',
    apiKey: '',
    apiSecret: '',
    environment: 'sandbox' // 'sandbox' or 'production'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && selectedCompany) {
      loadEInvoices();
      loadSettings();
    }
  }, [user, selectedCompany]);

  const loadEInvoices = () => {
    const saved = localStorage.getItem(`sumsip_einvoices_${selectedCompany?.id}`);
    if (saved) {
      setEInvoices(JSON.parse(saved));
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem(`sumsip_einvoice_settings_${selectedCompany?.id}`);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem(`sumsip_einvoice_settings_${selectedCompany?.id}`, JSON.stringify(newSettings));
  };

  const createEInvoice = async (invoiceData) => {
    setLoading(true);
    try {
      // Generate unique invoice number
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newEInvoice = {
        id: Date.now(),
        invoiceNumber,
        ...invoiceData,
        status: 'draft',
        validationStatus: 'pending',
        createdAt: new Date().toISOString(),
        company: selectedCompany,
        // E-Invoice specific fields
        einvoiceId: null,
        validationDate: null,
        qrCode: null,
        irbmUniqueId: null
      };

      const updatedEInvoices = [...einvoices, newEInvoice];
      setEInvoices(updatedEInvoices);
      localStorage.setItem(`sumsip_einvoices_${selectedCompany?.id}`, JSON.stringify(updatedEInvoices));
      
      return newEInvoice;
    } catch (error) {
      console.error('Error creating e-invoice:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitToLHDN = async (invoiceId) => {
    setLoading(true);
    try {
      const invoice = einvoices.find(inv => inv.id === invoiceId);
      if (!invoice) throw new Error('Invoice not found');

      // In production, this would call LHDN API
      // For now, simulate the submission
      const updatedInvoice = {
        ...invoice,
        status: 'submitted',
        validationStatus: 'validating',
        submittedAt: new Date().toISOString()
      };

      // Simulate LHDN validation (in real app, this would be API response)
      setTimeout(() => {
        const validated = {
          ...updatedInvoice,
          status: 'validated',
          validationStatus: 'success',
          validationDate: new Date().toISOString(),
          irbmUniqueId: `IRBM${Date.now()}`,
          qrCode: `https://myinvois.hasil.gov.my/verify/${Date.now()}`
        };
        
        const updated = einvoices.map(inv => inv.id === invoiceId ? validated : inv);
        setEInvoices(updated);
        localStorage.setItem(`sumsip_einvoices_${selectedCompany?.id}`, JSON.stringify(updated));
      }, 3000);

      const updated = einvoices.map(inv => inv.id === invoiceId ? updatedInvoice : inv);
      setEInvoices(updated);
      localStorage.setItem(`sumsip_einvoices_${selectedCompany?.id}`, JSON.stringify(updated));

      return updatedInvoice;
    } catch (error) {
      console.error('Error submitting to LHDN:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelEInvoice = async (invoiceId, reason) => {
    const invoice = einvoices.find(inv => inv.id === invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const updatedInvoice = {
      ...invoice,
      status: 'cancelled',
      cancelReason: reason,
      cancelledAt: new Date().toISOString()
    };

    const updated = einvoices.map(inv => inv.id === invoiceId ? updatedInvoice : inv);
    setEInvoices(updated);
    localStorage.setItem(`sumsip_einvoices_${selectedCompany?.id}`, JSON.stringify(updated));

    return updatedInvoice;
  };

  const value = {
    einvoices,
    settings,
    loading,
    saveSettings,
    createEInvoice,
    submitToLHDN,
    cancelEInvoice,
  };

  return <EInvoiceContext.Provider value={value}>{children}</EInvoiceContext.Provider>;
};