'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ChevronDown, LogOut } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import Logo from '@/components/Logo'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import CompanyDropdown from '@/components/CompanyDropdown'
import { supabase } from '../lib/supabase';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [user, setUser] = useState(null);
  const pathname = usePathname()
  const router = useRouter()
  const { selectedCompany, companies } = useCompany()

  // Navigation items for single user
  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Transactions', href: '/accounts' },
    { name: 'E-Invoice', href: '/e-invoice' },
    { name: 'Reports', href: '/reports' },
    { name: 'Companies', href: '/companies' },
  ]

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsOwner(JSON.parse(storedUser).role === 'owner');
    } else {
      setUser(null);
      setIsOwner(false);
    }
  }, [pathname]);

  const handleLogout = async () => {
    localStorage.removeItem('user');
    await supabase.auth.signOut();
    router.push('/login');
  };

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
    <header className={cn('sticky top-0 z-40 w-full bg-white shadow', scrolled && 'shadow-md')}> 
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <span className="sr-only">SumSip</span>
            <Logo />
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
        <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                pathname === item.href
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-700 hover:text-indigo-600 border-b-2 border-transparent',
                'text-base font-medium px-2 py-1 transition-colors duration-150'
              )}
            >
              {item.name}
            </Link>
          ))}
          {isOwner && (
            <Link
              href="/roles"
              className={cn(
                pathname === '/roles'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-700 hover:text-indigo-600 border-b-2 border-transparent',
                'text-base font-medium px-2 py-1 transition-colors duration-150'
              )}
            >
              Roles
            </Link>
          )}
          {companies.length > 0 && <CompanyDropdown />}
          {user && (
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow flex items-center"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
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
                <Logo />
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
                      className={cn(
                        pathname === item.href
                          ? 'text-indigo-600 border-l-4 border-indigo-600 bg-indigo-50'
                          : 'text-gray-700 hover:text-indigo-600 border-l-4 border-transparent',
                        'block rounded-lg px-3 py-2 text-base font-medium transition-colors duration-150'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isOwner && (
                    <Link
                      href="/roles"
                      className={cn(
                        pathname === '/roles'
                          ? 'text-indigo-600 border-l-4 border-indigo-600 bg-indigo-50'
                          : 'text-gray-700 hover:text-indigo-600 border-l-4 border-transparent',
                        'block rounded-lg px-3 py-2 text-base font-medium transition-colors duration-150'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Manage Roles
                    </Link>
                  )}
                  {companies.length > 0 && <CompanyDropdown />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}