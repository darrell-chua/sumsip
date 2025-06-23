'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { BarChart3, BuildingIcon, PieChart, ScrollText, UsersIcon, WalletIcon } from 'lucide-react'

const features = [
  {
    name: 'Financial Dashboard',
    description: 'Get a comprehensive overview of your business finances with interactive charts and key metrics.',
    icon: BarChart3,
  },
  {
    name: 'Multi-Company Support',
    description: 'Manage finances for multiple businesses in one place with easy switching between companies.',
    icon: BuildingIcon,
  },
  {
    name: 'Transaction Management',
    description: 'Track all your financial transactions with categories, filters, and search capabilities.',
    icon: WalletIcon,
  },
  {
    name: 'Financial Reports',
    description: 'Generate detailed financial reports to track performance and make informed decisions.',
    icon: ScrollText,
  },
  {
    name: 'User-Friendly',
    description: 'SumSip is designed to be user-friendly, so you can focus on managing your finances.',
    icon: UsersIcon,
  },
  {
    name: 'Analytics & Insights',
    description: 'Gain valuable insights into your financial data with advanced analytics.',
    icon: PieChart,
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple yet powerful financial management
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            SumSip provides all the tools you need to manage your business finances efficiently and make informed decisions.
          </p>
        </div>
        <div 
          ref={ref}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name}
                className="flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}