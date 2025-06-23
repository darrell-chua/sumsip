'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Plus, Building2 } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'

export default function CompanyDropdown() {
  const { companies, selectedCompany, selectCompany } = useCompany()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleCompanySelect = (id) => {
    selectCompany(id)
    setIsOpen(false)
  }

  const handleAddCompany = () => {
    router.push('/companies')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[180px] px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
      >
        <div className="flex items-center">
          <Building2 className="h-4 w-4 text-gray-400 mr-2" />
          {selectedCompany ? (
            <span className="font-medium text-gray-900 truncate">{selectedCompany.name}</span>
          ) : (
            <span className="text-gray-500">Select Company</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 ml-2 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 z-40 mt-2 w-full min-w-[200px] bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1">
              {companies.length > 0 ? (
                companies.map(company => (
                  <button
                    key={company.id}
                    onClick={() => handleCompanySelect(company.id)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                      selectedCompany && selectedCompany.id === company.id 
                        ? 'bg-indigo-50 text-indigo-900 font-medium' 
                        : 'text-gray-700'
                    }`}
                  >
                    <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                    <div className="flex-1">
                      <div className="font-medium">{company.name}</div>
                      <div className="text-xs text-gray-500">{company.industry}</div>
                    </div>
                    {selectedCompany && selectedCompany.id === company.id && (
                      <div className="w-2 h-2 bg-indigo-600 rounded-full ml-2" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500 text-center">
                  No companies found
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200">
              <button
                onClick={handleAddCompany}
                className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Company
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}