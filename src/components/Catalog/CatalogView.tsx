import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Clock,
  ThumbsUp,
  GitFork,
  ArrowRight,
  ShieldCheck,
  Share2,
  Plus,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import type { Category, Difficulty } from '../../types'

export const CatalogView: React.FC = () => {
  const { guides, openGuide, setViewMode, setForkModalGuide, setExportModalGuide, userProgress } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'popular' | 'forks' | 'duration'>('rating')

  const categories = [
    { id: 'all', label: 'Все сценарии' },
    { id: 'hardware', label: 'Hardware & DIY' },
    { id: 'study', label: 'ВУЗ & Документы' },
    { id: 'devops', label: 'DevOps & Linux' },
    { id: 'everyday', label: 'Регламенты' },
  ]

  const filteredGuides = useMemo(() => {
    return guides
      .filter((g) => {
        const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory
        const matchesDiff = selectedDifficulty === 'all' || g.difficulty === selectedDifficulty
        const q = searchQuery.toLowerCase().trim()
        const matchesSearch =
          !q ||
          g.title.toLowerCase().includes(q) ||
          g.summary.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)) ||
          g.author.name.toLowerCase().includes(q)

        return matchesCategory && matchesDiff && matchesSearch
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.stats.ratingPercent - a.stats.ratingPercent
        if (sortBy === 'popular') return b.stats.views - a.stats.views
        if (sortBy === 'forks') return b.stats.forks - a.stats.forks
        if (sortBy === 'duration') return a.estimatedMinutes - b.estimatedMinutes
        return 0
      })
  }, [guides, selectedCategory, selectedDifficulty, searchQuery, sortBy])

  const totalCompletions = useMemo(
    () => guides.reduce((acc, g) => acc + g.stats.completions, 0),
    [guides]
  )

  const avgRating = useMemo(() => {
    if (guides.length === 0) return 0
    return Math.round(guides.reduce((acc, g) => acc + g.stats.ratingPercent, 0) / guides.length)
  }, [guides])

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'beginner':
        return { label: 'Базовый', class: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20' }
      case 'intermediate':
        return { label: 'Средний', class: 'text-sky-700 dark:text-sky-300 bg-sky-500/10 border-sky-500/20' }
      case 'advanced':
        return { label: 'Сложный', class: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20' }
    }
  }

  const getCategoryName = (cat: Category) => {
    switch (cat) {
      case 'hardware':
        return 'Hardware & DIY'
      case 'study':
        return 'ВУЗ & Наука'
      case 'devops':
        return 'DevOps & Linux'
      case 'everyday':
        return 'Регламенты'
    }
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="lg:col-span-7 space-y-4 text-left">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
            Пошаговые инструкции с проверкой выполнения
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
            Выполняйте сложные регламенты шаг за шагом. Фиксируйте прогресс, находите узкие места и улучшайте инструкции через форки.
          </p>

          <div className="pt-2 max-w-lg">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по гайдам, командам или тегам..."
                className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors shadow-2xs"
              />
              <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                /
              </kbd>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-4 shadow-2xs">
            <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Сводка платформы
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/60">
                <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  {guides.length}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Гайдов
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/60">
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {totalCompletions.toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Завершений
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/60">
                <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  {avgRating}%
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Рейтинг
                </div>
              </div>
            </div>

            <div className="pt-1">
              <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                Принцип работы «отметил шаг — перешёл дальше»:
              </div>
              <div className="space-y-1.5">
                <div className="px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs flex items-center justify-between text-zinc-800 dark:text-zinc-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>1. Подготовка компонентов и изоляция</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Выполнено</span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60 text-xs flex items-center justify-between text-zinc-900 dark:text-zinc-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full border border-emerald-500 flex items-center justify-center text-[9px] font-mono text-emerald-500">2</div>
                    <span className="font-medium">2. Фиксация в сокете по ключам</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">Текущий шаг</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-1 bg-zinc-100/70 dark:bg-zinc-900/70 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors active:scale-[0.98] ${
                  selectedCategory === cat.id
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400"
              >
                <option value="rating">По рейтингу</option>
                <option value="popular">По просмотрам</option>
                <option value="forks">По числу форков</option>
                <option value="duration">По времени</option>
              </select>
            </div>

            <button
              onClick={() => setViewMode('studio')}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Создать сценарий</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-zinc-400 text-[11px]">Сложность:</span>
          {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedDifficulty(lvl)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                selectedDifficulty === lvl
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              {lvl === 'all' ? 'Все' : lvl === 'beginner' ? 'Базовый' : lvl === 'intermediate' ? 'Средний' : 'Сложный'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGuides.map((guide) => {
          const diffBadge = getDifficultyBadge(guide.difficulty)
          const progress = userProgress[guide.id]
          const completedCount = progress?.completedStepIds?.length || 0
          const totalSteps = guide.steps.length
          const isStarted = completedCount > 0
          const isFullyCompleted = completedCount >= totalSteps

          return (
            <motion.div
              key={guide.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="group flex flex-col justify-between rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 p-5 shadow-2xs hover:shadow-xs transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-medium text-zinc-500 dark:text-zinc-400">
                      {getCategoryName(guide.category)}
                    </span>
                    {guide.forkMeta.isFork && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        Форк v{guide.forkMeta.version}
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${diffBadge.class}`}>
                    {diffBadge.label}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2 leading-snug">
                  {guide.title}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                  {guide.summary}
                </p>

                <div className="flex items-center gap-2 mb-4 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-700 dark:text-zinc-300">
                    {guide.author.name.charAt(0)}
                  </div>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{guide.author.name}</span>
                  {guide.author.verified && (
                    <span title="Верифицированный специалист" className="inline-flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {guide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
                {isStarted && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                      <span>{isFullyCompleted ? 'Пройдено целиком' : `${completedCount} из ${totalSteps} шагов`}</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {Math.round((completedCount / totalSteps) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${(completedCount / totalSteps) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-mono text-[11px]" title="Рейтинг полезности">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                      {guide.stats.ratingPercent}%
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]" title="Расчетное время">
                      <Clock className="w-3.5 h-3.5" />
                      {guide.estimatedMinutes} мин
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]" title="Количество форков">
                      <GitFork className="w-3.5 h-3.5" />
                      {guide.stats.forks}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setExportModalGuide(guide)}
                      title="Экспорт в PDF / Markdown"
                      className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setForkModalGuide(guide)}
                      title="Сделать форк (создать ответвление)"
                      className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                    >
                      <GitFork className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => openGuide(guide.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white dark:text-zinc-900 hover:text-white dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.98] shadow-2xs"
                >
                  <span>
                    {isStarted ? (isFullyCompleted ? 'Повторить сценарий' : 'Продолжить выполнение') : 'Открыть сценарий'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-[#111113] rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-8 space-y-3">
          <Search className="w-7 h-7 text-zinc-400 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Сценариев не найдено</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            По заданным фильтрам нет подходящих инструкций. Попробуйте сбросить параметры поиска.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSelectedDifficulty('all')
            }}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  )
}
