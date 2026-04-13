import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes Tailwind CSS com merge inteligente
 * Resolve conflitos de classes (ex: bg-red-500 + bg-blue-500)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
