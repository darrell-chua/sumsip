'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Info, Key, Building, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useEInvoice } from '@/contexts/EInvoiceContext';
import { Button } from '@/components/ui/Button';

export default function EInvoiceSettings() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedCompany } = useCompany();
  const { settings, saveSettings } = useEInvoice();
  
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await saveSettings(formData);
      alert('Settings saved successfully!');
      router.push('/e-invoice');
    } catch (error) {
      alert('Error saving settings: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/e-invoice">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                E-Invoice Settings
              </h1>
              <p className="mt-1 text-gray-600">Configure your e-invoice settings for LHDN integration</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Tax Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Building className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold">Company Tax Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TIN (Tax Identification Number) *
                </label>
                <input
                  type="text"
                  value={formData.tin}
                  onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., C12345678910"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Your company's Tax Identification Number issued by LHDN
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SST Registration Number
                </label>
                <input
                  type="text"
                  value={formData.sst}
                  onChange={(e) => setFormData({ ...formData, sst: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., W10-1234-12345678"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Your Sales and Service Tax registration number (if applicable)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MSIC Code *
                </label>
                <input
                  type="text"
                  value={formData.msic}
                  onChange={(e) => setFormData({ ...formData, msic: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 62010"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Malaysian Standard Industrial Classification code
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Activity Description *
                </label>
                <textarea
                  value={formData.businessActivity}
                  onChange={(e) => setFormData({ ...formData, businessActivity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="e.g., Computer programming activities"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Description of your main business activity
                </p>
              </div>
            </div>
          </div>

          {/* API Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Key className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold">API Configuration</h2>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">MyInvois API Credentials</p>
                  <p>You can obtain these credentials from the MyInvois portal after registering your company.</p>
                  <a href="https://myinvois.hasil.gov.my" target="_blank" rel="noopener noreferrer" 
                     className="underline hover:text-blue-900 mt-1 inline-block">
                    Visit MyInvois Portal →
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Environment
                </label>
                <select
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="sandbox">Sandbox (Testing)</option>
                  <option value="production">Production (Live)</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Use Sandbox for testing before going live
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                  placeholder="Enter your API key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Secret
                </label>
                <input
                  type="password"
                  value={formData.apiSecret}
                  onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                  placeholder="Enter your API secret"
                />
              </div>
            </div>
          </div>

          {/* E-Invoice Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold">E-Invoice Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="autoValidate"
                  className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="autoValidate" className="ml-3">
                  <span className="text-sm font-medium text-gray-700">
                    Auto-submit for validation
                  </span>
                  <p className="text-sm text-gray-500">
                    Automatically submit invoices to LHDN upon creation
                  </p>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="emailNotification"
                  className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  defaultChecked
                />
                <label htmlFor="emailNotification" className="ml-3">
                  <span className="text-sm font-medium text-gray-700">
                    Email notifications
                  </span>
                  <p className="text-sm text-gray-500">
                    Receive email notifications for validation status updates
                  </p>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consolidatedInvoice"
                  className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="consolidatedInvoice" className="ml-3">
                  <span className="text-sm font-medium text-gray-700">
                    Enable consolidated invoices
                  </span>
                  <p className="text-sm text-gray-500">
                    Allow creation of consolidated e-invoices for B2C transactions
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">Important Notes:</h3>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>Ensure all tax information is accurate before submitting e-invoices</li>
              <li>E-invoices must be submitted to LHDN within 72 hours of creation</li>
              <li>Once validated, e-invoices cannot be modified (only cancelled)</li>
              <li>Keep your API credentials secure and do not share them</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Link href="/e-invoice">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}