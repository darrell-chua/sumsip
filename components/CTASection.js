import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function CTASection() {
  return (
    <div className="bg-indigo-600">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to take control of your finances?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
            Join thousands of businesses who trust SumSip to manage their financial operations efficiently and effectively.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 border-white"
              >
                Get Started Today
              </Button>
            </Link>
            <Link href="/#features" className="text-sm font-semibold leading-6 text-white">
              Learn more about features <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}