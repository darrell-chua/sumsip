'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';
import { transactionsService } from '@/lib/services/transactions.service';
import { accountsService } from '@/lib/services/accounts.service';
import { supabase } from '@/lib/supabase';

const ReportsContext = createContext({
  savedReports: [],
  scheduledReports: [],
  loading: false,
  generateProfitLossReport: () => {},
  generateBalanceSheet: () => {},
  generateCashFlowReport: () => {},
  saveCustomReport: () => {},
  deleteReport: () => {},
  scheduleReport: () => {}
});

export const useReports = () => useContext(ReportsContext);

export const ReportsProvider = ({ children }) => {
  const { user } = useAuth();
  const { selectedCompany } = useCompany();
  const [savedReports, setSavedReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && selectedCompany) {
      loadSavedReports();
      loadScheduledReports();
    }
  }, [user, selectedCompany]);

  const loadSavedReports = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_reports')
        .select('*')
        .eq('company_id', selectedCompany.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedReports(data || []);
    } catch (error) {
      console.error('Error loading saved reports:', error);
      setSavedReports([]);
    }
  };

  const loadScheduledReports = async () => {
    try {
      const { data, error } = await supabase
        .from('scheduled_reports')
        .select('*')
        .eq('company_id', selectedCompany.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScheduledReports(data || []);
    } catch (error) {
      console.error('Error loading scheduled reports:', error);
      setScheduledReports([]);
    }
  };

  const generateProfitLossReport = async (startDate, endDate, compareLastYear = false) => {
    setLoading(true);
    try {
      // Get transactions for the period
      const { transactions } = await transactionsService.getTransactions(selectedCompany.id, {
        startDate,
        endDate
      });

      // Get categorized data
      const { data: categorizedData } = await transactionsService.getTransactionsByCategory(
        selectedCompany.id,
        startDate,
        endDate
      );

      const incomeByCategory = categorizedData?.income || {};
      const expenseByCategory = categorizedData?.expense || {};

      const totalIncome = Object.values(incomeByCategory).reduce((sum, val) => sum + val, 0);
      const totalExpenses = Object.values(expenseByCategory).reduce((sum, val) => sum + val, 0);
      const netProfit = totalIncome - totalExpenses;

      // If comparing with last year
      let lastYearData = null;
      if (compareLastYear) {
        const lastYearStart = new Date(startDate);
        lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);
        const lastYearEnd = new Date(endDate);
        lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);

        const { summary: lastYearSummary } = await transactionsService.getFinancialSummary(
          selectedCompany.id,
          lastYearStart.toISOString().split('T')[0],
          lastYearEnd.toISOString().split('T')[0]
        );

        lastYearData = {
          income: parseFloat(lastYearSummary?.total_income || 0),
          expenses: parseFloat(lastYearSummary?.total_expenses || 0),
          netProfit: parseFloat(lastYearSummary?.net_profit || 0)
        };
      }

      return {
        reportType: 'profit-loss',
        period: { startDate, endDate },
        company: selectedCompany,
        data: {
          incomeByCategory,
          expenseByCategory,
          totalIncome,
          totalExpenses,
          netProfit,
          profitMargin: totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0
        },
        comparison: lastYearData ? {
          incomeGrowth: lastYearData.income > 0 
            ? ((totalIncome - lastYearData.income) / lastYearData.income) * 100 
            : 0,
          expenseGrowth: lastYearData.expenses > 0
            ? ((totalExpenses - lastYearData.expenses) / lastYearData.expenses) * 100
            : 0,
          profitGrowth: lastYearData.netProfit !== 0
            ? ((netProfit - lastYearData.netProfit) / Math.abs(lastYearData.netProfit)) * 100
            : 0,
          lastYear: lastYearData
        } : null,
        generatedAt: new Date().toISOString()
      };
    } finally {
      setLoading(false);
    }
  };

  const generateBalanceSheet = async (asOfDate) => {
    setLoading(true);
    try {
      // Get account summary
      const { summary: accountSummary } = await accountsService.getAccountSummary(selectedCompany.id);
      
      // Get all accounts with details
      const { accounts } = await accountsService.getAccounts(selectedCompany.id);

      // Organize accounts by type
      const organizedAccounts = {
        assets: {
          current: {
            cash: 0,
            bank: 0,
            accountsReceivable: 0,
            inventory: 0,
            totalCurrent: 0
          },
          fixed: {
            equipment: 0,
            property: 0,
            totalFixed: 0
          },
          totalAssets: 0
        },
        liabilities: {
          current: {
            accountsPayable: 0,
            creditCards: 0,
            shortTermDebt: 0,
            totalCurrent: 0
          },
          longTerm: {
            loans: 0,
            totalLongTerm: 0
          },
          totalLiabilities: 0
        },
        equity: {
          capital: 0,
          retainedEarnings: 0,
          totalEquity: 0
        }
      };

      // Process accounts
      accounts.forEach(account => {
        const balance = parseFloat(account.current_balance);
        
        switch (account.type) {
          case 'cash':
            organizedAccounts.assets.current.cash += balance;
            break;
          case 'bank':
            organizedAccounts.assets.current.bank += balance;
            break;
          case 'credit_card':
            organizedAccounts.liabilities.current.creditCards += Math.abs(balance);
            break;
          case 'asset':
            if (account.category?.name?.includes('Fixed') || account.category?.name?.includes('Equipment')) {
              organizedAccounts.assets.fixed.equipment += balance;
            } else {
              organizedAccounts.assets.current.inventory += balance;
            }
            break;
          case 'liability':
            organizedAccounts.liabilities.longTerm.loans += Math.abs(balance);
            break;
        }
      });

      // Calculate totals
      organizedAccounts.assets.current.totalCurrent = 
        organizedAccounts.assets.current.cash +
        organizedAccounts.assets.current.bank +
        organizedAccounts.assets.current.accountsReceivable +
        organizedAccounts.assets.current.inventory;

      organizedAccounts.assets.fixed.totalFixed =
        organizedAccounts.assets.fixed.equipment +
        organizedAccounts.assets.fixed.property;

      organizedAccounts.assets.totalAssets =
        organizedAccounts.assets.current.totalCurrent +
        organizedAccounts.assets.fixed.totalFixed;

      organizedAccounts.liabilities.current.totalCurrent =
        organizedAccounts.liabilities.current.accountsPayable +
        organizedAccounts.liabilities.current.creditCards +
        organizedAccounts.liabilities.current.shortTermDebt;

      organizedAccounts.liabilities.longTerm.totalLongTerm =
        organizedAccounts.liabilities.longTerm.loans;

      organizedAccounts.liabilities.totalLiabilities =
        organizedAccounts.liabilities.current.totalCurrent +
        organizedAccounts.liabilities.longTerm.totalLongTerm;

      // Calculate equity (simplified)
      organizedAccounts.equity.retainedEarnings = 
        organizedAccounts.assets.totalAssets - organizedAccounts.liabilities.totalLiabilities;
      organizedAccounts.equity.totalEquity = organizedAccounts.equity.retainedEarnings;

      return {
        reportType: 'balance-sheet',
        asOfDate,
        company: selectedCompany,
        data: organizedAccounts,
        generatedAt: new Date().toISOString()
      };
    } finally {
      setLoading(false);
    }
  };

  const generateCashFlowReport = async (startDate, endDate) => {
    setLoading(true);
    try {
      // Get all transactions for the period
      const { transactions } = await transactionsService.getTransactions(selectedCompany.id, {
        startDate,
        endDate
      });

      // Get opening balance (sum of all transactions before start date)
      const { transactions: previousTransactions } = await transactionsService.getTransactions(
        selectedCompany.id,
        { endDate: new Date(new Date(startDate).getTime() - 86400000).toISOString().split('T')[0] }
      );

      const openingBalance = previousTransactions.reduce((balance, t) => {
        return t.type === 'income' ? balance + parseFloat(t.amount) : balance - parseFloat(t.amount);
      }, 0);

      // Group transactions by month
      const monthlyFlow = {};
      
      transactions.forEach(t => {
        const month = new Date(t.date).toISOString().slice(0, 7);
        if (!monthlyFlow[month]) {
          monthlyFlow[month] = { inflow: 0, outflow: 0 };
        }
        if (t.type === 'income') {
          monthlyFlow[month].inflow += parseFloat(t.amount);
        } else {
          monthlyFlow[month].outflow += parseFloat(t.amount);
        }
      });

      const totalInflow = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const totalOutflow = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const closingBalance = openingBalance + totalInflow - totalOutflow;

      return {
        reportType: 'cash-flow',
        period: { startDate, endDate },
        company: selectedCompany,
        data: {
          openingBalance,
          operating: {
            inflow: totalInflow,
            outflow: totalOutflow,
            net: totalInflow - totalOutflow
          },
          investing: {
            inflow: 0,
            outflow: 0,
            net: 0
          },
          financing: {
            inflow: 0,
            outflow: 0,
            net: 0
          },
          closingBalance,
          monthlyFlow
        },
        generatedAt: new Date().toISOString()
      };
    } finally {
      setLoading(false);
    }
  };

  const saveCustomReport = async (report) => {
    try {
      const { data, error } = await supabase
        .from('saved_reports')
        .insert({
          company_id: selectedCompany.id,
          user_id: user.id,
          name: report.name,
          type: report.type || 'custom',
          config: report.config || {},
          data: report.data || {}
        })
        .select()
        .single();

      if (error) throw error;

      setSavedReports(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  };

  const deleteReport = async (reportId) => {
    try {
      const { error } = await supabase
        .from('saved_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      setSavedReports(prev => prev.filter(r => r.id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  };

  const scheduleReport = async (reportConfig) => {
    try {
      const nextRun = calculateNextRun(reportConfig.frequency);
      
      const { data, error } = await supabase
        .from('scheduled_reports')
        .insert({
          company_id: selectedCompany.id,
          user_id: user.id,
          report_name: reportConfig.reportName,
          report_type: reportConfig.reportType,
          frequency: reportConfig.frequency,
          config: reportConfig,
          email_recipients: reportConfig.emailRecipients || [],
          next_run_at: nextRun,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setScheduledReports(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error scheduling report:', error);
      throw error;
    }
  };

  const calculateNextRun = (frequency) => {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
      case 'quarterly':
        now.setMonth(now.getMonth() + 3);
        break;
    }
    return now.toISOString();
  };

  const value = {
    savedReports,
    scheduledReports,
    loading,
    generateProfitLossReport,
    generateBalanceSheet,
    generateCashFlowReport,
    saveCustomReport,
    deleteReport,
    scheduleReport
  };

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
};