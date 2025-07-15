'use client';

import { useState, useEffect, useRef } from 'react';
import { useCompany } from '@/contexts/CompanyContext';
import { supabase } from '@/lib/supabase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import autoTable from 'jspdf-autotable';


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
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const chartRef = useRef();

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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Transaction Report</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label>Date From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label>Date To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="border rounded px-2 py-1">
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label>Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-2 py-1">
            {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <button onClick={handleDownloadPDF} className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded">Download as PDF</button>
      </div>
      <div className="mb-6">
        <div className="flex gap-8">
          <div className="bg-green-100 p-4 rounded w-1/3">
            <div className="text-green-700 font-bold">Total Income</div>
            <div className="text-2xl">RM {totalIncome.toFixed(2)}</div>
          </div>
          <div className="bg-red-100 p-4 rounded w-1/3">
            <div className="text-red-700 font-bold">Total Expenses</div>
            <div className="text-2xl">RM {totalExpenses.toFixed(2)}</div>
          </div>
          <div className="bg-blue-100 p-4 rounded w-1/3">
            <div className="text-blue-700 font-bold">Net Profit</div>
            <div className="text-2xl">RM {netProfit.toFixed(2)}</div>
          </div>
        </div>
      </div>
      <div ref={chartRef} className="mb-6 bg-white p-4 rounded shadow" style={{ width: '100%', height: 300 }}>
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
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Date</th>
              <th className="p-2">Category</th>
              <th className="p-2">Type</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td className="p-2">{t.date}</td>
                <td className="p-2">{t.category}</td>
                <td className="p-2">{t.type}</td>
                <td className="p-2">RM {Number(t.amount).toFixed(2)}</td>
                <td className="p-2">{t.description}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center text-gray-400">No transactions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}