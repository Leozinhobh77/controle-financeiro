'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/stores/useThemeStore';

/**
 * ThemeProvider
 * Aplica o tema armazenado em localStorage no mount
 * Garante que dark mode é ativado no início (LEI #14)
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const theme = useThemeStore.getState().theme;
    const html = document.documentElement;

    // Aplicar tema ao mount
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, []);

  return <>{children}</>;
}
