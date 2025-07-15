"use client"
import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const hideHeaderFooter = pathname === '/'

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </>
  )
} 