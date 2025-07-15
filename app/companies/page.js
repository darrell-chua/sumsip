'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Building2, X, Trash2, Edit3 } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { Button } from '@/components/ui/Button'

export default function CompaniesPage() {
  const { companies, createCompany, selectCompany, selectedCompany, deleteCompany, updateCompany } = useCompany()
  const router = useRouter()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    status: 'active'
  })
  const [editFormData, setEditFormData] = useState({
    name: '',
    industry: '',
    status: 'active'
  })

  useEffect(() => {
    // Show companies for a single user
  }, [router])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Edit company
  const handleEditCompany = (e, company) => {
    e.stopPropagation() // Prevent card selection when clicking edit
    setEditingCompany(company)
    setEditFormData({
      name: company.name,
      industry: company.industry,
      status: company.status
    })
    setShowEditForm(true)
  }

  // Update company
  const handleUpdateCompany = (e) => {
    e.preventDefault()
    
    if (!editFormData.name.trim()) {
      alert('Please enter a company name')
      return
    }

    updateCompany(editingCompany.id, {
      name: editFormData.name.trim(),
      industry: editFormData.industry.trim() || 'Not specified',
      status: editFormData.status
    })

    // Reset form and close modal
    setEditFormData({
      name: '',
      industry: '',
      status: 'active'
    })
    setEditingCompany(null)
    setShowEditForm(false)
  }

  // Add company
  const handleAddCompany = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter a company name')
      return
    }

    const { success, error } = await createCompany({
      name: formData.name.trim(),
      industry: formData.industry.trim() || 'Not specified',
      status: formData.status
    })
    if (!success) {
      alert('Error adding company: ' + error)
      return
    }

    // Reset form and close modal
    setFormData({
      name: '',
      industry: '',
      status: 'active'
    })
    setShowAddForm(false)
  }

  // Select company
  const handleCompanySelect = (company) => {
    selectCompany(company); // Pass the full company object, not just company.id
  }

  // Delete company
  const handleDeleteCompany = async (e, company) => {
    e.stopPropagation() // Prevent card selection when clicking delete
    
    if (window.confirm(`Are you sure you want to delete "${company.name}"? This action cannot be undone.`)) {
      await deleteCompany(company.id)
      // Optionally reload companies here if not handled by context
    }
  }

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Companies</h1>
              <p className="mt-2 text-gray-600">
                Manage your companies and switch between them to handle different business accounts.
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Add Company Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add New Company</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleAddCompany} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Enter company name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleFormChange}
                      placeholder="e.g., Technology, Retail, Manufacturing"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                    >
                      Add Company
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Company Form Modal */}
          {showEditForm && editingCompany && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Edit Company</h2>
                  <button
                    onClick={() => {
                      setShowEditForm(false)
                      setEditingCompany(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdateCompany} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                      placeholder="Enter company name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={editFormData.industry}
                      onChange={handleEditFormChange}
                      placeholder="e.g., Technology, Retail, Manufacturing"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditForm(false)
                        setEditingCompany(null)
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Companies List */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Your Companies</h2>
            
            {companies.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
                <p className="text-gray-500 mb-6">
                  Get started by adding your first company to manage your business accounts.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <div 
                    key={company.id} 
                    className={`border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                      selectedCompany?.id === company.id 
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleCompanySelect(company)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {company.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{company.industry}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          company.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {company.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        {selectedCompany?.id === company.id && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Selected
                          </span>
                        )}
                        <button
                          onClick={(e) => handleEditCompany(e, company)}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                          title="Edit company"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteCompany(e, company)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete company"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {companies.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {companies.length} {companies.length === 1 ? 'company' : 'companies'} total
                  {selectedCompany && (
                    <span className="ml-2">
                      • Currently selected: <strong>{selectedCompany.name}</strong>
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}