import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CompanyProvider } from '@/contexts/CompanyContext';
import { ReportsProvider } from '@/contexts/ReportsContext';
import { EInvoiceProvider } from '@/contexts/EInvoiceContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'SumSip - Financial Management',
  description: 'Comprehensive financial management solution',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/Logo.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CompanyProvider>
            <ReportsProvider>
              <EInvoiceProvider>
                <div className="min-h-screen bg-gray-50">
                  <Header />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </EInvoiceProvider>
            </ReportsProvider>
          </CompanyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}