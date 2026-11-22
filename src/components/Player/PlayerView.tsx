import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  Share2,
  GitFork,
  Maximize2,
  Minimize2,
  RotateCcw,
  Send,
  Trophy,
  Check,
  Copy,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const PlayerView: React.FC = () => {
  const {
    activeGuide,
    currentStepIndex,
    setCurrentStepIndex,
    setViewMode,
    toggleChecklistItem,
    completeStep,
    resetGuideProgress,
    voteStep,
    addStepComment,
    getStepCheckedItems,
    isStepCompleted,
    setForkModalGuide,
    setExportModalGuide,
    zenMode,
    setZenMode,
  } = useApp()

  const [commentText, setCommentText] = useState('')
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [showFinishedCard, setShowFinishedCard] = useState(false)
  const [copiedSnippet, setCopiedSnippet] = useState(false)

  if (!activeGuide) {
    return (
      <div className="py-20 text-center">
        <p className="text-zinc-500 text-sm">Инструкция не выбрана.</p>
        <button
          onClick={() => setViewMode('catalog')}
          className="mt-4 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-semibold"
        >
          Вернуться в каталог
        </button>
      </div>
    )
  }

  const currentStep = activeGuide.steps[currentStepIndex] || activeGuide.steps[0]
  const totalSteps = activeGuide.steps.length
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100)
  const checkedItems = getStepCheckedItems(activeGuide.id, currentStep.id)
  const allChecklistItemsDone =
    currentStep.checklist.length === 0 ||
    currentStep.checklist.every((item) => checkedItems.includes(item.id))

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      if (e.key === 'ArrowRight' && currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex(currentStepIndex + 1)
      } else if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
        setCurrentStepIndex(currentStepIndex - 1)
      } else if (e.key === 'f' || e.key === 'F') {
        setZenMode(!zenMode)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStepIndex, totalSteps, zenMode, setZenMode, setCurrentStepIndex])

  const handleNextStep = () => {
    completeStep(activeGuide.id, currentStep.id)

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      })
      setShowFinishedCard(true)
    }
  }

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    addStepComment(activeGuide.id, currentStep.id, commentText)
    setCommentText('')
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedSnippet(true)
    setTimeout(() => setCopiedSnippet(false), 2000)
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-between">
      <div className="sticky top-14 z-30 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('catalog')}
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              title="Вернуться в каталог"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-semibold text-zinc-950 dark:text-zinc-50 truncate max-w-md sm:max-w-lg">
                {activeGuide.title}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                <span className="font-mono">
                  Шаг {currentStepIndex + 1} из {totalSteps}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  ~{currentStep.expectedMinutes} мин
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setExportModalGuide(activeGuide)}
              title="Экспорт в PDF / Markdown"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Экспорт</span>
            </button>
            <button
              onClick={() => setForkModalGuide(activeGuide)}
              title="Сделать форк (создать улучшенную копию)"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Форк</span>
            </button>
            <button
              onClick={() => setZenMode(!zenMode)}
              title={zenMode ? 'Выйти из фокус-режима (F)' : 'Фокус-режим без сайдбара (клавиша F)'}
              className={`p-1.5 rounded-md transition-colors ${
                zenMode
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {zenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="w-full h-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {!zenMode && (
            <div className="lg:col-span-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-1 pb-1">
                  <span>Оглавление шагов</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
                </div>

                <div className="space-y-1">
                  {activeGuide.steps.map((step, idx) => {
                    const isDone = isStepCompleted(activeGuide.id, step.id)
                    const isCurrent = idx === currentStepIndex
                    const isBottleneck = step.analytics.frictionScore === 'high'

                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStepIndex(idx)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-medium flex items-center justify-between gap-2 transition-colors active:scale-[0.99] ${
                          isCurrent
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                            : isDone
                            ? 'bg-zinc-50 dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-850'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isDone ? (
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 ${
                                isCurrent ? 'text-emerald-400 dark:text-emerald-600' : 'text-emerald-500'
                              }`}
                            />
                          ) : (
                            <span
                              className={`w-4 h-4 rounded-full border text-[10px] font-mono flex items-center justify-center shrink-0 ${
                                isCurrent
                                  ? 'border-white/40 text-white dark:border-zinc-900/40 dark:text-zinc-900'
                                  : 'border-zinc-300 dark:border-zinc-700 text-zinc-500'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          )}
                          <span className="truncate">{step.title}</span>
                        </div>

                        {isBottleneck && (
                          <span
                            className="shrink-0 p-0.5 rounded text-amber-500"
                            title="Узкое место: высокий процент отвалов"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('Сбросить весь прогресс прохождения этой инструкции?')) {
                    resetGuideProgress(activeGuide.id)
                  }
                }}
                className="w-full py-1.5 px-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 text-[11px] font-medium text-zinc-500 hover:text-red-500 hover:border-red-500/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Сбросить отметки</span>
              </button>
            </div>
          )}

          <div className={zenMode ? 'lg:col-span-12 max-w-3xl mx-auto w-full' : 'lg:col-span-8'}>
            <AnimatePresence mode="wait">
              {showFinishedCard ? (
                <motion.div
                  key="finish"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-8 sm:p-10 rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 shadow-sm text-center space-y-5"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                      Сценарий успешно выполнен
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                      Вы завершили все {totalSteps} этапов регламента «{activeGuide.title}». Все обязательные чек-листы подтверждены.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                    <button
                      onClick={() => {
                        setShowFinishedCard(false)
                        setCurrentStepIndex(0)
                      }}
                      className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors"
                    >
                      Пройти заново
                    </button>
                    <button
                      onClick={() => setViewMode('catalog')}
                      className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 text-white dark:text-zinc-900 text-xs font-semibold transition-colors"
                    >
                      К списку сценариев
                    </button>
                    <button
                      onClick={() => setExportModalGuide(activeGuide)}
                      className="px-4 py-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Экспорт в PDF
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 p-5 sm:p-7 shadow-2xs space-y-5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-semibold uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Шаг {currentStep.stepNumber} из {totalSteps}
                      </span>

                      {currentStep.analytics.frictionScore === 'high' && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Узкое место: частые задержки</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
                      {currentStep.title}
                    </h3>
                  </div>

                  <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                    {currentStep.description}
                  </div>

                  {currentStep.warning && (
                    <div className="p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="font-semibold block mb-0.5">Предостережение:</strong>
                        {currentStep.warning}
                      </div>
                    </div>
                  )}

                  {currentStep.tip && (
                    <div className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/25 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200">
                      <Lightbulb className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="font-semibold block mb-0.5">Рекомендация:</strong>
                        {currentStep.tip}
                      </div>
                    </div>
                  )}

                  {currentStep.codeSnippet && (
                    <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 font-mono text-xs">
                      <div className="px-3.5 py-1.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-zinc-400 text-[11px]">
                        <span>Команда / Конфиг ({currentStep.codeSnippet.language})</span>
                        <button
                          onClick={() => handleCopyCode(currentStep.codeSnippet?.code || '')}
                          className="flex items-center gap-1 hover:text-white transition-colors"
                        >
                          {copiedSnippet ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Скопировано</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Копировать</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3.5 text-emerald-400 overflow-x-auto text-[12px] leading-relaxed">
                        <code>{currentStep.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {currentStep.checklist.length > 0 && (
                    <div className="pt-2 space-y-2.5">
                      <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Чек-лист этапа ({checkedItems.length} из {currentStep.checklist.length})
                      </h4>
                      <div className="space-y-1.5">
                        {currentStep.checklist.map((item) => {
                          const isChecked = checkedItems.includes(item.id)
                          return (
                            <button
                              key={item.id}
                              onClick={() => toggleChecklistItem(activeGuide.id, currentStep.id, item.id)}
                              className={`w-full p-2.5 rounded-lg border text-left text-xs flex items-center gap-3 transition-colors active:scale-[0.99] ${
                                isChecked
                                  ? 'bg-emerald-500/5 border-emerald-500/25 text-zinc-900 dark:text-zinc-100'
                                  : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                  isChecked
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : 'border-zinc-400 dark:border-zinc-600'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className={isChecked ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}>
                                {item.text}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-500">Понятность:</span>
                      <button
                        onClick={() => voteStep(activeGuide.id, currentStep.id, 'helpful')}
                        className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors border ${
                          currentStep.feedback.userVote === 'helpful'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-semibold'
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Понятно ({currentStep.feedback.helpfulCount})</span>
                      </button>

                      <button
                        onClick={() => voteStep(activeGuide.id, currentStep.id, 'unhelpful')}
                        className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors border ${
                          currentStep.feedback.userVote === 'unhelpful'
                            ? 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30 font-semibold'
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                        <span>Есть вопросы ({currentStep.feedback.unhelpfulCount})</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                      className="px-2.5 py-1 rounded-md border border-zinc-200/80 dark:border-zinc-800 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Вопросы к шагу ({currentStep.comments.length})</span>
                    </button>
                  </div>

                  <AnimatePresence>
                    {isCommentsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3"
                      >
                        <form onSubmit={handleAddComment} className="flex gap-2">
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Опишите трудность или оставьте совет..."
                            className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium flex items-center gap-1 transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            <span>Отправить</span>
                          </button>
                        </form>

                        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                          {currentStep.comments.length === 0 ? (
                            <p className="text-xs text-zinc-400 italic">Комментариев к этому шагу пока нет.</p>
                          ) : (
                            currentStep.comments.map((c) => (
                              <div
                                key={c.id}
                                className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-xs space-y-0.5"
                              >
                                <div className="flex items-center justify-between text-zinc-500">
                                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{c.author}</span>
                                  <span className="text-[10px] font-mono">{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{c.text}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-4">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStepIndex === 0}
                      className={`px-3.5 py-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-[0.98] ${
                        currentStepIndex === 0
                          ? 'opacity-30 cursor-not-allowed text-zinc-400'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Назад</span>
                    </button>

                    <button
                      onClick={handleNextStep}
                      className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors active:scale-[0.98]"
                    >
                      {allChecklistItemsDone && <Check className="w-3.5 h-3.5 text-emerald-200 stroke-[3]" />}
                      <span>
                        {currentStepIndex === totalSteps - 1 ? 'Завершить выполнение' : 'Отметить и перейти дальше'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
