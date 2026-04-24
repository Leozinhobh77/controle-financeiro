'use client';

import { Bell, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function Topbar() {
  return (
    <header className="h-20 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-display font-semibold text-white tracking-wide">
          Resumo Financeiro
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Buscar contas..."
            className="w-64 bg-surface/50 border border-white/5 py-2 pl-10 pr-4 rounded-full text-sm focus:bg-surface focus:border-accent/50 focus:w-80 transition-all duration-300"
          />
        </div>

        <button className="relative p-2 text-text-secondary hover:text-white transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-background animate-pulse" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center group-hover:border-accent transition-colors">
            <User className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-white">Usuário</span>
            <span className="text-xs text-text-muted">Plano Premium</span>
          </div>
        </div>
      </div>
    </header>
  );
}
