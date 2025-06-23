'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, BarChart3, TrendingUp, DollarSign, Calendar,
  Download, Clock, Plus, Filter, ChevronRight, FileBarChart,
  PieChart, Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useReports } from '@/contexts/ReportsContext';
import { Button } from '@/components/ui/Button';

export default function ReportsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { selectedCompany } = useCompany();
  const { savedReports, scheduledReports } = useReports();
  const [quickStats, setQuickStats] = useState({
    currentMonthRevenue: 0,
    lastMonthRevenue: 0,
    yearToDate: 0,
    lastYearTotal: 0
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (selectedCompany) {
      calculateQuickStats();
    }
  }, [selectedCompany]);

  const calculateQuickStats = () => {
    const transactions = JSON.parse(localStorage.getItem(`sumsip_transactions_${selectedCompany?.id}`) || '[]');
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Current month revenue
    const currentMonthRevenue = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Last month revenue
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthRevenue = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && 
               date.getMonth() === lastMonth && 
               date.getFullYear() === lastMonthYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Year to date
    const yearToDate = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Last year total
    const lastYearTotal = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && date.getFullYear() === currentYear - 1;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    setQuickStats({
      currentMonthRevenue,
      lastMonthRevenue,
      yearToDate,
      lastYearTotal
    });
  };

  const reportTypes = [
    {
      id: 'profit-loss',
      title: 'Profit & Loss Statement',
      description: 'View income, expenses, and net profit over time',
      icon: TrendingUp,
      color: 'green',
      href: '/reports/profit-loss'
    },
    {
      id: 'balance-sheet',
      title: 'Balance Sheet',
      description: 'Snapshot of assets, liabilities, and equity',
      icon: FileBarChart,
      color: 'blue',
      href: '/reports/balance-sheet'
    },
    {
      id: 'cash-flow',
      title: 'Cash Flow Statement',
      description: 'Track cash inflows and outflows',
      icon: Activity,
      color: 'indigo',
      href: '/reports/cash-flow'
    },
    {
      id: 'custom',
      title: 'Custom Reports',
      description: 'Create your own custom report',
      icon: PieChart,
      color: 'purple',
      href: '/reports/custom'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                Reports & Analytics
              </h1>
              <p className="mt-2 text-gray-600">
                {selectedCompany ? `Financial insights for ${selectedCompany.name}` : 'Select a company to view reports'}
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/reports/schedule">
                <Button variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Scheduled Reports
                </Button>
              </Link>
              <Link href="/reports/custom">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Report
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {selectedCompany ? (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Month</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      RM {quickStats.currentMonthRevenue.toFixed(2)}
                    </p>
                    {quickStats.lastMonthRevenue > 0 && (
                      <p className={`text-sm mt-1 ${
                        quickStats.currentMonthRevenue >= quickStats.lastMonthRevenue 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {quickStats.currentMonthRevenue >= quickStats.lastMonthRevenue ? '+' : ''}
                        {(((quickStats.currentMonthRevenue - quickStats.lastMonthRevenue) / quickStats.lastMonthRevenue) * 100).toFixed(1)}%
                        {' '}vs last month
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Year to Date</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      RM {quickStats.yearToDate.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date().getFullYear()} Total
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Year</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      RM {quickStats.lastYearTotal.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date().getFullYear() - 1} Total
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {quickStats.lastYearTotal > 0 
                        ? `${(((quickStats.yearToDate - quickStats.lastYearTotal) / quickStats.lastYearTotal) * 100).toFixed(1)}%`
                        : 'N/A'
                      }
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Year over Year</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Report Types */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <Link key={report.id} href={report.href}>
                      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className={`inline-flex p-3 rounded-lg ${getColorClasses(report.color)} mb-4`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                        <div className="flex items-center text-sm font-medium text-indigo-600">
                          Generate Report
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Reports */}
            {savedReports && savedReports.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
                    <Link href="/reports/saved">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {savedReports.slice(0, 5).map((report) => (
                    <div key={report.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{report.name}</p>
                            <p className="text-sm text-gray-500">
                              {report.type} • {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scheduled Reports Status */}
            {scheduledReports && scheduledReports.length > 0 && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Scheduled Reports Active</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      You have {scheduledReports.length} report{scheduledReports.length > 1 ? 's' : ''} scheduled to run automatically.
                    </p>
                    <Link href="/reports/schedule">
                      <Button variant="outline" size="sm" className="mt-2">
                        Manage Schedules
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No Company Selected</h2>
            <p className="text-gray-600 mb-6">Please select or create a company to view reports</p>
            <Button onClick={() => router.push('/companies')}>
              Manage Companies
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}