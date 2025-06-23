'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Plus, Settings, CheckCircle, Clock, XCircle, AlertCircle, Download, Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useEInvoice } from '@/contexts/EInvoiceContext';
import { Button } from '@/components/ui/Button';

export default function EInvoiceDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { selectedCompany } = useCompany();
  const { einvoices, settings, loading } = useEInvoice();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const filteredInvoices = einvoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: einvoices.length,
    validated: einvoices.filter(inv => inv.status === 'validated').length,
    pending: einvoices.filter(inv => inv.status === 'submitted' || inv.status === 'draft').length,
    cancelled: einvoices.filter(inv => inv.status === 'cancelled').length
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'validated':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'submitted':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      validated: 'bg-green-100 text-green-800',
      submitted: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || styles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (authLoading || !isAuthenticated) return null;

  const needsSetup = !settings.tin || !settings.msic;

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">E-Invoice Management</h1>
              <p className="mt-2 text-gray-600">
                {selectedCompany ? `Manage e-invoices for ${selectedCompany.name}` : 'Select a company to manage e-invoices'}
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/e-invoice/settings">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Link href="/e-invoice/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create E-Invoice
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {selectedCompany ? (
          <>
            {needsSetup && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Setup Required</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      Please complete your e-invoice settings before creating invoices.
                    </p>
                    <Link href="/e-invoice/settings">
                      <Button variant="outline" size="sm" className="mt-2">
                        Complete Setup
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total E-Invoices</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Validated</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.validated}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
                    <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* E-Invoice List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">E-Invoice List</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search invoices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="validated">Validated</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {filteredInvoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IRBM ID
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(invoice.status)}
                              <span className="ml-2 text-sm font-medium text-gray-900">
                                {invoice.invoiceNumber}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.customerName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            RM {invoice.totalAmount?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(invoice.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invoice.irbmUniqueId || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/e-invoice/${invoice.id}`}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              View
                            </Link>
                            {invoice.status === 'validated' && (
                              <button className="text-gray-600 hover:text-gray-900">
                                <Download className="w-4 h-4 inline" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No e-invoices found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria' 
                      : 'Get started by creating your first e-invoice'}
                  </p>
                  {!searchTerm && filterStatus === 'all' && (
                    <div className="mt-6">
                      <Link href="/e-invoice/create">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create E-Invoice
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No Company Selected</h2>
            <p className="text-gray-600 mb-6">Please select or create a company to manage e-invoices</p>
            <Button onClick={() => router.push('/companies')}>
              Manage Companies
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}