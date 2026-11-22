export type Category = 'hardware' | 'study' | 'devops' | 'everyday'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type UserRole = 'student' | 'expert'

export type ViewMode = 'catalog' | 'player' | 'studio' | 'analytics' | 'embed'

export interface ChecklistItem {
  id: string
  text: string
  completed?: boolean
}

export interface StepComment {
  id: string
  author: string
  role: UserRole
  text: string
  createdAt: string
  likes: number
}

export interface StepFeedback {
  helpfulCount: number
  unhelpfulCount: number
  userVote?: 'helpful' | 'unhelpful'
}

export interface StepAnalytics {
  views: number
  completions: number
  dropOffRate: number
  avgTimeSeconds: number
  expectedTimeSeconds: number
  frictionScore: 'low' | 'medium' | 'high'
}

export interface Step {
  id: string
  stepNumber: number
  title: string
  description: string
  expectedMinutes: number
  warning?: string
  tip?: string
  codeSnippet?: {
    language: string
    code: string
  }
  checklist: ChecklistItem[]
  feedback: StepFeedback
  comments: StepComment[]
  analytics: StepAnalytics
}

export interface ForkMeta {
  isFork: boolean
  originalGuideId?: string
  originalAuthor?: string
  originalTitle?: string
  version: string
  forkCount: number
}

export interface Guide {
  id: string
  slug: string
  title: string
  summary: string
  category: Category
  difficulty: Difficulty
  tags: string[]
  estimatedMinutes: number
  author: {
    name: string
    handle: string
    role: UserRole
    verified: boolean
  }
  steps: Step[]
  forkMeta: ForkMeta
  stats: {
    completions: number
    views: number
    ratingPercent: number
    forks: number
  }
  createdAt: string
  updatedAt: string
}

export interface UserProgress {
  guideId: string
  completedStepIds: string[]
  checkedItemIds: Record<string, string[]>
  currentStepIndex: number
  startedAt: string
  completedAt?: string
  stepNotes?: Record<string, string>
}
