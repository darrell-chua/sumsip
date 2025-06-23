export default function AccountsTable({ accounts }) {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }
  
    const formatAmount = (amount, type) => {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
      
      return (
        <span className={type === 'income' ? 'text-green-600' : 'text-red-600'}>
          {type === 'income' ? '+' : '-'}{formatted}
        </span>
      )
    }
  
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Description</th>
              <th className="text-left py-2 px-4">Category</th>
              <th className="text-left py-2 px-4">Type</th>
              <th className="text-right py-2 px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No entries yet. Add your first entry above.
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr key={account.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{formatDate(account.date)}</td>
                  <td className="py-2 px-4">{account.description}</td>
                  <td className="py-2 px-4">{account.category}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      account.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {account.type}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right">
                    {formatAmount(account.amount, account.type)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )
  }