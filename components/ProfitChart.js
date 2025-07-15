'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ProfitChart({ period, companyId }) {
  // Remove getChartData and hardcoded data
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={[]}>
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