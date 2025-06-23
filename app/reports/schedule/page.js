'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Plus, Clock, Calendar, Mail, 
  Play, Pause, Edit, Trash2, CheckCircle, 
  XCircle, AlertCircle, Send, Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useReports } from '@/contexts/ReportsContext';
import { Button } from '@/components/ui/Button';

export default function ScheduledReportsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedCompany } = useCompany();
  const { scheduledReports, scheduleReport } = useReports();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  
  const [scheduleForm, setScheduleForm] = useState({
    reportType: 'profit-loss',
    reportName: '',
    frequency: 'weekly',
    dayOfWeek: '1', // Monday
    dayOfMonth: '1',
    time: '08:00',
    emailRecipients: [user?.email || ''],
    format: 'pdf',
    enabled: true
  });

  const reportTypes = [
    { value: 'profit-loss', label: 'Profit & Loss Statement' },
    { value: 'balance-sheet', label: 'Balance Sheet' },
    { value: 'cash-flow', label: 'Cash Flow Statement' },
    { value: 'custom', label: 'Custom Report' }
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const daysOfWeek = [
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' }
  ];

  const handleCreateSchedule = () => {
    setEditingSchedule(null);
    setScheduleForm({
      reportType: 'profit-loss',
      reportName: '',
      frequency: 'weekly',
      dayOfWeek: '1',
      dayOfMonth: '1',
      time: '08:00',
      emailRecipients: [user?.email || ''],
      format: 'pdf',
      enabled: true
    });
    setShowScheduleModal(true);
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setScheduleForm({
      ...schedule,
      emailRecipients: schedule.emailRecipients || [user?.email || '']
    });
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = () => {
    if (!scheduleForm.reportName) {
      alert('Please enter a report name');
      return;
    }

    const newSchedule = {
      ...scheduleForm,
      id: editingSchedule?.id || Date.now(),
      company: selectedCompany,
      createdBy: user.email
    };

    if (editingSchedule) {
      // Update existing schedule
      // In real app, this would update via API
      alert('Schedule updated successfully!');
    } else {
      // Create new schedule
      scheduleReport(newSchedule);
      alert('Schedule created successfully!');
    }

    setShowScheduleModal(false);
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (confirm('Are you sure you want to delete this scheduled report?')) {
      // In real app, this would delete via API
      alert('Schedule deleted successfully!');
    }
  };

  const handleToggleSchedule = (scheduleId, enabled) => {
    // In real app, this would update via API
    alert(`Schedule ${enabled ? 'enabled' : 'disabled'} successfully!`);
  };

  const handleRunNow = (scheduleId) => {
    alert('Running report now...');
    // In real app, this would trigger immediate report generation
  };

  const addEmailRecipient = () => {
    setScheduleForm({
      ...scheduleForm,
      emailRecipients: [...scheduleForm.emailRecipients, '']
    });
  };

  const updateEmailRecipient = (index, value) => {
    const newRecipients = [...scheduleForm.emailRecipients];
    newRecipients[index] = value;
    setScheduleForm({ ...scheduleForm, emailRecipients: newRecipients });
  };

  const removeEmailRecipient = (index) => {
    if (scheduleForm.emailRecipients.length > 1) {
      setScheduleForm({
        ...scheduleForm,
        emailRecipients: scheduleForm.emailRecipients.filter((_, i) => i !== index)
      });
    }
  };

  const getNextRunTime = (schedule) => {
    // In real app, calculate actual next run time
    const now = new Date();
    switch (schedule.frequency) {
      case 'daily':
        now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
      case 'quarterly':
        now.setMonth(now.getMonth() + 3);
        break;
    }
    return now.toLocaleString();
  };

  const getStatusIcon = (schedule) => {
    if (!schedule.enabled) {
      return <XCircle className="w-5 h-5 text-gray-400" />;
    }
    if (schedule.lastRun && schedule.lastRunStatus === 'success') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (schedule.lastRun && schedule.lastRunStatus === 'failed') {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    return <Clock className="w-5 h-5 text-yellow-500" />;
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
                Scheduled Reports
              </h1>
              <p className="mt-1 text-gray-600">Automate your report generation and delivery</p>
            </div>
            <Button onClick={handleCreateSchedule}>
              <Plus className="w-4 h-4 mr-2" />
              Create Schedule
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {scheduledReports.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {scheduledReports.map((schedule) => (
              <div key={schedule.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {getStatusIcon(schedule)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{schedule.reportName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {reportTypes.find(t => t.value === schedule.reportType)?.label || schedule.reportType}
                      </p>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {frequencies.find(f => f.value === schedule.frequency)?.label}
                            {schedule.frequency === 'weekly' && ` on ${daysOfWeek.find(d => d.value === schedule.dayOfWeek)?.label}`}
                            {schedule.frequency === 'monthly' && ` on day ${schedule.dayOfMonth}`}
                            {' at '}{schedule.time}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>{schedule.emailRecipients?.length || 0} recipient(s)</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Next run: {getNextRunTime(schedule)}</span>
                        </div>
                        
                        {schedule.lastRun && (
                          <div className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span>Last run: {new Date(schedule.lastRun).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRunNow(schedule.id)}
                      disabled={!schedule.enabled}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleSchedule(schedule.id, !schedule.enabled)}
                    >
                      {schedule.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSchedule(schedule)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Scheduled Reports</h2>
            <p className="text-gray-600 mb-6">Create automated reports that run on a schedule</p>
            <Button onClick={handleCreateSchedule}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Schedule
            </Button>
          </div>
        )}
      </main>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Report Configuration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Report Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Report Type
                    </label>
                    <select
                      value={scheduleForm.reportType}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, reportType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      {reportTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Report Name
                    </label>
                    <input
                      type="text"
                      value={scheduleForm.reportName}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, reportName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Monthly P&L Report"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select
                      value={scheduleForm.frequency}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      {frequencies.map(freq => (
                        <option key={freq.value} value={freq.value}>{freq.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {scheduleForm.frequency === 'weekly' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Day of Week
                      </label>
                      <select
                        value={scheduleForm.dayOfWeek}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, dayOfWeek: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        {daysOfWeek.map(day => (
                          <option key={day.value} value={day.value}>{day.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {scheduleForm.frequency === 'monthly' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Day of Month
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="28"
                        value={scheduleForm.dayOfMonth}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, dayOfMonth: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduleForm.time}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Format
                    </label>
                    <select
                      value={scheduleForm.format}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, format: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      {formatOptions.map(format => (
                        <option key={format.value} value={format.value}>{format.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Email Recipients */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Email Recipients</h3>
                  <Button variant="outline" size="sm" onClick={addEmailRecipient}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Recipient
                  </Button>
                </div>
                <div className="space-y-2">
                  {scheduleForm.emailRecipients.map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmailRecipient(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="email@example.com"
                      />
                      {scheduleForm.emailRecipients.length > 1 && (
                        <button
                          onClick={() => removeEmailRecipient(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSchedule}>
                {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}