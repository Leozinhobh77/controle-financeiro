import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border border-transparent bg-accent text-background hover:bg-accent/80',
        secondary:
          'border border-transparent bg-surface text-text-primary hover:bg-surface/80',
        destructive:
          'border border-transparent bg-danger text-white hover:bg-danger/80',
        outline: 'text-text-primary border border-text-secondary',
        success:
          'border border-transparent bg-status-success text-white',
        warning:
          'border border-transparent bg-status-warning text-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
