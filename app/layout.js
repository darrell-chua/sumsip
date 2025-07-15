import './globals.css';
import { CompanyProvider } from '@/contexts/CompanyContext';
import { ReportsProvider } from '@/contexts/ReportsContext';
import { EInvoiceProvider } from '@/contexts/EInvoiceContext';
import LayoutWrapper from '@/components/LayoutWrapper';

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
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CompanyProvider>
          <ReportsProvider>
            <EInvoiceProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </EInvoiceProvider>
          </ReportsProvider>
        </CompanyProvider>
      </body>
    </html>
  );
}