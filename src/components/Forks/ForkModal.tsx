import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitFork, X, ArrowRight, ShieldCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const ForkModal: React.FC = () => {
  const { forkModalGuide, setForkModalGuide, forkGuide, openGuide } = useApp()

  if (!forkModalGuide) return null

  const [title, setTitle] = useState(`${forkModalGuide.title} (Доработанная версия)`)
  const [summary, setSummary] = useState(
    `Ветвь от ${forkModalGuide.author.name} с уточненными этапами и обновленными чек-листами.`
  )

  const handleCreateFork = (e: React.FormEvent) => {
    e.preventDefault()
    const newFork = forkGuide(forkModalGuide.id, title, summary)
    setForkModalGuide(null)
    openGuide(newFork.id)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-lg rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 p-5 shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center">
                <GitFork className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Создать ответвление (форк)
                </h3>
                <span className="text-[11px] text-zinc-500">
                  Сохраняет привязку к оригиналу и позволяет внести улучшения
                </span>
              </div>
            </div>

            <button
              onClick={() => setForkModalGuide(null)}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800 text-xs space-y-1">
            <div className="text-[10px] text-zinc-400 font-mono">Базовый сценарий:</div>
            <div className="font-medium text-zinc-900 dark:text-zinc-100">{forkModalGuide.title}</div>
            <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-0.5">
              <span>Автор: {forkModalGuide.author.name}</span>
              {forkModalGuide.author.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
              <span>•</span>
              <span className="font-mono">v{forkModalGuide.forkMeta.version}</span>
            </div>
          </div>

          <form onSubmit={handleCreateFork} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                Название новой версии
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                Описание изменений
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setForkModalGuide(null)}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs active:scale-[0.98]"
              >
                <span>Создать форк</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
