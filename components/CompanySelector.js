'use client'
import { useState } from 'react'
import { useCompany } from '@/contexts/CompanyContext'

export default function CompanySelector() {
  const { companies, selectedCompany, selectCompany, addCompany } = useCompany()
  const [showModal, setShowModal] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState('')

  const handleAddCompany = (e) => {
    e.preventDefault()
    if (newCompanyName.trim()) {
      addCompany({ name: newCompanyName.trim() })
      setNewCompanyName('')
      setShowModal(false)
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <select
          value={selectedCompany?.id || ''}
          onChange={(e) => selectCompany(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
        >
          + Add
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Company</h2>
            <form onSubmit={handleAddCompany}>
              <input
                type="text"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Company Name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}