'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Download, Calendar, Activity, TrendingUp, TrendingDown,
  FileText, Printer, Mail, Save, DollarSign, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useCompany } from '@/contexts/CompanyContext';
import { useReports } from '@/contexts/ReportsContext';
import { Button } from '@/components/ui/Button';

export default function CashFlowReport() {
  const router = useRouter();
  const { selectedCompany } = useCompany();
  const { generateCashFlowReport, saveCustomReport, loading } = useReports();
  
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);
  const [viewType, setViewType] = useState('summary'); // summary, detailed, waterfall

  useEffect(() => {
    if (selectedCompany) {
      generateReport();
    }
  }, [selectedCompany, dateRange]);

  const generateReport = async () => {
    const report = await generateCashFlowReport(dateRange.startDate, dateRange.endDate);
    setReportData(report);
  };

  const handleSaveReport = async () => {
    if (!reportData) return;
    
    const reportToSave = {
      name: `Cash Flow - ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`,
      type: 'Cash Flow',
      data: reportData,
      config: { dateRange }
    };
    
    await saveCustomReport(reportToSave);
    alert('Report saved successfully!');
  };

  const handleExport = (format) => {
    alert(`Exporting as ${format.toUpperCase()}...`);
  };

  // Prepare chart data
  const getMonthlyFlowData = () => {
    if (!reportData?.data?.monthlyFlow) return [];
    
    return Object.entries(reportData.data.monthlyFlow).map(([month, data]) => ({
      month,
      inflow: data.inflow,
      outflow: -data.outflow, // Negative for visualization
      netFlow: data.inflow - data.outflow
    }));
  };

  const getWaterfallData = () => {
    if (!reportData?.data) return [];
    
    const data = [
      {
        name: 'Opening Balance',
        value: reportData.data.openingBalance,
        fill: '#3B82F6'
      },
      {
        name: 'Operating Inflow',
        value: reportData.data.operating.inflow,
        fill: '#10B981'
      },
      {
        name: 'Operating Outflow',
        value: -reportData.data.operating.outflow,
        fill: '#EF4444'
      },
      {
        name: 'Investing',
        value: reportData.data.investing.net,
        fill: reportData.data.investing.net >= 0 ? '#10B981' : '#EF4444'
      },
      {
        name: 'Financing',
        value: reportData.data.financing.net,
        fill: reportData.data.financing.net >= 0 ? '#10B981' : '#EF4444'
      },
      {
        name: 'Closing Balance',
        value: reportData.data.closingBalance,
        fill: '#6366F1'
      }
    ];

    // Calculate cumulative values for waterfall
    let cumulative = 0;
    return data.map((item, index) => {
      if (index === 0 || index === data.length - 1) {
        cumulative = item.value;
        return { ...item, start: 0, end: item.value };
      } else {
        const start = cumulative;
        cumulative += item.value;
        return { ...item, start, end: cumulative };
      }
    });
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
                Cash Flow Statement
              </h1>
              <p className="mt-1 text-gray-600">{selectedCompany.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveReport}>
                <Save className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4" />
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
            <div className="md:col-span-2 flex items-end">
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="summary">Summary View</option>
                <option value="detailed">Detailed View</option>
                <option value="waterfall">Waterfall Chart</option>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Opening Balance</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          RM {reportData.data.openingBalance.toFixed(2)}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Cash Inflow</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                          RM {reportData.data.operating.inflow.toFixed(2)}
                        </p>
                      </div>
                      <ArrowDownRight className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Cash Outflow</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">
                          RM {reportData.data.operating.outflow.toFixed(2)}
                        </p>
                      </div>
                      <ArrowUpRight className="w-8 h-8 text-red-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Closing Balance</p>
                        <p className={`text-2xl font-bold mt-1 ${
                          reportData.data.closingBalance >= 0 ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          RM {reportData.data.closingBalance.toFixed(2)}
                        </p>
                      </div>
                      <Activity className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Cash Flow Categories */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow by Activity</h3>
                  
                  <div className="space-y-4">
                    {/* Operating Activities */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-800 mb-2">Operating Activities</h4>
                      <div className="ml-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cash received from customers</span>
                          <span className="text-sm text-green-600">+RM {reportData.data.operating.inflow.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cash paid to suppliers and employees</span>
                          <span className="text-sm text-red-600">-RM {reportData.data.operating.outflow.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span className="text-sm">Net Cash from Operating Activities</span>
                          <span className={`text-sm ${reportData.data.operating.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            RM {reportData.data.operating.net.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Investing Activities */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-800 mb-2">Investing Activities</h4>
                      <div className="ml-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Purchase of equipment</span>
                          <span className="text-sm text-gray-900">RM 0.00</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span className="text-sm">Net Cash from Investing Activities</span>
                          <span className="text-sm text-gray-900">RM {reportData.data.investing.net.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Financing Activities */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-800 mb-2">Financing Activities</h4>
                      <div className="ml-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Loan proceeds</span>
                          <span className="text-sm text-gray-900">RM 0.00</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span className="text-sm">Net Cash from Financing Activities</span>
                          <span className="text-sm text-gray-900">RM {reportData.data.financing.net.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Net Change */}
                    <div className="pt-4 border-t-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Net Change in Cash</span>
                        <span className={reportData.data.closingBalance - reportData.data.openingBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                          RM {(reportData.data.closingBalance - reportData.data.openingBalance).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Trend Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Cash Flow Trend</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getMonthlyFlowData()}>
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
                          formatter={(value) => `RM ${Math.abs(value).toFixed(2)}`}
                          labelFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                          }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="inflow" stackId="1" stroke="#10B981" fill="#10B981" name="Inflow" />
                        <Area type="monotone" dataKey="outflow" stackId="1" stroke="#EF4444" fill="#EF4444" name="Outflow" />
                        <Line type="monotone" dataKey="netFlow" stroke="#3B82F6" strokeWidth={2} name="Net Flow" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed View */}
            {viewType === 'detailed' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Detailed Cash Flow Statement
                  </h2>
                  <p className="text-sm text-gray-600">
                    {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="p-6">
                  <table className="min-w-full">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-2 text-sm font-medium text-gray-900">Cash at beginning of period</td>
                        <td className="py-2 text-sm text-right text-gray-900">RM {reportData.data.openingBalance.toFixed(2)}</td>
                      </tr>
                      
                      <tr className="bg-gray-50">
                        <td colSpan="2" className="py-2 text-sm font-semibold text-gray-900">Cash Flows from Operating Activities</td>
                      </tr>
                      <tr>
                        <td className="py-2 pl-8 text-sm text-gray-600">Cash receipts from customers</td>
                        <td className="py-2 text-sm text-right text-gray-900">RM {reportData.data.operating.inflow.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pl-8 text-sm text-gray-600">Cash paid to suppliers and employees</td>
                        <td className="py-2 text-sm text-right text-gray-900">(RM {reportData.data.operating.outflow.toFixed(2)})</td>
                      </tr>
                      <tr className="font-semibold">
                        <td className="py-2 pl-4 text-sm">Net cash provided by operating activities</td>
                        <td className="py-2 text-sm text-right">{reportData.data.operating.net >= 0 ? 'RM' : '(RM'} {Math.abs(reportData.data.operating.net).toFixed(2)}{reportData.data.operating.net < 0 ? ')' : ''}</td>
                      </tr>
                      
                      <tr className="bg-gray-50">
                        <td colSpan="2" className="py-2 text-sm font-semibold text-gray-900">Cash Flows from Investing Activities</td>
                      </tr>
                      <tr>
                        <td className="py-2 pl-8 text-sm text-gray-600">Purchase of property and equipment</td>
                        <td className="py-2 text-sm text-right text-gray-900">RM 0.00</td>
                      </tr>
                      <tr className="font-semibold">
                        <td className="py-2 pl-4 text-sm">Net cash used in investing activities</td>
                        <td className="py-2 text-sm text-right">RM {reportData.data.investing.net.toFixed(2)}</td>
                      </tr>
                      
                      <tr className="bg-gray-50">
                        <td colSpan="2" className="py-2 text-sm font-semibold text-gray-900">Cash Flows from Financing Activities</td>
                      </tr>
                      <tr>
                        <td className="py-2 pl-8 text-sm text-gray-600">Proceeds from borrowings</td>
                        <td className="py-2 text-sm text-right text-gray-900">RM 0.00</td>
                      </tr>
                      <tr className="font-semibold">
                        <td className="py-2 pl-4 text-sm">Net cash provided by financing activities</td>
                        <td className="py-2 text-sm text-right">RM {reportData.data.financing.net.toFixed(2)}</td>
                      </tr>
                      
                      <tr className="font-bold bg-blue-50">
                        <td className="py-3 text-sm">Net increase (decrease) in cash</td>
                        <td className="py-3 text-sm text-right">{reportData.data.closingBalance - reportData.data.openingBalance >= 0 ? 'RM' : '(RM'} {Math.abs(reportData.data.closingBalance - reportData.data.openingBalance).toFixed(2)}{reportData.data.closingBalance - reportData.data.openingBalance < 0 ? ')' : ''}</td>
                      </tr>
                      
                      <tr className="font-bold">
                        <td className="py-2 text-sm text-gray-900">Cash at end of period</td>
                        <td className="py-2 text-sm text-right text-gray-900">RM {reportData.data.closingBalance.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Waterfall Chart View */}
            {viewType === 'waterfall' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Waterfall</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getWaterfallData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip formatter={(value) => `RM ${Math.abs(value).toFixed(2)}`} />
                      <Bar dataKey="end" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
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