'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 px-4">
      <h1 className="text-4xl font-bold mb-4 text-indigo-700">Welcome to SumSip</h1>
      <p className="text-lg text-gray-700 max-w-xl text-center mb-8">
        SumSip is your all-in-one financial management platform. Effortlessly manage companies, accounts, transactions, e-invoices, and generate insightful reports. Get started and take control of your business finances today!
      </p>
      <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
        onClick={() => router.push('/login')}
      >
        Get Started
      </button>
    </div>
  )
}