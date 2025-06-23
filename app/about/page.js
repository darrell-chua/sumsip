import Link from 'next/link'
import { Heart, Users, TrendingUp, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              About SumSip
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Empowering small business owners to take control of their finances without the complexity of traditional accounting software.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            SumSip was created with a simple belief: every small business owner deserves access to easy-to-use financial management tools. 
            Whether you run a cozy coffee shop, a neighborhood restaurant, a small grocery store, or any other small business, 
            you shouldn't need to hire a professional accountant just to keep track of your finances.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <Users className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                For Small Business Owners
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Designed specifically for small restaurants, coffee shops, grocery stores, and other local businesses 
                  who need simple financial tracking without the overhead of complex accounting systems.
                </p>
              </dd>
            </div>

            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <TrendingUp className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Easy Financial Tracking
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Record your income and expenses with just a few clicks, then visualize your profit trends 
                  through clear, easy-to-understand charts that help you make informed business decisions.
                </p>
              </dd>
            </div>

            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <Heart className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Built with Care
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Created by a freelance programmer who understands the challenges small businesses face. 
                  Every feature is designed to make your financial management easier and more enjoyable.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">My Story</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              As a freelance programmer, I've had the opportunity to work with many small business owners over the years. 
              I noticed a common challenge: most accounting software was either too complex, too expensive, or both.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Small business owners like restaurant managers, coffee shop owners, and grocery store operators 
              just needed a simple way to track their daily income and expenses, and see how their business was performing. 
              They didn't need complex features designed for large corporations – they needed something straightforward and reliable.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              That's why I created SumSip. It's designed to be the financial management tool I wish existed when I saw 
              these business owners struggling with overcomplicated software or manual spreadsheets.
            </p>
          </div>
        </div>
      </div>

      {/* Commitment Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 flex items-center justify-center rounded-lg bg-indigo-600">
              <MessageCircle className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            A Commitment to Improvement
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            I'll be honest with you – as a solo developer, SumSip might not be perfect. There might be features that don't work 
            exactly as you'd expect, or things that could be improved. But here's what I promise:
          </p>
          
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">I Listen</h3>
              <p className="text-gray-600">Your feedback matters. Every suggestion helps make SumSip better for everyone.</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">I Improve</h3>
              <p className="text-gray-600">Regular updates and improvements based on real user needs and experiences.</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">I Care</h3>
              <p className="text-gray-600">Your success is my success. I want SumSip to genuinely help improve your business and life.</p>
            </div>
          </div>

          <p className="mt-10 text-lg leading-8 text-gray-600">
            My goal is simple: to help you manage your finances more easily so you can focus on what you do best – 
            running your business and serving your customers. If SumSip can make your financial management a little bit easier 
            and help improve your business success, then I've accomplished what I set out to do.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
              Join the community of small business owners who are taking control of their finances with SumSip.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 border-white"
                >
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/contact" className="text-sm font-semibold leading-6 text-white">
                Send me feedback <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}