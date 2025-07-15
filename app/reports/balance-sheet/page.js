'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Download, Calendar, Building, DollarSign,
  FileText, Printer, Mail, Save, TrendingUp
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useCompany } from '@/contexts/CompanyContext';
import { useReports } from '@/contexts/ReportsContext';
import { Button } from '@/components/ui/Button';

export default function BalanceSheetReport() {
  const router = useRouter();
  const { selectedCompany } = useCompany();
  const { generateBalanceSheet, saveCustomReport, loading } = useReports();
  
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState(null);
  const [viewType, setViewType] = useState('standard'); // standard, comparative, chart

  useEffect(() => {
    if (selectedCompany) {
      generateReport();
    }
  }, [selectedCompany, asOfDate]);

  const generateReport = async () => {
    const report = await generateBalanceSheet(asOfDate);
    setReportData(report);
  };

  const handleSaveReport = async () => {
    if (!reportData) return;
    
    const reportToSave = {
      name: `Balance Sheet - As of ${new Date(asOfDate).toLocaleDateString()}`,
      type: 'Balance Sheet',
      data: reportData,
      config: { asOfDate }
    };
    
    await saveCustomReport(reportToSave);
    alert('Report saved successfully!');
  };

  const handleExport = (format) => {
    alert(`Exporting as ${format.toUpperCase()}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    alert('Email functionality would be implemented here');
  };

  // Prepare chart data
  const getChartData = () => {
    if (!reportData?.data) return [];
    
    return [
      {
        category: 'Assets',
        Current: reportData.data.assets.current.totalCurrent,
        Fixed: reportData.data.assets.fixed.totalFixed,
        Total: reportData.data.assets.totalAssets
      },
      {
        category: 'Liabilities',
        Current: reportData.data.liabilities.current.totalCurrent,
        LongTerm: reportData.data.liabilities.longTerm.totalLongTerm,
        Total: reportData.data.liabilities.totalLiabilities
      },
      {
        category: 'Equity',
        Capital: reportData.data.equity.capital,
        RetainedEarnings: reportData.data.equity.retainedEarnings,
        Total: reportData.data.equity.totalEquity
      }
    ];
  };

  if (!selectedCompany) {
    return (
      <div className="py-10 text-center">
        <p>Please select a company to view reports</p>
        <Button onClick={() => router.push('/companies')} className="mt-4">
          Select Company
        </Button>
      </div>
    );
  }

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/reports">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                Balance Sheet
              </h1>
              <p className="mt-1 text-gray-600">{selectedCompany.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveReport}>
                <Save className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleEmail}>
                <Mail className="w-4 h-4" />
              </Button>
              <div className="relative group">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Date Selection and Options */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                As of Date
              </label>
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                View Type
              </label>
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="standard">Standard View</option>
                <option value="comparative">Comparative View</option>
                <option value="chart">Chart View</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Generating report...</p>
          </div>
        ) : reportData ? (
          <>
            {/* Standard View */}
            {viewType === 'standard' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Balance Sheet as of {new Date(asOfDate).toLocaleDateString()}
                  </h2>
                </div>
                
                <div className="p-6">
                  {/* Assets Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">ASSETS</h3>
                    
                    <div className="ml-4 mb-4">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">Current Assets</h4>
                      <div className="ml-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cash and Cash Equivalents</span>
                          <span className="text-sm text-gray-900">RM {reportData.data.assets.current.cash.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Accounts Receivable</span>
                          <span className="text-sm text-gray-900">RM {reportData.data.assets.current.accountsReceivable.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Inventory</span>
                          <span className="text-sm text-gray-900">RM {reportData.data.assets.current.inventory.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span className="text-sm">Total Current Assets</span>
                          <span className="text-sm">RM {reportData.data.assets.current.totalCurrent.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 mb-4">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">Fixed Assets</h4>
                      <div className="ml-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Equipment</span>
                          <span className="text-sm text-gray-900">RM {reportData.data.assets.fixed.equipment.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Property</span>
                          <span className="text-sm text-gray-900">RM {reportData.data.assets.fixed.property.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span className="text-sm">Total Fixed Assets</span>
                          <span className="text-sm">RM {reportData.data.assets.fixed.totalFixed.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>TOTAL ASSETS</span>
                      <span>RM {reportData.data.assets.totalAssets.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Liabilities Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">LIABILITIES</h3>
                    
                    <div className="ml-4 mb-4">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">Current Liabilities</h4>
                      <div className="ml-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Accounts Payable</span>
                          <span className="text-sm text-gray-900">RM {reportData.data.liabilities.current.accountsPayable.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Short-term Debt</span>
                          <span className="text-sm text-gray-900">RM {reportData.data.liabilities.current.shortTermDebt.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span className="text-sm">Total Current Liabilities</span>
                          <span className="text-sm">RM {reportData.data.liabilities.current.totalCurrent.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 mb-4">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">Long-term Liabilities</h4>
                      <div className="ml-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Long-term Loans</span>
                          <span className="text-sm text-gray-900">RM {reportData.data.liabilities.longTerm.loans.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span className="text-sm">Total Long-term Liabilities</span>
                          <span className="text-sm">RM {reportData.data.liabilities.longTerm.totalLongTerm.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>TOTAL LIABILITIES</span>
                      <span>RM {reportData.data.liabilities.totalLiabilities.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Equity Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">EQUITY</h3>
                    
                    <div className="ml-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Share Capital</span>
                        <span className="text-sm text-gray-900">RM {reportData.data.equity.capital.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Retained Earnings</span>
                        <span className="text-sm text-gray-900">RM {reportData.data.equity.retainedEarnings.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>TOTAL EQUITY</span>
                        <span>RM {reportData.data.equity.totalEquity.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Balance Check */}
                  <div className="mt-8 pt-4 border-t-2 border-gray-300">
                    <div className="flex justify-between font-bold text-lg">
                      <span>TOTAL LIABILITIES + EQUITY</span>
                      <span>RM {(reportData.data.liabilities.totalLiabilities + reportData.data.equity.totalEquity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comparative View */}
            {viewType === 'comparative' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Comparative Balance Sheet Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Total Assets</h4>
                    <p className="text-3xl font-bold text-blue-600">
                      RM {reportData.data.assets.totalAssets.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Current: {((reportData.data.assets.current.totalCurrent / reportData.data.assets.totalAssets) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      Fixed: {((reportData.data.assets.fixed.totalFixed / reportData.data.assets.totalAssets) * 100).toFixed(1)}%
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Total Liabilities</h4>
                    <p className="text-3xl font-bold text-red-600">
                      RM {reportData.data.liabilities.totalLiabilities.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Current: {reportData.data.liabilities.totalLiabilities > 0 
                        ? ((reportData.data.liabilities.current.totalCurrent / reportData.data.liabilities.totalLiabilities) * 100).toFixed(1)
                        : '0.0'}%
                    </p>
                    <p className="text-sm text-gray-500">
                      Long-term: {reportData.data.liabilities.totalLiabilities > 0
                        ? ((reportData.data.liabilities.longTerm.totalLongTerm / reportData.data.liabilities.totalLiabilities) * 100).toFixed(1)
                        : '0.0'}%
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Total Equity</h4>
                    <p className="text-3xl font-bold text-green-600">
                      RM {reportData.data.equity.totalEquity.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Debt-to-Equity: {reportData.data.equity.totalEquity > 0
                        ? (reportData.data.liabilities.totalLiabilities / reportData.data.equity.totalEquity).toFixed(2)
                        : '0.00'}
                    </p>
                  </div>
                </div>

                {/* Key Ratios */}
                <div className="mt-8 pt-6 border-t">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Key Financial Ratios</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Current Ratio</p>
                      <p className="text-lg font-semibold">
                        {reportData.data.liabilities.current.totalCurrent > 0
                          ? (reportData.data.assets.current.totalCurrent / reportData.data.liabilities.current.totalCurrent).toFixed(2)
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Working Capital</p>
                      <p className="text-lg font-semibold">
                        RM {(reportData.data.assets.current.totalCurrent - reportData.data.liabilities.current.totalCurrent).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chart View */}
            {viewType === 'chart' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Sheet Composition</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip formatter={(value) => `RM ${value.toFixed(2)}`} />
                        <Legend />
                        <Bar dataKey="Total" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No data available</p>
          </div>
        )}
      </main>
    </div>
  );
}