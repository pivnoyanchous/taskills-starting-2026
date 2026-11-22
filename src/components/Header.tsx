import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun,
  Moon,
  Compass,
  PlayCircle,
  PenTool,
  BarChart3,
  UserCheck,
  BookOpen,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import type { ViewMode } from '../types'
import { StepFlowLogo } from './Logo'

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { viewMode, setViewMode, activeGuide, userRole, setUserRole } = useApp()

  const navItems: { id: ViewMode; label: string; icon: React.FC<{ className?: string }>; condition?: boolean }[] = [
    { id: 'catalog', label: 'Каталог', icon: Compass },
    { id: 'player', label: 'Сценарий', icon: PlayCircle, condition: !!activeGuide },
    { id: 'studio', label: 'Редактор', icon: PenTool },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
  ]

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-[#09090b]/90 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        <button
          onClick={() => setViewMode('catalog')}
          className="group focus:outline-none flex items-center"
        >
          <StepFlowLogo markSize={30} />
        </button>

        <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-900/80 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80">
          {navItems
            .filter((item) => item.condition !== false)
            .map((item) => {
              const Icon = item.icon
              const isActive = viewMode === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setViewMode(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors z-10 active:scale-[0.98] ${
                    isActive
                      ? 'text-zinc-950 dark:text-zinc-50 font-semibold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-lg shadow-2xs border border-zinc-200/70 dark:border-zinc-700/60 -z-10"
                    />
                  )}
                </button>
              )
            })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-100/80 dark:bg-zinc-900/80 p-0.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800/80">
            <button
              onClick={() => setUserRole('student')}
              title="Режим выполнения сценария"
              className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1.5 transition-all active:scale-[0.97] ${
                userRole === 'student'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Исполнитель</span>
            </button>
            <button
              onClick={() => setUserRole('expert')}
              title="Режим автора и инспектора аналитики"
              className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1.5 transition-all active:scale-[0.97] ${
                userRole === 'expert'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Автор</span>
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={toggleTheme}
            aria-label="Сменить тему оформления"
            title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
            className="w-8 h-8 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/80 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shadow-2xs"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className="flex items-center justify-center"
                >
                  <Moon className="w-3.5 h-3.5 text-emerald-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className="flex items-center justify-center"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <div className="flex md:hidden border-t border-zinc-200/70 dark:border-zinc-800/70 px-4 py-1.5 gap-1.5 overflow-x-auto">
        {navItems
          .filter((item) => item.condition !== false)
          .map((item) => {
            const Icon = item.icon
            const isActive = viewMode === item.id
            return (
              <button
                key={item.id}
                onClick={() => setViewMode(item.id)}
                className={`px-3 py-1 text-xs rounded-md flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            )
          })}
      </div>
    </header>
  )
}
