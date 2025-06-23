'use client';

import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, DollarSign, Activity, Filter, Edit, Trash2, Eye, EyeOff, ChevronDown, BarChart3, TrendingUp, Mail, Building } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, email: 'john@company.com', plan: 'Professional', status: 'Active', companies: 3, createdAt: '2024-12-15' },
    { id: 2, email: 'sarah@startup.com', plan: 'Starter', status: 'Active', companies: 1, createdAt: '2024-12-20' },
    { id: 3, email: 'mike@enterprise.com', plan: 'Enterprise', status: 'Active', companies: 8, createdAt: '2024-11-10' },
  ]);
  
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    plan: 'Starter'
  });

  const [stats, setStats] = useState({
    totalUsers: 156,
    activeUsers: 142,
    revenue: 'RM 48,750',
    growth: '+12.5%'
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser({ ...newUser, password });
  };

  const handleCreateUser = () => {
    if (!newUser.email || !newUser.password) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Add user creation logic here
    console.log('Creating user:', newUser);
    
    // Add to users list (temporary - in real app this would be an API call)
    const newId = Math.max(...users.map(u => u.id)) + 1;
    setUsers([...users, {
      id: newId,
      email: newUser.email,
      plan: newUser.plan,
      status: 'Active',
      companies: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }]);
    
    // Reset form
    setNewUser({ email: '', password: '', plan: 'Starter' });
    alert('User created successfully!');
    setActiveTab('users');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">SumSip Admin</h1>
              <span className="px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">admin@sumsip.com</span>
              <button className="text-sm text-gray-500 hover:text-gray-700">Logout</button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Create User
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                    <p className="text-sm text-green-600 mt-1">+23 this month</p>
                  </div>
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeUsers}</p>
                    <p className="text-sm text-gray-500 mt-1">91% of total</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.revenue}</p>
                    <p className="text-sm text-green-600 mt-1">{stats.growth} vs last month</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Companies</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">487</p>
                    <p className="text-sm text-gray-500 mt-1">Across all users</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Building className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Starter</span>
                    <span className="text-sm text-gray-600">45 users (29%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '29%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Professional</span>
                    <span className="text-sm text-gray-600">87 users (56%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '56%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Enterprise</span>
                    <span className="text-sm text-gray-600">24 users (15%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">New user registered: alex@tech.com</span>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">User upgraded to Professional: sarah@startup.com</span>
                  </div>
                  <span className="text-xs text-gray-500">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">New company added by john@company.com</span>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users by email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option>All Plans</option>
                    <option>Starter</option>
                    <option>Professional</option>
                    <option>Enterprise</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Companies</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">{user.email[0].toUpperCase()}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.plan === 'Enterprise' ? 'bg-green-100 text-green-800' :
                          user.plan === 'Professional' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.companies}/
                        {user.plan === 'Starter' ? '2' : user.plan === 'Professional' ? '4' : '10'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create User Tab */}
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New User Account</h2>
              
              <div className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="user@example.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Temporary Password
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter temporary password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">User will be required to change password on first login</p>
                </div>

                {/* Plan Selection */}
                <div>
                  <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    id="plan"
                    value={newUser.plan}
                    onChange={(e) => setNewUser({ ...newUser, plan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Starter">Starter - RM2,999/year (Up to 2 companies)</option>
                    <option value="Professional">Professional - RM4,999/year (Up to 4 companies)</option>
                    <option value="Enterprise">Enterprise - RM7,999/year (Up to 10 companies)</option>
                  </select>
                </div>

                {/* Additional Options */}
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <span className="ml-2 text-sm text-gray-700">Send welcome email with login credentials</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Require password change on first login</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <span className="ml-2 text-sm text-gray-700">Start 14-day trial period</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setNewUser({ email: '', password: '', plan: 'Starter' })}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateUser}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Quick Actions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• After creating an account, the user will receive an email with login instructions</li>
                <li>• You can manage user permissions and plan limits from the User Management tab</li>
                <li>• Enterprise users can be assigned a dedicated account manager</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;