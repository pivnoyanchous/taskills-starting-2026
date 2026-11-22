import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Guide, UserProgress, UserRole, ViewMode, StepComment } from '../types'
import { INITIAL_GUIDES } from '../data/mockGuides'

interface AppContextType {
  guides: Guide[]
  activeGuide: Guide | null
  activeGuideId: string | null
  currentStepIndex: number
  setCurrentStepIndex: (idx: number) => void
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  userProgress: Record<string, UserProgress>
  zenMode: boolean
  setZenMode: (val: boolean) => void
  forkModalGuide: Guide | null
  setForkModalGuide: (guide: Guide | null) => void
  exportModalGuide: Guide | null
  setExportModalGuide: (guide: Guide | null) => void
  openGuide: (guideId: string, stepIndex?: number) => void
  toggleChecklistItem: (guideId: string, stepId: string, itemId: string) => void
  completeStep: (guideId: string, stepId: string) => void
  resetGuideProgress: (guideId: string) => void
  voteStep: (guideId: string, stepId: string, type: 'helpful' | 'unhelpful') => void
  addStepComment: (guideId: string, stepId: string, text: string) => void
  forkGuide: (originalGuideId: string, customTitle: string, customSummary: string) => Guide
  saveGuide: (guide: Guide) => void
  deleteGuide: (guideId: string) => void
  getStepCheckedItems: (guideId: string, stepId: string) => string[]
  isStepCompleted: (guideId: string, stepId: string) => boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const GUIDES_STORAGE_KEY = 'stepflow_guides_data_v2'
const PROGRESS_STORAGE_KEY = 'stepflow_user_progress_v2'
const ROLE_STORAGE_KEY = 'stepflow_user_role_v2'

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guides, setGuides] = useState<Guide[]>(() => {
    try {
      const saved = localStorage.getItem(GUIDES_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (e) {
      console.error('Failed to load guides from storage', e)
    }
    return INITIAL_GUIDES
  })

  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load progress from storage', e)
    }
    return {}
  })

  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY)
      if (saved === 'expert' || saved === 'student') return saved
    } catch {
    }
    return 'student'
  })

  const [viewMode, setViewMode] = useState<ViewMode>('catalog')
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [zenMode, setZenMode] = useState<boolean>(false)
  const [forkModalGuide, setForkModalGuide] = useState<Guide | null>(null)
  const [exportModalGuide, setExportModalGuide] = useState<Guide | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(guides))
    } catch (e) {
      console.error('Failed to save guides', e)
    }
  }, [guides])

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(userProgress))
    } catch (e) {
      console.error('Failed to save progress', e)
    }
  }, [userProgress])

  useEffect(() => {
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, userRole)
    } catch (e) {
      console.error('Failed to save role', e)
    }
  }, [userRole])

  const activeGuide = guides.find((g) => g.id === activeGuideId) || null

  const openGuide = (guideId: string, stepIndex = 0) => {
    setActiveGuideId(guideId)
    const existing = userProgress[guideId]
    if (existing && stepIndex === 0 && existing.currentStepIndex) {
      setCurrentStepIndex(existing.currentStepIndex)
    } else {
      setCurrentStepIndex(stepIndex)
    }
    setViewMode('player')
  }

  const toggleChecklistItem = (guideId: string, stepId: string, itemId: string) => {
    setUserProgress((prev) => {
      const guideProg = prev[guideId] || {
        guideId,
        completedStepIds: [],
        checkedItemIds: {},
        currentStepIndex: 0,
        startedAt: new Date().toISOString(),
      }
      const currentList = guideProg.checkedItemIds[stepId] || []
      const exists = currentList.includes(itemId)
      const updatedList = exists ? currentList.filter((id) => id !== itemId) : [...currentList, itemId]

      return {
        ...prev,
        [guideId]: {
          ...guideProg,
          checkedItemIds: {
            ...guideProg.checkedItemIds,
            [stepId]: updatedList,
          },
        },
      }
    })
  }

  const completeStep = (guideId: string, stepId: string) => {
    setUserProgress((prev) => {
      const guideProg = prev[guideId] || {
        guideId,
        completedStepIds: [],
        checkedItemIds: {},
        currentStepIndex: 0,
        startedAt: new Date().toISOString(),
      }
      const completed = new Set(guideProg.completedStepIds)
      completed.add(stepId)

      return {
        ...prev,
        [guideId]: {
          ...guideProg,
          completedStepIds: Array.from(completed),
          currentStepIndex: currentStepIndex,
        },
      }
    })
  }

  const resetGuideProgress = (guideId: string) => {
    setUserProgress((prev) => {
      const copy = { ...prev }
      delete copy[guideId]
      return copy
    })
    setCurrentStepIndex(0)
  }

  const voteStep = (guideId: string, stepId: string, type: 'helpful' | 'unhelpful') => {
    setGuides((prev) =>
      prev.map((guide) => {
        if (guide.id !== guideId) return guide
        return {
          ...guide,
          steps: guide.steps.map((step) => {
            if (step.id !== stepId) return step
            const currentVote = step.feedback.userVote
            let helpful = step.feedback.helpfulCount
            let unhelpful = step.feedback.unhelpfulCount

            if (currentVote === type) {
              if (type === 'helpful') helpful = Math.max(0, helpful - 1)
              if (type === 'unhelpful') unhelpful = Math.max(0, unhelpful - 1)
              return {
                ...step,
                feedback: {
                  helpfulCount: helpful,
                  unhelpfulCount: unhelpful,
                  userVote: undefined,
                },
              }
            }

            if (currentVote === 'helpful') helpful = Math.max(0, helpful - 1)
            if (currentVote === 'unhelpful') unhelpful = Math.max(0, unhelpful - 1)

            if (type === 'helpful') helpful += 1
            if (type === 'unhelpful') unhelpful += 1

            return {
              ...step,
              feedback: {
                helpfulCount: helpful,
                unhelpfulCount: unhelpful,
                userVote: type,
              },
            }
          }),
        }
      })
    )
  }

  const addStepComment = (guideId: string, stepId: string, text: string) => {
    const newComment: StepComment = {
      id: 'c-' + Date.now(),
      author: userRole === 'expert' ? 'Эксперт-Редактор' : 'Студент',
      role: userRole,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    }

    setGuides((prev) =>
      prev.map((guide) => {
        if (guide.id !== guideId) return guide
        return {
          ...guide,
          steps: guide.steps.map((step) => {
            if (step.id !== stepId) return step
            return {
              ...step,
              comments: [newComment, ...step.comments],
            }
          }),
        }
      })
    )
  }

  const forkGuide = (originalGuideId: string, customTitle: string, customSummary: string): Guide => {
    const original = guides.find((g) => g.id === originalGuideId)
    if (!original) throw new Error('Оригинал не найден')

    const forkedId = 'fork-' + Date.now()
    const newFork: Guide = {
      ...original,
      id: forkedId,
      slug: original.slug + '-fork-' + Date.now().toString().slice(-4),
      title: customTitle || original.title + ' (Мой форк)',
      summary: customSummary || original.summary,
      author: {
        name: userRole === 'expert' ? 'Автор' : 'Студент',
        handle: 'user_' + Date.now().toString().slice(-4),
        role: userRole,
        verified: userRole === 'expert',
      },
      forkMeta: {
        isFork: true,
        originalGuideId: original.id,
        originalAuthor: original.author.name,
        originalTitle: original.title,
        version: '1.0.0 (Форк от ' + original.forkMeta.version + ')',
        forkCount: 0,
      },
      stats: {
        views: 1,
        completions: 0,
        ratingPercent: 100,
        forks: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setGuides((prev) =>
      prev.map((g) => (g.id === originalGuideId ? { ...g, stats: { ...g.stats, forks: g.stats.forks + 1 } } : g)).concat(newFork)
    )

    return newFork
  }

  const saveGuide = (guide: Guide) => {
    setGuides((prev) => {
      const exists = prev.some((g) => g.id === guide.id)
      if (exists) {
        return prev.map((g) => (g.id === guide.id ? { ...guide, updatedAt: new Date().toISOString() } : g))
      }
      return [guide, ...prev]
    })
  }

  const deleteGuide = (guideId: string) => {
    setGuides((prev) => prev.filter((g) => g.id !== guideId))
    if (activeGuideId === guideId) {
      setActiveGuideId(null)
      setViewMode('catalog')
    }
  }

  const getStepCheckedItems = (guideId: string, stepId: string): string[] => {
    return userProgress[guideId]?.checkedItemIds[stepId] || []
  }

  const isStepCompleted = (guideId: string, stepId: string): boolean => {
    return userProgress[guideId]?.completedStepIds?.includes(stepId) || false
  }

  return (
    <AppContext.Provider
      value={{
        guides,
        activeGuide,
        activeGuideId,
        currentStepIndex,
        setCurrentStepIndex,
        userRole,
        setUserRole,
        viewMode,
        setViewMode,
        userProgress,
        zenMode,
        setZenMode,
        forkModalGuide,
        setForkModalGuide,
        exportModalGuide,
        setExportModalGuide,
        openGuide,
        toggleChecklistItem,
        completeStep,
        resetGuideProgress,
        voteStep,
        addStepComment,
        forkGuide,
        saveGuide,
        deleteGuide,
        getStepCheckedItems,
        isStepCompleted,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
