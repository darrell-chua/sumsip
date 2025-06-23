'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Plus, Trash2, Save, Play, Settings, 
  Calendar, Filter, BarChart3, PieChart, LineChart, 
  Table, Download, GripVertical
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useReports } from '@/contexts/ReportsContext';
import { Button } from '@/components/ui/Button';

export default function CustomReportBuilder() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedCompany } = useCompany();
  const { saveCustomReport } = useReports();
  
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    dateRange: {
      type: 'custom', // custom, last30days, lastMonth, lastQuarter, lastYear
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    },
    dataFields: [],
    filters: [],
    groupBy: '',
    chartType: 'table', // table, bar, line, pie
    layout: 'portrait' // portrait, landscape
  });

  const [availableFields] = useState([
    { id: 'date', name: 'Transaction Date', type: 'date', category: 'General' },
    { id: 'amount', name: 'Amount', type: 'number', category: 'Financial' },
    { id: 'type', name: 'Transaction Type', type: 'text', category: 'General' },
    { id: 'category', name: 'Category', type: 'text', category: 'General' },
    { id: 'description', name: 'Description', type: 'text', category: 'General' },
    { id: 'customer', name: 'Customer', type: 'text', category: 'Relationship' },
    { id: 'vendor', name: 'Vendor', type: 'text', category: 'Relationship' },
    { id: 'profit', name: 'Profit', type: 'calculated', category: 'Financial' },
    { id: 'revenue', name: 'Revenue', type: 'calculated', category: 'Financial' },
    { id: 'expenses', name: 'Expenses', type: 'calculated', category: 'Financial' }
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const dateRangePresets = [
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'lastQuarter', label: 'Last Quarter' },
    { value: 'lastYear', label: 'Last Year' },
    { value: 'yearToDate', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const chartTypes = [
    { value: 'table', label: 'Table', icon: Table },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'line', label: 'Line Chart', icon: LineChart },
    { value: 'pie', label: 'Pie Chart', icon: PieChart }
  ];

  const handleFieldDrop = (e, field) => {
    e.preventDefault();
    if (!reportConfig.dataFields.find(f => f.id === field.id)) {
      setReportConfig({
        ...reportConfig,
        dataFields: [...reportConfig.dataFields, field]
      });
    }
  };

  const removeField = (fieldId) => {
    setReportConfig({
      ...reportConfig,
      dataFields: reportConfig.dataFields.filter(f => f.id !== fieldId)
    });
  };

  const addFilter = () => {
    setReportConfig({
      ...reportConfig,
      filters: [...reportConfig.filters, { field: '', operator: 'equals', value: '' }]
    });
  };

  const updateFilter = (index, updates) => {
    const newFilters = [...reportConfig.filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setReportConfig({ ...reportConfig, filters: newFilters });
  };

  const removeFilter = (index) => {
    setReportConfig({
      ...reportConfig,
      filters: reportConfig.filters.filter((_, i) => i !== index)
    });
  };

  const generatePreview = () => {
    // In a real app, this would generate actual data based on config
    const mockData = [
      { date: '2025-01-01', amount: 1500, type: 'income', category: 'Sales' },
      { date: '2025-01-02', amount: 500, type: 'expense', category: 'Supplies' },
      { date: '2025-01-03', amount: 2000, type: 'income', category: 'Services' },
      { date: '2025-01-04', amount: 800, type: 'expense', category: 'Rent' }
    ];
    setPreviewData(mockData);
  };

  const handleSaveReport = async () => {
    if (!reportConfig.name) {
      alert('Please enter a report name');
      return;
    }

    const report = {
      ...reportConfig,
      type: 'Custom',
      createdBy: user.email,
      company: selectedCompany
    };

    await saveCustomReport(report);
    alert('Report saved successfully!');
    router.push('/reports');
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
                Custom Report Builder
              </h1>
              <p className="mt-1 text-gray-600">Create personalized reports for your business</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={generatePreview}>
                <Play className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSaveReport}>
                <Save className="w-4 h-4 mr-2" />
                Save Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Available Fields */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Fields</h3>
              <div className="space-y-2">
                {Object.entries(
                  availableFields.reduce((acc, field) => {
                    if (!acc[field.category]) acc[field.category] = [];
                    acc[field.category].push(field);
                    return acc;
                  }, {})
                ).map(([category, fields]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                    <div className="space-y-1 mb-3">
                      {fields.map((field) => (
                        <div
                          key={field.id}
                          draggable
                          onDragStart={() => setIsDragging(true)}
                          onDragEnd={(e) => {
                            setIsDragging(false);
                            handleFieldDrop(e, field);
                          }}
                          className="flex items-center p-2 bg-gray-50 rounded cursor-move hover:bg-gray-100"
                        >
                          <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm">{field.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Report Configuration */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Name
                  </label>
                  <input
                    type="text"
                    value={reportConfig.name}
                    onChange={(e) => setReportConfig({ ...reportConfig, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Monthly Sales Report"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={reportConfig.description}
                    onChange={(e) => setReportConfig({ ...reportConfig, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Brief description of the report"
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Range</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Range Type
                  </label>
                  <select
                    value={reportConfig.dateRange.type}
                    onChange={(e) => setReportConfig({
                      ...reportConfig,
                      dateRange: { ...reportConfig.dateRange, type: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {dateRangePresets.map(preset => (
                      <option key={preset.value} value={preset.value}>{preset.label}</option>
                    ))}
                  </select>
                </div>
                {reportConfig.dateRange.type === 'custom' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={reportConfig.dateRange.startDate}
                        onChange={(e) => setReportConfig({
                          ...reportConfig,
                          dateRange: { ...reportConfig.dateRange, startDate: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={reportConfig.dateRange.endDate}
                        onChange={(e) => setReportConfig({
                          ...reportConfig,
                          dateRange: { ...reportConfig.dateRange, endDate: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Selected Fields */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Fields</h3>
              {reportConfig.dataFields.length > 0 ? (
                <div className="space-y-2">
                  {reportConfig.dataFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <div className="flex items-center">
                        <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium">{field.name}</span>
                        <span className="ml-2 text-xs text-gray-500">({field.type})</span>
                      </div>
                      <button
                        onClick={() => removeField(field.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                }`}>
                  <p className="text-gray-500">Drag fields here to add them to your report</p>
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <Button variant="outline" size="sm" onClick={addFilter}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Filter
                </Button>
              </div>
              {reportConfig.filters.length > 0 ? (
                <div className="space-y-3">
                  {reportConfig.filters.map((filter, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <select
                        value={filter.field}
                        onChange={(e) => updateFilter(index, { field: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select field</option>
                        {availableFields.map(field => (
                          <option key={field.id} value={field.id}>{field.name}</option>
                        ))}
                      </select>
                      <select
                        value={filter.operator}
                        onChange={(e) => updateFilter(index, { operator: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="equals">Equals</option>
                        <option value="contains">Contains</option>
                        <option value="greater">Greater than</option>
                        <option value="less">Less than</option>
                      </select>
                      <input
                        type="text"
                        value={filter.value}
                        onChange={(e) => updateFilter(index, { value: e.target.value })}
                        placeholder="Value"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => removeFilter(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No filters applied. Click "Add Filter" to filter your data.</p>
              )}
            </div>

            {/* Display Options */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chart Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {chartTypes.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setReportConfig({ ...reportConfig, chartType: value })}
                        className={`flex items-center justify-center p-3 rounded-lg border ${
                          reportConfig.chartType === value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group By
                  </label>
                  <select
                    value={reportConfig.groupBy}
                    onChange={(e) => setReportConfig({ ...reportConfig, groupBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">No grouping</option>
                    <option value="category">Category</option>
                    <option value="type">Transaction Type</option>
                    <option value="month">Month</option>
                    <option value="week">Week</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview */}
            {previewData && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Preview</h3>
                {reportConfig.chartType === 'table' ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {reportConfig.dataFields.map(field => (
                            <th key={field.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {field.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previewData.map((row, index) => (
                          <tr key={index}>
                            {reportConfig.dataFields.map(field => (
                              <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {row[field.id] || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Chart preview will be displayed here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}