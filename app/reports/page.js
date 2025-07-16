'use client';

import { useState, useEffect, useRef } from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { supabase } from '@/lib/supabase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import autoTable from 'jspdf-autotable';
import { useRouter } from 'next/navigation';


const categories = [
  { value: '', label: 'All Categories' },
  { value: 'salary', label: 'Salary' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'software', label: 'Software' },
  { value: 'design', label: 'Design' },
  // Add more as needed
];
const types = [
  { value: '', label: 'All Types' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export default function ReportsPage() {
  const { selectedCompany } = useCompany();
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const chartRef = useRef();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/login');
      } else {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!selectedCompany) return;
    const fetchTransactions = async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('company_id', selectedCompany.id);
      const { data, error } = await query;
      if (!error) setTransactions(data || []);
    };
    fetchTransactions();
  }, [selectedCompany]);

  useEffect(() => {
    let data = [...transactions];
    if (dateFrom) data = data.filter(t => t.date >= dateFrom);
    if (dateTo) data = data.filter(t => t.date <= dateTo);
    if (category) data = data.filter(t => t.category === category);
    if (type) data = data.filter(t => t.type === type);
    setFiltered(data);
  }, [transactions, dateFrom, dateTo, category, type]);

  // Calculate summary
  const totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  const netProfit = totalIncome - totalExpenses;

  // Prepare chart data: group by date, sum income and expenses
  const chartData = (() => {
    const map = {};
    filtered.forEach(t => {
      if (!map[t.date]) map[t.date] = { date: t.date, income: 0, expense: 0 };
      if (t.type === 'income') map[t.date].income += Number(t.amount);
      if (t.type === 'expense') map[t.date].expense += Number(t.amount);
    });
    // Sort by date ascending
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  })();

  // PDF Export
  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Transaction Report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Company: ${selectedCompany?.name || '-'}`, 105, 30, { align: 'center' });
    doc.text(`Date: ${dateFrom || '-'} to ${dateTo || '-'}`, 105, 38, { align: 'center' });
    doc.line(20, 42, 190, 42);
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text(`Total Income: RM ${totalIncome.toFixed(2)}`, 20, 52);
    doc.setTextColor(239, 68, 68);
    doc.text(`Total Expenses: RM ${totalExpenses.toFixed(2)}`, 20, 60);
    doc.setTextColor(54, 79, 199);
    doc.text(`Net Profit: RM ${netProfit.toFixed(2)}`, 20, 68);
    doc.setTextColor(0, 0, 0);
    // Chart as image
    if (chartRef.current) {
      const chartCanvas = await html2canvas(chartRef.current);
      const imgData = chartCanvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 20, 75, 170, 50);
    }
    // Table
    let y = 130;
    doc.setFontSize(12);
    doc.text('Transactions:', 20, y);
    y += 4;
    autoTable(doc, {
      startY: y + 2,
      head: [["Date", "Category", "Type", "Amount", "Description"]],
      body: filtered.slice(0, 20).map(t => [t.date, t.category, t.type, `RM ${Number(t.amount).toFixed(2)}`, t.description || '']),
      theme: 'grid',
      headStyles: { fillColor: [54, 79, 199] },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
      tableWidth: 170,
    });
    if (filtered.length > 20) doc.text('... (truncated)', 20, doc.lastAutoTable.finalY + 6);
    doc.save('transaction-report.pdf');
  };

  if (authLoading) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction Report</h1>
      <p className="text-gray-600 mb-6">View, filter, and export your company transactions with summary and chart.</p>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
              {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
              {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <button onClick={handleDownloadPDF} className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold shadow transition">Download as PDF</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center">
          <div className="text-green-700 font-semibold text-sm mb-1">Total Income</div>
          <div className="text-2xl font-bold text-green-700">RM {totalIncome.toFixed(2)}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center">
          <div className="text-red-700 font-semibold text-sm mb-1">Total Expenses</div>
          <div className="text-2xl font-bold text-red-700">RM {totalExpenses.toFixed(2)}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col items-center">
          <div className="text-blue-700 font-semibold text-sm mb-1">Net Profit</div>
          <div className="text-2xl font-bold text-blue-700">RM {netProfit.toFixed(2)}</div>
        </div>
      </div>
      <div ref={chartRef} className="mb-8 bg-white rounded-lg shadow p-6" style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#34c759" name="Income" />
            <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Expense" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-2 font-semibold">Date</th>
                <th className="p-2 font-semibold">Category</th>
                <th className="p-2 font-semibold">Type</th>
                <th className="p-2 font-semibold">Amount</th>
                <th className="p-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-2">{t.date}</td>
                  <td className="p-2">{t.category}</td>
                  <td className="p-2 capitalize">{t.type}</td>
                  <td className="p-2">RM {Number(t.amount).toFixed(2)}</td>
                  <td className="p-2">{t.description}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400 py-4">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}