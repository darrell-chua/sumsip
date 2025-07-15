'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ProfitChart({ period, companyId }) {
  const getChartData = () => {
    const baseData = {
      monthly: [
        { name: 'Jan', profit: 4000 },
        { name: 'Feb', profit: 3000 },
        { name: 'Mar', profit: 5000 },
        { name: 'Apr', profit: 4500 },
        { name: 'May', profit: 6000 },
        { name: 'Jun', profit: 5500 },
      ],
      quarterly: [
        { name: 'Q1', profit: 12000 },
        { name: 'Q2', profit: 16000 },
        { name: 'Q3', profit: 14000 },
        { name: 'Q4', profit: 18000 },
      ],
      yearly: [
        { name: '2021', profit: 45000 },
        { name: '2022', profit: 52000 },
        { name: '2023', profit: 60000 },
        { name: '2024', profit: 65000 },
      ],
    }
    return baseData[period] || baseData.monthly
  }
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={getChartData()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="profit" 
          stroke="#2563eb" 
          strokeWidth={2}
          dot={{ fill: '#2563eb' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}