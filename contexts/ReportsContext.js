'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';

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

  const loadSavedReports = () => {
    const saved = localStorage.getItem(`sumsip_saved_reports_${selectedCompany?.id}`);
    if (saved) {
      setSavedReports(JSON.parse(saved));
    } else {
      setSavedReports([]);
    }
  };

  const loadScheduledReports = () => {
    const scheduled = localStorage.getItem(`sumsip_scheduled_reports_${selectedCompany?.id}`);
    if (scheduled) {
      setScheduledReports(JSON.parse(scheduled));
    } else {
      setScheduledReports([]);
    }
  };

  const generateProfitLossReport = (startDate, endDate, compareLastYear = false) => {
    setLoading(true);
    try {
      // Get transactions from localStorage
      const transactions = JSON.parse(localStorage.getItem(`sumsip_transactions_${selectedCompany?.id}`) || '[]');
      
      // Filter transactions by date range
      const filteredTransactions = transactions.filter(t => {
        const transDate = new Date(t.date);
        return transDate >= new Date(startDate) && transDate <= new Date(endDate);
      });

      // Calculate income by category
      const incomeByCategory = {};
      const expenseByCategory = {};
      
      filteredTransactions.forEach(transaction => {
        const category = transaction.category || 'Uncategorized';
        if (transaction.type === 'income') {
          incomeByCategory[category] = (incomeByCategory[category] || 0) + transaction.amount;
        } else {
          expenseByCategory[category] = (expenseByCategory[category] || 0) + transaction.amount;
        }
      });

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

        const lastYearTransactions = transactions.filter(t => {
          const transDate = new Date(t.date);
          return transDate >= lastYearStart && transDate <= lastYearEnd;
        });

        const lastYearIncome = lastYearTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const lastYearExpenses = lastYearTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        lastYearData = {
          income: lastYearIncome,
          expenses: lastYearExpenses,
          netProfit: lastYearIncome - lastYearExpenses
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
          incomeGrowth: ((totalIncome - lastYearData.income) / lastYearData.income) * 100,
          expenseGrowth: ((totalExpenses - lastYearData.expenses) / lastYearData.expenses) * 100,
          profitGrowth: ((netProfit - lastYearData.netProfit) / Math.abs(lastYearData.netProfit)) * 100,
          lastYear: lastYearData
        } : null,
        generatedAt: new Date().toISOString()
      };
    } finally {
      setLoading(false);
    }
  };

  const generateBalanceSheet = (asOfDate) => {
    setLoading(true);
    try {
      // In a real app, this would fetch from actual accounting data
      // For now, we'll create a sample structure
      const transactions = JSON.parse(localStorage.getItem(`sumsip_transactions_${selectedCompany?.id}`) || '[]');
      
      // Calculate basic values from transactions
      const cashBalance = transactions.reduce((balance, t) => {
        return t.type === 'income' ? balance + t.amount : balance - t.amount;
      }, 0);

      return {
        reportType: 'balance-sheet',
        asOfDate,
        company: selectedCompany,
        data: {
          assets: {
            current: {
              cash: cashBalance,
              accountsReceivable: 0,
              inventory: 0,
              totalCurrent: cashBalance
            },
            fixed: {
              equipment: 0,
              property: 0,
              totalFixed: 0
            },
            totalAssets: cashBalance
          },
          liabilities: {
            current: {
              accountsPayable: 0,
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
            retainedEarnings: cashBalance,
            totalEquity: cashBalance
          }
        },
        generatedAt: new Date().toISOString()
      };
    } finally {
      setLoading(false);
    }
  };

  const generateCashFlowReport = (startDate, endDate) => {
    setLoading(true);
    try {
      const transactions = JSON.parse(localStorage.getItem(`sumsip_transactions_${selectedCompany?.id}`) || '[]');
      
      // Filter and categorize transactions
      const filteredTransactions = transactions.filter(t => {
        const transDate = new Date(t.date);
        return transDate >= new Date(startDate) && transDate <= new Date(endDate);
      });

      // Group by month
      const monthlyFlow = {};
      filteredTransactions.forEach(t => {
        const month = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM
        if (!monthlyFlow[month]) {
          monthlyFlow[month] = { inflow: 0, outflow: 0 };
        }
        if (t.type === 'income') {
          monthlyFlow[month].inflow += t.amount;
        } else {
          monthlyFlow[month].outflow += t.amount;
        }
      });

      // Calculate opening and closing balance
      const allPreviousTransactions = transactions.filter(t => {
        return new Date(t.date) < new Date(startDate);
      });
      
      const openingBalance = allPreviousTransactions.reduce((balance, t) => {
        return t.type === 'income' ? balance + t.amount : balance - t.amount;
      }, 0);

      const totalInflow = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalOutflow = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
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

  const saveCustomReport = (report) => {
    const newReport = {
      id: Date.now(),
      ...report,
      createdAt: new Date().toISOString()
    };
    
    const updated = [...savedReports, newReport];
    setSavedReports(updated);
    localStorage.setItem(`sumsip_saved_reports_${selectedCompany?.id}`, JSON.stringify(updated));
    
    return newReport;
  };

  const deleteReport = (reportId) => {
    const updated = savedReports.filter(r => r.id !== reportId);
    setSavedReports(updated);
    localStorage.setItem(`sumsip_saved_reports_${selectedCompany?.id}`, JSON.stringify(updated));
  };

  const scheduleReport = (reportConfig) => {
    const newSchedule = {
      id: Date.now(),
      ...reportConfig,
      createdAt: new Date().toISOString(),
      lastRun: null,
      nextRun: calculateNextRun(reportConfig.frequency)
    };
    
    const updated = [...scheduledReports, newSchedule];
    setScheduledReports(updated);
    localStorage.setItem(`sumsip_scheduled_reports_${selectedCompany?.id}`, JSON.stringify(updated));
    
    return newSchedule;
  };

  const calculateNextRun = (frequency) => {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.setDate(now.getDate() + 1)).toISOString();
      case 'weekly':
        return new Date(now.setDate(now.getDate() + 7)).toISOString();
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
      default:
        return null;
    }
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