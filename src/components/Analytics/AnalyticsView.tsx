import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  AlertTriangle,
  CheckCircle,
  ThumbsUp,
  Users,
  Lightbulb,
  ExternalLink,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const AnalyticsView: React.FC = () => {
  const { guides, activeGuideId, openGuide } = useApp()
  const [selectedGuideId, setSelectedGuideId] = useState<string>(activeGuideId || guides[0]?.id || '')

  const currentGuide = guides.find((g) => g.id === selectedGuideId) || guides[0]

  if (!currentGuide) {
    return (
      <div className="py-20 text-center text-zinc-500 text-sm">
        Нет доступных инструкций для отображения аналитики.
      </div>
    )
  }

  const totalViews = currentGuide.stats.views
  const totalCompletions = currentGuide.stats.completions
  const overallRetentionRate = Math.round((totalCompletions / (totalViews || 1)) * 100)

  const bottlenecks = currentGuide.steps.filter(
    (s) => s.analytics.frictionScore === 'high' || s.analytics.dropOffRate > 10
  )

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 text-xs font-mono mb-1.5 border border-zinc-200/70 dark:border-zinc-700/60">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Телеметрия доходимости</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Аналитика сценариев и узкие места
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Отслеживание задержек, процента отсева читателей и обратной связи для доработки регламентов.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 whitespace-nowrap">Сценарий:</span>
          <select
            value={selectedGuideId}
            onChange={(e) => setSelectedGuideId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 max-w-xs truncate"
          >
            {guides.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Стартов сценария</span>
            <Users className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-950 dark:text-zinc-50">
            {totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400">Уникальных исполнителей</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Успешных завершений</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {totalCompletions.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400">{overallRetentionRate}% конверсия в финал</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Точек затруднений</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {bottlenecks.length}
          </div>
          <div className="text-[11px] text-zinc-400">
            {bottlenecks.length > 0 ? 'Требуют оптимизации описания' : 'Отклонений нет'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Индекс полезности</span>
            <ThumbsUp className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-950 dark:text-zinc-50">
            {currentGuide.stats.ratingPercent}%
          </div>
          <div className="text-[11px] text-zinc-400">По оценкам исполнителей</div>
        </div>
      </div>

      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <span>Воронка удержания по этапам (Drop-off Funnel)</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Доля читателей, успешно выполнивших каждый последующий шаг сценария.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Норма (&lt;5%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Узкое место (&gt;10%)</span>
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {currentGuide.steps.map((step, idx) => {
            const retentionPct = totalViews > 0 ? Math.round((step.analytics.completions / totalViews) * 100) : 100
            const isHighFriction = step.analytics.frictionScore === 'high' || step.analytics.dropOffRate > 10
            const timeDiff = step.analytics.avgTimeSeconds - step.analytics.expectedTimeSeconds
            const timeOverdue = timeDiff > 60

            return (
              <div key={step.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="font-mono text-zinc-400 text-[11px] shrink-0 w-5">
                      {idx + 1}.
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {step.title}
                    </span>
                    {isHighFriction && (
                      <span className="shrink-0 px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        Отсев {step.analytics.dropOffRate}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                    <span className={timeOverdue ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-400'}>
                      {Math.round(step.analytics.avgTimeSeconds / 60)} мин / план {step.expectedMinutes} мин
                    </span>
                    <span className="w-12 text-right font-bold text-zinc-900 dark:text-zinc-100">
                      {retentionPct}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${retentionPct}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className={`h-full rounded-full transition-colors ${
                      isHighFriction ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Диагностика выявленных узких мест ({bottlenecks.length})</span>
          </h3>
          <span className="text-xs text-zinc-500">Автоматический аудит отсева</span>
        </div>

        {bottlenecks.length === 0 ? (
          <div className="p-8 rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              В данном сценарии нет критических узких мест
            </h4>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Читатели проходят все шаги без аномальных задержек и отсева.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bottlenecks.map((bStep) => {
              const actualMins = Math.round(bStep.analytics.avgTimeSeconds / 60)

              return (
                <div
                  key={bStep.id}
                  className="rounded-xl bg-white dark:bg-[#111113] border border-amber-500/30 p-5 space-y-4 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        Шаг {bStep.stepNumber} • Отсев {bStep.analytics.dropOffRate}%
                      </span>
                      <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mt-1.5">
                        {bStep.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => openGuide(currentGuide.id)}
                      className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 transition-colors"
                      title="Перейти к шагу в плеере"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/60">
                      <div className="text-[10px] text-zinc-400">Превышение времени</div>
                      <div className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                        {actualMins} мин (план {bStep.expectedMinutes} мин)
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/60">
                      <div className="text-[10px] text-zinc-400">Непонятно читателям</div>
                      <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {bStep.feedback.unhelpfulCount} отметок
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/70 dark:border-zinc-800/80 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-semibold text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Рекомендация по улучшению:</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                      {bStep.warning
                        ? `Предупреждение уже добавлено, но читатели часто тратят дополнительное время. Рекомендуется разбить этот шаг на 2 подэтапа или дополнить чек-листом.`
                        : `Добавьте на этот шаг блок «Предостережение» или поясняющую схему, чтобы снизить время простоя.`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
