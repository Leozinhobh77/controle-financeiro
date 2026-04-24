import type { Metadata } from 'next';
import { ThemeProvider } from './providers';
import './globals.css';
import { Sidebar } from './components/ui/Sidebar';
import { Topbar } from './components/ui/Topbar';

export const metadata: Metadata = {
  title: 'Controle de Contas v2 | Obsidian & Gold',
  description: 'Aplicativo elegante para gerenciar contas a pagar com design premium Agente Forge',
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
          <div className="min-h-screen bg-background text-text-primary flex">
            <Sidebar />
            <div className="flex-1 ml-[80px] flex flex-col min-h-screen bg-[url('/bg-noise.png')] bg-repeat bg-[length:100px_100px] opacity-100">
              <Topbar />
              <main className="flex-1 p-8 pb-20">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
