'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useEInvoice } from '@/contexts/EInvoiceContext';
import { Button } from '@/components/ui/Button';

export default function CreateEInvoice() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedCompany } = useCompany();
  const { createEInvoice, submitToLHDN, settings } = useEInvoice();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoice, setInvoice] = useState({
    // Document Info
    invoiceType: 'invoice',
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
    
    // Supplier Info (from company)
    supplierName: selectedCompany?.name || '',
    supplierTin: settings.tin || '',
    supplierSstReg: settings.sst || '',
    supplierMsic: settings.msic || '',
    supplierBusinessActivity: settings.businessActivity || '',
    supplierAddress: selectedCompany?.address || '',
    
    // Customer Info
    customerName: '',
    customerTin: '',
    customerSstReg: '',
    customerAddress: '',
    customerEmail: '',
    customerPhone: '',
    
    // Line Items
    items: [
      {
        id: 1,
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxType: 'SR', // Standard Rate
        taxRate: 6,
        taxAmount: 0,
        amount: 0
      }
    ],
    
    // Totals
    subtotal: 0,
    totalTax: 0,
    totalAmount: 0,
    
    // Payment Info
    paymentMethod: 'cash',
    paymentTerms: 'cash',
    paymentReference: ''
  });

  const taxTypes = [
    { code: 'SR', name: 'Standard Rate', rate: 6 },
    { code: 'ZR', name: 'Zero Rated', rate: 0 },
    { code: 'ES', name: 'Exempt', rate: 0 },
    { code: 'OS', name: 'Out of Scope', rate: 0 },
    { code: 'NS', name: 'Not Subject to Tax', rate: 0 }
  ];

  const updateItem = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index][field] = value;
    
    // Calculate amounts
    if (field === 'quantity' || field === 'unitPrice' || field === 'taxType') {
      const item = newItems[index];
      const taxType = taxTypes.find(t => t.code === item.taxType);
      const taxRate = taxType?.rate || 0;
      
      item.amount = item.quantity * item.unitPrice;
      item.taxRate = taxRate;
      item.taxAmount = (item.amount * taxRate) / 100;
    }
    
    // Update totals
    const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
    const totalTax = newItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalAmount = subtotal + totalTax;
    
    setInvoice({
      ...invoice,
      items: newItems,
      subtotal,
      totalTax,
      totalAmount
    });
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, {
        id: invoice.items.length + 1,
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxType: 'SR',
        taxRate: 6,
        taxAmount: 0,
        amount: 0
      }]
    });
  };

  const removeItem = (index) => {
    if (invoice.items.length > 1) {
      const newItems = invoice.items.filter((_, i) => i !== index);
      
      // Recalculate totals
      const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
      const totalTax = newItems.reduce((sum, item) => sum + item.taxAmount, 0);
      const totalAmount = subtotal + totalTax;
      
      setInvoice({
        ...invoice,
        items: newItems,
        subtotal,
        totalTax,
        totalAmount
      });
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      const created = await createEInvoice(invoice);
      router.push(`/e-invoice/${created.id}`);
    } catch (error) {
      alert('Error saving draft: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const created = await createEInvoice(invoice);
      await submitToLHDN(created.id);
      router.push(`/e-invoice/${created.id}`);
    } catch (error) {
      alert('Error submitting invoice: ' + error.message);
    } finally {
      setIsSubmitting(false);
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
                Create E-Invoice
              </h1>
              <p className="mt-1 text-gray-600">Create a new e-invoice for LHDN submission</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Document Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Document Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Type
                </label>
                <select
                  value={invoice.invoiceType}
                  onChange={(e) => setInvoice({ ...invoice, invoiceType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="invoice">Invoice</option>
                  <option value="credit">Credit Note</option>
                  <option value="debit">Debit Note</option>
                  <option value="refund">Refund Note</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoice.invoiceDate}
                  onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Time
                </label>
                <input
                  type="time"
                  value={invoice.invoiceTime}
                  onChange={(e) => setInvoice({ ...invoice, invoiceTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={invoice.customerName}
                  onChange={(e) => setInvoice({ ...invoice, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TIN (Tax Identification Number)
                </label>
                <input
                  type="text"
                  value={invoice.customerTin}
                  onChange={(e) => setInvoice({ ...invoice, customerTin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SST Registration Number
                </label>
                <input
                  type="text"
                  value={invoice.customerSstReg}
                  onChange={(e) => setInvoice({ ...invoice, customerSstReg: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={invoice.customerEmail}
                  onChange={(e) => setInvoice({ ...invoice, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  value={invoice.customerAddress}
                  onChange={(e) => setInvoice({ ...invoice, customerAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={2}
                  required
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Line Items</h2>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tax Type</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tax</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="w-full px-2 py-1 border rounded"
                          placeholder="Item description"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border rounded"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 border rounded"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <select
                          value={item.taxType}
                          onChange={(e) => updateItem(index, 'taxType', e.target.value)}
                          className="w-20 px-2 py-1 border rounded"
                        >
                          {taxTypes.map(tax => (
                            <option key={tax.code} value={tax.code}>{tax.code}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2 text-sm">
                        RM {item.taxAmount.toFixed(2)}
                      </td>
                      <td className="px-2 py-2 text-sm font-medium">
                        RM {item.amount.toFixed(2)}
                      </td>
                      <td className="px-2 py-2">
                        {invoice.items.length > 1 && (
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="px-2 py-2 text-right font-medium">Subtotal:</td>
                    <td className="px-2 py-2 font-medium">RM {invoice.subtotal.toFixed(2)}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="px-2 py-2 text-right font-medium">Total Tax:</td>
                    <td className="px-2 py-2 font-medium">RM {invoice.totalTax.toFixed(2)}</td>
                    <td></td>
                  </tr>
                  <tr className="text-lg">
                    <td colSpan="5" className="px-2 py-2 text-right font-semibold">Total Amount:</td>
                    <td className="px-2 py-2 font-semibold">RM {invoice.totalAmount.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={invoice.paymentMethod}
                  onChange={(e) => setInvoice({ ...invoice, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="cash">Cash</option>
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms
                </label>
                <select
                  value={invoice.paymentTerms}
                  onChange={(e) => setInvoice({ ...invoice, paymentTerms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="cash">Cash</option>
                  <option value="net30">Net 30 Days</option>
                  <option value="net60">Net 60 Days</option>
                  <option value="net90">Net 90 Days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={invoice.paymentReference}
                  onChange={(e) => setInvoice({ ...invoice, paymentReference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Link href="/e-invoice">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button 
              variant="secondary" 
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !invoice.customerName || !invoice.customerAddress}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit to LHDN
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}