'use client';

import { useThemeStore } from '@/lib/stores/useThemeStore';

/**
 * ThemeToggle
 * Botão simples para alternar entre dark/light mode
 * Será usado na página de Configurações
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg bg-accent text-background font-semibold transition-all hover:opacity-90 active:scale-95"
      aria-label={`Alternar para ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
