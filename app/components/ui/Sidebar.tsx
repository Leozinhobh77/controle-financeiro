'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Receipt, PiggyBank, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Contas', href: '/contas', icon: Receipt },
  { name: 'Metas', href: '/metas', icon: PiggyBank },
  { name: 'Ajustes', href: '/configuracoes', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{ width: isHovered ? 240 : 80 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 z-40 h-screen bg-surface border-r border-white/5 flex flex-col justify-between overflow-hidden"
    >
      <div className="p-4 flex flex-col gap-8">
        {/* Logo Area */}
        <div className="flex items-center gap-3 px-2 mt-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-glow">
            <span className="font-display font-bold text-lg text-white">CF</span>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col whitespace-nowrap"
          >
            <span className="font-display font-bold text-white tracking-wide">Controle</span>
            <span className="text-xs text-accent-light uppercase tracking-widest font-semibold">Financeiro</span>
          </motion.div>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden
                    ${isActive ? 'bg-accent/10 text-accent font-medium' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full"
                    />
                  )}
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <motion.span
                    className="whitespace-nowrap z-10"
                    animate={{ opacity: isHovered ? 1 : 0 }}
                  >
                    {item.name}
                  </motion.span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 mb-4">
        <button className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-text-secondary hover:bg-danger/10 hover:text-danger transition-colors group">
          <LogOut className="w-6 h-6 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
          <motion.span animate={{ opacity: isHovered ? 1 : 0 }} className="whitespace-nowrap font-medium">
            Sair
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
}
