'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, FileText, Download, Trash2, Eye, Mail,
  Calendar, Filter, Search, FolderOpen, Grid, List
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useReports } from '@/contexts/ReportsContext';
import { Button } from '@/components/ui/Button';

export default function SavedReportsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedCompany } = useCompany();
  const { savedReports, deleteReport } = useReports();
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // date, name, type

  const reportTypes = [
    { value: 'all', label: 'All Reports' },
    { value: 'Profit & Loss', label: 'Profit & Loss' },
    { value: 'Balance Sheet', label: 'Balance Sheet' },
    { value: 'Cash Flow', label: 'Cash Flow' },
    { value: 'Custom', label: 'Custom Reports' }
  ];

  const filteredReports = savedReports
    .filter(report => {
      const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || report.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleViewReport = (report) => {
    // In real app, this would navigate to view the specific report
    console.log('Viewing report:', report);
    
    // Navigate based on report type
    if (report.type === 'Profit & Loss') {
      router.push('/reports/profit-loss');
    } else if (report.type === 'Balance Sheet') {
      router.push('/reports/balance-sheet');
    } else if (report.type === 'Cash Flow') {
      router.push('/reports/cash-flow');
    } else {
      // For custom reports, you might want to show a preview modal
      alert('Opening report: ' + report.name);
    }
  };

  const handleDownloadReport = (report, format) => {
    alert(`Downloading ${report.name} as ${format.toUpperCase()}`);
    // In real app, this would generate and download the report
  };

  const handleEmailReport = (report) => {
    alert(`Email functionality for ${report.name}`);
    // In real app, this would open email dialog
  };

  const handleDeleteReport = async (reportId) => {
    if (confirm('Are you sure you want to delete this report?')) {
      await deleteReport(reportId);
      alert('Report deleted successfully!');
    }
  };

  const getReportIcon = (type) => {
    switch (type) {
      case 'Profit & Loss':
        return '📊';
      case 'Balance Sheet':
        return '📋';
      case 'Cash Flow':
        return '💰';
      case 'Custom':
        return '📈';
      default:
        return '📄';
    }
  };

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
                Saved Reports
              </h1>
              <p className="mt-1 text-gray-600">
                {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="type">Sort by Type</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Reports Display */}
        {filteredReports.length > 0 ? (
          viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{getReportIcon(report.type)}</div>
                      <span className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{report.type}</p>
                    
                    {report.config && (
                      <div className="text-xs text-gray-500 mb-4">
                        {report.config.dateRange && (
                          <p>
                            Period: {new Date(report.config.dateRange.startDate).toLocaleDateString()} - 
                            {new Date(report.config.dateRange.endDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="View Report"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEmailReport(report)}
                          className="text-gray-600 hover:text-gray-800"
                          title="Email Report"
                        >
                          <Mail className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Report"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="relative group">
                        <button className="text-gray-600 hover:text-gray-800">
                          <Download className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 bottom-full mb-2 w-32 bg-white rounded shadow-lg hidden group-hover:block z-10">
                          <button
                            onClick={() => handleDownloadReport(report, 'pdf')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Download PDF
                          </button>
                          <button
                            onClick={() => handleDownloadReport(report, 'excel')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Download Excel
                          </button>
                          <button
                            onClick={() => handleDownloadReport(report, 'csv')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Download CSV
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getReportIcon(report.type)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{report.name}</div>
                            {report.description && (
                              <div className="text-sm text-gray-500">{report.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.config?.dateRange ? (
                          <>
                            {new Date(report.config.dateRange.startDate).toLocaleDateString()} - 
                            {new Date(report.config.dateRange.endDate).toLocaleDateString()}
                          </>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewReport(report)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEmailReport(report)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <div className="relative group">
                            <button className="text-gray-600 hover:text-gray-900">
                              <Download className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 bottom-full mb-2 w-32 bg-white rounded shadow-lg hidden group-hover:block z-10">
                              <button
                                onClick={() => handleDownloadReport(report, 'pdf')}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                PDF
                              </button>
                              <button
                                onClick={() => handleDownloadReport(report, 'excel')}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Excel
                              </button>
                              <button
                                onClick={() => handleDownloadReport(report, 'csv')}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                CSV
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteReport(report.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Saved Reports</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'No reports match your search criteria' 
                : 'Generate and save reports to view them here'}
            </p>
            {(!searchTerm && filterType === 'all') && (
              <Link href="/reports">
                <Button>
                  Create a Report
                </Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}