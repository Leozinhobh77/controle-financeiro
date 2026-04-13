import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from '../useThemeStore';

describe('useThemeStore', () => {
  beforeEach(() => {
    // Reset store antes de cada teste
    useThemeStore.setState({ theme: 'dark' });
    localStorage.clear();
  });

  it('deve iniciar com tema dark por padrão', () => {
    const { theme } = useThemeStore.getState();
    expect(theme).toBe('dark');
  });

  it('deve permitir mudar para light mode', () => {
    const { setTheme } = useThemeStore.getState();
    setTheme('light');
    const { theme } = useThemeStore.getState();
    expect(theme).toBe('light');
  });

  it('deve permitir toggle entre temas', () => {
    const store = useThemeStore.getState();
    expect(store.theme).toBe('dark');

    store.toggleTheme();
    expect(useThemeStore.getState().theme).toBe('light');

    store.toggleTheme();
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('deve persistir tema em localStorage', () => {
    const { setTheme } = useThemeStore.getState();
    setTheme('light');

    // Verificar se localStorage foi atualizado
    const stored = localStorage.getItem('theme-storage');
    expect(stored).toBeDefined();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.theme).toBe('light');
    }
  });
});
