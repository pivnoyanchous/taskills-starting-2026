import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { AppProvider, useApp } from './context/AppContext'
import { Header } from './components/Header'
import { CatalogView } from './components/Catalog/CatalogView'
import { PlayerView } from './components/Player/PlayerView'
import { StudioView } from './components/Studio/StudioView'
import { AnalyticsView } from './components/Analytics/AnalyticsView'
import { ForkModal } from './components/Forks/ForkModal'
import { ExportModal } from './components/ExportModal'
import { StepFlowMark } from './components/Logo'

const MainContent: React.FC = () => {
  const { viewMode, activeGuide, setViewMode } = useApp()

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <Header />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {viewMode === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <CatalogView />
            </motion.div>
          )}

          {viewMode === 'player' && (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <PlayerView />
            </motion.div>
          )}

          {viewMode === 'studio' && (
            <motion.div
              key="studio"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <StudioView />
            </motion.div>
          )}

          {viewMode === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <AnalyticsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ForkModal />
      <ExportModal />

      <footer className="no-print border-t border-zinc-200/80 dark:border-zinc-800/80 pt-10 pb-8 px-4 sm:px-6 lg:px-8 mt-16 bg-white/70 dark:bg-zinc-950/60 text-xs text-zinc-500 transition-colors">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <StepFlowMark size={24} />
                <span className="font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-sm">
                  StepFlow
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
                Инструмент для интерактивного прохождения сложных задач, runbook-инструкций и регламентов с поэтапной фиксацией чек-листов и выявлением задержек.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Разделы
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => setViewMode('catalog')}
                    className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    Каталог сценариев
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setViewMode('studio')}
                    className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    Конструктор регламентов
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setViewMode('analytics')}
                    className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    Аналитика и узкие места
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-2.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Горячие клавиши
              </div>
              <div className="space-y-1.5 text-[11px] text-zinc-500">
                <div className="flex items-center justify-between py-0.5">
                  <span>Фокус-режим (Zen Mode)</span>
                  <kbd className="px-1.5 py-0.5 rounded font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                    F
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <span>Переключение шагов</span>
                  <kbd className="px-1.5 py-0.5 rounded font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                    ← / →
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <span>Быстрый поиск</span>
                  <kbd className="px-1.5 py-0.5 rounded font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                    /
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div className="text-zinc-400">
              © {new Date().getFullYear()} StepFlow. Платформа интерактивных инструкций и чек-листов.
            </div>

            <div className="flex items-center gap-4 text-zinc-500">
              <button
                onClick={() => setViewMode('catalog')}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Все гайды
              </button>
              <button
                onClick={() => setViewMode('studio')}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Новый гайд
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Аналитика
              </button>
            </div>
          </div>
        </div>
      </footer>

      {activeGuide && (
        <div className="hidden print:block p-8 text-black bg-white">
          <h1 className="text-2xl font-bold mb-2">{activeGuide.title}</h1>
          <p className="text-sm italic mb-4">{activeGuide.summary}</p>
          <div className="text-xs mb-6 border-b pb-2">
            <div>Автор: {activeGuide.author.name}</div>
            <div>Расчетное время: {activeGuide.estimatedMinutes} мин</div>
            <div>Уровень сложности: {activeGuide.difficulty}</div>
          </div>
          <div className="space-y-6">
            {activeGuide.steps.map((s, idx) => (
              <div key={s.id} className="border-b pb-4">
                <h2 className="text-lg font-bold mb-1">
                  Шаг {idx + 1}: {s.title}
                </h2>
                <p className="text-xs text-zinc-700 mb-2">{s.description}</p>
                {s.warning && (
                  <div className="p-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs mb-2">
                    Внимание: {s.warning}
                  </div>
                )}
                {s.tip && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs mb-2">
                    Совет: {s.tip}
                  </div>
                )}
                {s.codeSnippet && (
                  <pre className="p-2 bg-zinc-100 text-xs font-mono mb-2">
                    <code>{s.codeSnippet.code}</code>
                  </pre>
                )}
                {s.checklist.length > 0 && (
                  <div className="text-xs">
                    <div className="font-semibold mb-1">Чек-лист:</div>
                    <ul className="list-disc pl-4 space-y-1">
                      {s.checklist.map((item) => (
                        <li key={item.id}>[ ] {item.text}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
