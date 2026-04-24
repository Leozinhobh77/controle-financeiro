'use client';

import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowDownCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  TrendingUp,
  Plus,
} from 'lucide-react';

const iconMap = {
  wallet: Wallet,
  arrowDownCircle: ArrowDownCircle,
  checkCircle2: CheckCircle2,
  alertTriangle: AlertTriangle,
  clock: Clock,
  zap: Zap,
  trendingUp: TrendingUp,
  plus: Plus,
} as const;

type IconName = keyof typeof iconMap;

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: IconName;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: iconName,
  trend,
  trendValue,
  delay = 0,
}: MetricCardProps) {
  const Icon = iconMap[iconName];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-panel relative overflow-hidden group shadow-lg p-6"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-24 h-24 text-accent rotate-12" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-text-secondary group-hover:text-accent group-hover:bg-accent/10 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-medium text-text-secondary">{title}</h3>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">{value}</h2>
            {trend && (
              <span
                className={`text-sm font-semibold ${
                  trend === 'up'
                    ? 'text-status-danger'
                    : trend === 'down'
                    ? 'text-status-success'
                    : 'text-text-muted'
                }`}
              >
                {trendValue}
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
        </div>
      </div>
      
      {/* Glow Effect Bottom */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-accent/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-accent/30 transition-colors" />
    </motion.div>
  );
}
