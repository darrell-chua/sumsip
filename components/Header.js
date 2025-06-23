'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCompany } from '@/contexts/CompanyContext'
import Logo from '@/components/Logo'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { UserNav } from '@/components/UserNav'
import CompanyDropdown from '@/components/CompanyDropdown'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()
  const { selectedCompany, companies } = useCompany()

  // Navigation items based on auth state
  const navigation = !isAuthenticated
    ? [
      { name: 'Home', href: '/' },
      { name: 'Features', href: '/#features' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'About', href: '/about' },
    ]
    : [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Accounts', href: '/accounts' },
      { name: 'E-Invoice', href: '/e-invoice' },
      { name: 'Reports', href: '/reports' },
      { name: 'Companies', href: '/companies' },
    ]

  // Handle scroll events for styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-200',
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">SumSip</span>
            <Logo />  {/* This will now show icon + text */}
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
          {isAuthenticated ? (
            <>
              {companies.length > 0 && <CompanyDropdown />}
              <UserNav user={user} />
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">
                Log in
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="fixed inset-0 z-10 bg-black/10" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">SumSip</span>
                <Logo />  {/* This is responsive - shows icon only on mobile */}
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile Company Selector */}
                {isAuthenticated && companies.length > 0 && (
                  <div className="py-6">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Company</h3>
                      <CompanyDropdown />
                    </div>
                  </div>
                )}

                <div className="py-6">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/profile"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 w-full text-left"
                        onClick={() => {
                          logout()
                          setMobileMenuOpen(false)
                        }}
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}