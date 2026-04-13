import type { Metadata } from 'next';
import { ThemeProvider } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Controle de Contas v2',
  description: 'Aplicativo elegante para gerenciar contas a pagar com design premium',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  icons: {
    icon: '/favicon.ico',
  },
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f0f0f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-text-primary">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
