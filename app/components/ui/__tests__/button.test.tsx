import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '../button';

describe('Button Component', () => {
  it('deve renderizar com texto', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('deve renderizar com variante default (amber)', () => {
    const { container } = render(<Button>Default</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-accent', 'text-background');
  });

  it('deve renderizar com variante secondary', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-surface');
  });

  it('deve renderizar com tamanho small', () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('h-9');
  });

  it('deve ser disabled quando prop disabled é true', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
