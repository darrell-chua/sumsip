'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  return (
    <div className="overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium text-indigo-600 ring-1 ring-inset ring-indigo-600/20">
                <span>Financial management made simple</span>
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Manage Your Finances with Ease
              </h1>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                Sipping coffee, managing money - all at once.
              </h2>
              <p className="mt-6 text-xl text-gray-600">
                Track profits, manage accounts, and keep your business finances organized in one place. SumSip helps you make smarter financial decisions.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                <Link href="/signup">
                  <Button size="lg" className="group">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/#features">
                  <Button variant="outline" size="lg">
                    Learn more
                  </Button>
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="flex gap-x-3">
                  <CheckCircle2 className="h-7 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Multi-Company Support</h3>
                    <p className="mt-2 text-gray-600">Manage finances for multiple businesses in one place</p>
                  </div>
                </div>
                <div className="flex gap-x-3">
                  <CheckCircle2 className="h-7 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Financial Dashboard</h3>
                    <p className="mt-2 text-gray-600">Get a complete overview of your business finances</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div 
            className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="-mx-4 h-[448px] px-9 [mask-image:linear-gradient(to_bottom,white_60%,transparent)] sm:mx-0 lg:absolute lg:-inset-x-10 lg:-bottom-20 lg:-top-10 lg:h-auto lg:px-0 lg:pt-10 xl:-bottom-32">
              <div className="relative aspect-[366/729] mx-auto max-w-[366px] shadow-2xl rounded-[2.5rem] border-4 border-gray-800">
                <div className="absolute inset-0 rounded-[2rem] bg-gray-800 px-2 py-6 shadow-xl">
                  <Image
                    src="/dashboard-preview.png"
                    alt="App screenshot"
                    className="h-full w-full rounded-[1.25rem] object-cover"
                    width={366}
                    height={729}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}