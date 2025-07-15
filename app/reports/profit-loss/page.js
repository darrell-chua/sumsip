'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Download, Calendar, TrendingUp, TrendingDown,
  FileText, Filter, Printer, Mail, Save
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useCompany } from '@/contexts/CompanyContext';
import { useReports } from '@/contexts/ReportsContext';
import { Button } from '@/components/ui/Button';

export default function ProfitLossReport() {
  const router = useRouter();
  const { selectedCompany } = useCompany();
  const { generateProfitLossReport, saveCustomReport, loading } = useReports();
  
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [compareLastYear, setCompareLastYear] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [viewType, setViewType] = useState('summary'); // summary, detailed, chart

  useEffect(() => {
    if (selectedCompany) {
      generateReport();
    }
  }, [selectedCompany, dateRange, compareLastYear]);

  const generateReport = async () => {
    const report = await generateProfitLossReport(
      dateRange.startDate, 
      dateRange.endDate, 
      compareLastYear
    );
    setReportData(report);
  };

  const handleSaveReport = async () => {
    if (!reportData) return;
    
    const reportToSave = {
      name: `P&L Report - ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`,
      type: 'Profit & Loss',
      data: reportData,
      config: { dateRange, compareLastYear }
    };
    
    await saveCustomReport(reportToSave);
    alert('Report saved successfully!');
  };

  const handleExport = (format) => {
    // In a real app, this would generate actual files
    alert(`Exporting as ${format.toUpperCase()}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    alert('Email functionality would be implemented here');
  };

  // Prepare chart data
  const getMonthlyChartData = () => {
    if (!reportData?.data) return [];
    
    const transactions = JSON.parse(localStorage.getItem(`sumsip_transactions_${selectedCompany?.id}`) || '[]');
    const monthlyData = {};
    
    transactions
      .filter(t => {
        const date = new Date(t.date);
        return date >= new Date(dateRange.startDate) && date <= new Date(dateRange.endDate);
      })
      .forEach(t => {
        const month = new Date(t.date).toISOString().slice(0, 7);
        if (!monthlyData[month]) {
          monthlyData[month] = { month, income: 0, expenses: 0, profit: 0 };
        }
        if (t.type === 'income') {
          monthlyData[month].income += t.amount;
        } else {
          monthlyData[month].expenses += t.amount;
        }
        monthlyData[month].profit = monthlyData[month].income - monthlyData[month].expenses;
      });
    
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  const getCategoryPieData = (type) => {
    if (!reportData?.data) return [];
    
    const data = type === 'income' 
      ? reportData.data.incomeByCategory 
      : reportData.data.expenseByCategory;
    
    return Object.entries(data).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
                Profit & Loss Statement
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
        {/* Date Range and Options */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={compareLastYear}
                  onChange={(e) => setCompareLastYear(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Compare with last year</span>
              </label>
            </div>
            <div className="flex items-end">
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="summary">Summary View</option>
                <option value="detailed">Detailed View</option>
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
            {/* Summary View */}
            {viewType === 'summary' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Income</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                          RM {reportData.data.totalIncome.toFixed(2)}
                        </p>
                        {reportData.comparison && (
                          <p className={`text-sm mt-2 ${
                            reportData.comparison.incomeGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {reportData.comparison.incomeGrowth >= 0 ? '+' : ''}
                            {reportData.comparison.incomeGrowth.toFixed(1)}% vs last year
                          </p>
                        )}
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                        <p className="text-3xl font-bold text-red-600 mt-2">
                          RM {reportData.data.totalExpenses.toFixed(2)}
                        </p>
                        {reportData.comparison && (
                          <p className={`text-sm mt-2 ${
                            reportData.comparison.expenseGrowth <= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {reportData.comparison.expenseGrowth >= 0 ? '+' : ''}
                            {reportData.comparison.expenseGrowth.toFixed(1)}% vs last year
                          </p>
                        )}
                      </div>
                      <TrendingDown className="w-8 h-8 text-red-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Net Profit</p>
                        <p className={`text-3xl font-bold mt-2 ${
                          reportData.data.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          RM {reportData.data.netProfit.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {reportData.data.profitMargin.toFixed(1)}% margin
                        </p>
                      </div>
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Income & Expense Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Income by Category</h3>
                    <div className="space-y-3">
                      {Object.entries(reportData.data.incomeByCategory).map(([category, amount]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{category}</span>
                          <span className="text-sm font-medium text-gray-900">
                            RM {amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-900">Total Income</span>
                          <span className="text-sm font-semibold text-green-600">
                            RM {reportData.data.totalIncome.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
                    <div className="space-y-3">
                      {Object.entries(reportData.data.expenseByCategory).map(([category, amount]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{category}</span>
                          <span className="text-sm font-medium text-gray-900">
                            RM {amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-900">Total Expenses</span>
                          <span className="text-sm font-semibold text-red-600">
                            RM {reportData.data.totalExpenses.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed View */}
            {viewType === 'detailed' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Period
                      </th>
                      {compareLastYear && (
                        <>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Year
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Change %
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="bg-green-50">
                      <td colSpan={compareLastYear ? 4 : 2} className="px-6 py-3 text-sm font-semibold text-green-900">
                        Income
                      </td>
                    </tr>
                    {Object.entries(reportData.data.incomeByCategory).map(([category, amount]) => (
                      <tr key={`income-${category}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 pl-12">
                          {category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          RM {amount.toFixed(2)}
                        </td>
                        {compareLastYear && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              RM 0.00
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              -
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-6 py-4 text-sm text-gray-900 pl-12">
                        Total Income
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600 text-right">
                        RM {reportData.data.totalIncome.toFixed(2)}
                      </td>
                      {compareLastYear && (
                        <>
                          <td className="px-6 py-4 text-sm text-gray-500 text-right">
                            RM {reportData.comparison?.lastYear.income.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <span className={reportData.comparison?.incomeGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {reportData.comparison?.incomeGrowth >= 0 ? '+' : ''}
                              {reportData.comparison?.incomeGrowth.toFixed(1)}%
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                    
                    <tr className="bg-red-50">
                      <td colSpan={compareLastYear ? 4 : 2} className="px-6 py-3 text-sm font-semibold text-red-900">
                        Expenses
                      </td>
                    </tr>
                    {Object.entries(reportData.data.expenseByCategory).map(([category, amount]) => (
                      <tr key={`expense-${category}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 pl-12">
                          {category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          RM {amount.toFixed(2)}
                        </td>
                        {compareLastYear && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              RM 0.00
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              -
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-6 py-4 text-sm text-gray-900 pl-12">
                        Total Expenses
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600 text-right">
                        RM {reportData.data.totalExpenses.toFixed(2)}
                      </td>
                      {compareLastYear && (
                        <>
                          <td className="px-6 py-4 text-sm text-gray-500 text-right">
                            RM {reportData.comparison?.lastYear.expenses.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <span className={reportData.comparison?.expenseGrowth <= 0 ? 'text-green-600' : 'text-red-600'}>
                              {reportData.comparison?.expenseGrowth >= 0 ? '+' : ''}
                              {reportData.comparison?.expenseGrowth.toFixed(1)}%
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                    
                    <tr className="bg-blue-50 font-bold">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        Net Profit
                      </td>
                      <td className={`px-6 py-4 text-sm text-right ${
                        reportData.data.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        RM {reportData.data.netProfit.toFixed(2)}
                      </td>
                      {compareLastYear && (
                        <>
                          <td className="px-6 py-4 text-sm text-gray-500 text-right">
                            RM {reportData.comparison?.lastYear.netProfit.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <span className={reportData.comparison?.profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {reportData.comparison?.profitGrowth >= 0 ? '+' : ''}
                              {reportData.comparison?.profitGrowth.toFixed(1)}%
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Chart View */}
            {viewType === 'chart' && (
              <div className="space-y-6">
                {/* Monthly Trend */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getMonthlyChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('en-US', { month: 'short' });
                          }}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => `RM ${value.toFixed(2)}`}
                          labelFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
                        <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
                        <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={2} name="Profit" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Distribution</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getCategoryPieData('income')}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getCategoryPieData('income').map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `RM ${value.toFixed(2)}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Distribution</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getCategoryPieData('expense')}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getCategoryPieData('expense').map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `RM ${value.toFixed(2)}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No data available for the selected period</p>
          </div>
        )}
      </main>
    </div>
  );
}