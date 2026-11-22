import React, { useState } from 'react'
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Save,
  CheckSquare,
  AlertTriangle,
  Lightbulb,
  Layers,
  FileCheck,
  Check,
  BookOpen,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import type { Category, Difficulty, Guide, Step } from '../../types'

interface Blueprint {
  id: string
  name: string
  description: string
  category: Category
  difficulty: Difficulty
  steps: {
    title: string
    description: string
    expectedMinutes: number
    tip?: string
    warning?: string
    checklist: string[]
  }[]
}

const presets: Blueprint[] = [
  {
    id: 'bp-hardware',
    name: 'Инженерный мануал сборки железа',
    description: 'Шаблон регламента для сборки или сервиса оборудования с акцентом на электробезопасность.',
    category: 'hardware',
    difficulty: 'intermediate',
    steps: [
      {
        title: 'Подготовка антистатической зоны и инструмента',
        description: 'Организуйте сухое рабочее место. Подготовьте инструмент и снимите статический заряд.',
        expectedMinutes: 5,
        tip: 'Используйте картонную коробку как изолирующую подставку.',
        checklist: ['Рабочая поверхность очищена', 'Антистатический браслет надет / статика снята', 'Отвертка подготовлена'],
      },
      {
        title: 'Инспекция разъемов и посадочных мест',
        description: 'Внимательно осмотрите контакты и сокеты на предмет повреждений или замятий.',
        expectedMinutes: 10,
        warning: 'Не прикасайтесь голыми пальцами к золоченым контактным площадкам.',
        checklist: ['Визуальный осмотр завершен', 'Ключи позиционирования проверены'],
      },
      {
        title: 'Монтаж ключевых узлов и фиксация',
        description: 'Установите модуль строго по направляющим без чрезмерных усилий до щелчка фиксатора.',
        expectedMinutes: 15,
        checklist: ['Модуль встал в пазы', 'Защелки закрылись до упора', 'Винты затянуты крест-накрест'],
      },
      {
        title: 'Финальная диагностика и тестовый пуск',
        description: 'Подайте питание и проведите диагностический старт, контролируя сервисные индикаторы.',
        expectedMinutes: 10,
        checklist: ['Питание подано', 'Сервисные индикаторы в норме', 'Температурные датчики в допустимом диапазоне'],
      },
    ],
  },
  {
    id: 'bp-study',
    name: 'Регламент оформления документов (ВУЗ)',
    description: 'Шаблон процесса подачи заявлений, справок и обходных листов без очередей.',
    category: 'study',
    difficulty: 'beginner',
    steps: [
      {
        title: 'Формирование и выбор бланка заявки',
        description: 'Определите точный тип запрашиваемого документа и орган его предоставления.',
        expectedMinutes: 5,
        checklist: ['Форма заявления выбрана', 'Паспортные данные и номер группы проверены'],
      },
      {
        title: 'Проверка отсутствия задолженностей',
        description: 'Убедитесь в отсутствии академических, библиотечных и финансовых хвостов.',
        expectedMinutes: 10,
        warning: 'Непогашенная задолженность заблокирует выпуск справки в деканате.',
        checklist: ['Сессия закрыта', 'Библиотечный абонемент чист'],
      },
      {
        title: 'Подача заявки в электронную систему',
        description: 'Отправьте заявление через личный кабинет и зафиксируйте трек-номер обращения.',
        expectedMinutes: 5,
        checklist: ['Электронное заявление отправлено', 'Регистрационный номер сохранен'],
      },
      {
        title: 'Получение оригинала с подписью и печатью',
        description: 'Заберите готовый документ в часы приема при предъявлении студенческого билета.',
        expectedMinutes: 5,
        checklist: ['Печать и подпись проверены на месте', 'Справка подшита в портфолио'],
      },
    ],
  },
  {
    id: 'bp-devops',
    name: 'DevOps Runbook: деплой и миграция',
    description: 'Пошаговый регламент выката сервиса с health-check проверками и планом отката.',
    category: 'devops',
    difficulty: 'advanced',
    steps: [
      {
        title: 'Создание резервной копии базы данных',
        description: 'Выполните dump схемы и данных перед применением DDL миграций.',
        expectedMinutes: 5,
        warning: 'Не применяйте миграции без проверенного снепшота базы данных.',
        checklist: ['Dump создан и проверен на целостность', 'Дисковое пространство проверено'],
      },
      {
        title: 'Применение миграций схемы данных',
        description: 'Запустите миграции в транзакционном режиме.',
        expectedMinutes: 5,
        checklist: ['Миграции выполнены успешно', 'Блокировки таблиц сняты'],
      },
      {
        title: 'Rolling-update контейнеров',
        description: 'Обновите образы сервиса и перезапустите контейнеры.',
        expectedMinutes: 10,
        checklist: ['Новые контейнеры поднялись', 'Старые контейнеры остановлены'],
      },
      {
        title: 'Smoke-тестирование и проверка метрик',
        description: 'Выполните curl health-check эндпоинта и проверьте уровень 5xx ошибок в мониторинге.',
        expectedMinutes: 10,
        checklist: ['Health-check возвращает 200 OK', 'Ошибок в логах нет', 'Латентность в пределах нормы'],
      },
    ],
  },
]

export const StudioView: React.FC = () => {
  const { saveGuide, setViewMode } = useApp()

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState<Category>('devops')
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate')
  const [tagsInput, setTagsInput] = useState('')
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'step-new-1',
      stepNumber: 1,
      title: 'Вводный этап и предварительные требования',
      description: 'Опишите предварительные условия, необходимое оборудование или доступ перед началом выполнения задачи.',
      expectedMinutes: 10,
      checklist: [{ id: 'cl-1', text: 'Все предварительные требования соблюдены' }],
      feedback: { helpfulCount: 0, unhelpfulCount: 0 },
      comments: [],
      analytics: {
        views: 0,
        completions: 0,
        dropOffRate: 0,
        avgTimeSeconds: 600,
        expectedTimeSeconds: 600,
        frictionScore: 'low',
      },
    },
  ])

  const applyBlueprint = (bp: Blueprint) => {
    setTitle(`Инструкция: ${bp.name}`)
    setSummary(bp.description)
    setCategory(bp.category)
    setDifficulty(bp.difficulty)
    setTagsInput(bp.category === 'hardware' ? 'Железо, Сборка, DIY' : bp.category === 'study' ? 'ВУЗ, Справка, Документы' : 'DevOps, Деплой, Linux')

    const newSteps: Step[] = bp.steps.map((s, idx) => ({
      id: `step-bp-${idx + 1}`,
      stepNumber: idx + 1,
      title: s.title,
      description: s.description,
      expectedMinutes: s.expectedMinutes,
      tip: s.tip,
      warning: s.warning,
      checklist: s.checklist.map((item, cIdx) => ({
        id: `cl-bp-${idx}-${cIdx}`,
        text: item,
      })),
      feedback: { helpfulCount: 0, unhelpfulCount: 0 },
      comments: [],
      analytics: {
        views: 0,
        completions: 0,
        dropOffRate: 0,
        avgTimeSeconds: s.expectedMinutes * 60,
        expectedTimeSeconds: s.expectedMinutes * 60,
        frictionScore: 'low',
      },
    }))

    setSteps(newSteps)
  }

  const handleAddStep = () => {
    const nextNum = steps.length + 1
    const newStep: Step = {
      id: `step-new-${Date.now()}`,
      stepNumber: nextNum,
      title: `Новый шаг ${nextNum}`,
      description: 'Опишите конкретное действие, которое необходимо выполнить читателю на этом этапе.',
      expectedMinutes: 10,
      checklist: [{ id: `cl-${Date.now()}`, text: 'Действие выполнено и проверено' }],
      feedback: { helpfulCount: 0, unhelpfulCount: 0 },
      comments: [],
      analytics: {
        views: 0,
        completions: 0,
        dropOffRate: 0,
        avgTimeSeconds: 600,
        expectedTimeSeconds: 600,
        frictionScore: 'low',
      },
    }
    setSteps([...steps, newStep])
  }

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) {
      alert('Инструкция должна содержать хотя бы один шаг.')
      return
    }
    const updated = steps.filter((_, idx) => idx !== index).map((s, idx) => ({
      ...s,
      stepNumber: idx + 1,
    }))
    setSteps(updated)
  }

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= steps.length) return
    const reordered = [...steps]
    const temp = reordered[index]
    reordered[index] = reordered[targetIdx]
    reordered[targetIdx] = temp

    setSteps(reordered.map((s, idx) => ({ ...s, stepNumber: idx + 1 })))
  }

  const handleUpdateStep = (index: number, field: keyof Step, value: any) => {
    const updated = [...steps]
    updated[index] = { ...updated[index], [field]: value }
    setSteps(updated)
  }

  const handleAddChecklistItem = (stepIndex: number) => {
    const updated = [...steps]
    const step = updated[stepIndex]
    step.checklist.push({
      id: `cl-${Date.now()}`,
      text: 'Новый пункт проверки',
    })
    setSteps(updated)
  }

  const handleRemoveChecklistItem = (stepIndex: number, checkIndex: number) => {
    const updated = [...steps]
    updated[stepIndex].checklist = updated[stepIndex].checklist.filter((_, idx) => idx !== checkIndex)
    setSteps(updated)
  }

  const handleUpdateChecklistItem = (stepIndex: number, checkIndex: number, text: string) => {
    const updated = [...steps]
    updated[stepIndex].checklist[checkIndex].text = text
    setSteps(updated)
  }

  const handleSaveGuide = () => {
    if (!title.trim()) {
      alert('Пожалуйста, укажите название инструкции.')
      return
    }

    const totalMinutes = steps.reduce((acc, s) => acc + (s.expectedMinutes || 5), 0)
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const newGuide: Guide = {
      id: `guide-user-${Date.now()}`,
      slug: title.toLowerCase().replace(/\s+/g, '-').slice(0, 30),
      title,
      summary: summary || 'Интерактивная инструкция с пошаговой проверкой.',
      category,
      difficulty,
      tags: tags.length ? tags : ['Инструкция', 'Чек-лист'],
      estimatedMinutes: totalMinutes,
      author: {
        name: 'Вы (Автор)',
        handle: 'me_author',
        role: 'expert',
        verified: true,
      },
      forkMeta: {
        isFork: false,
        version: '1.0.0',
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
      steps,
    }

    saveGuide(newGuide)
    setViewMode('catalog')
  }

  const totalMinutes = steps.reduce((acc, s) => acc + (s.expectedMinutes || 5), 0)
  const stepsWithChecklist = steps.filter((s) => s.checklist.length > 0).length
  const checklistCoverage = Math.round((stepsWithChecklist / steps.length) * 100)
  const hasWarningsOrTips = steps.some((s) => s.warning || s.tip)

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 text-xs font-mono mb-1.5 border border-zinc-200/70 dark:border-zinc-700/60">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>Редактор сценариев</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Конструктор интерактивных регламентов
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Создавайте пошаговые сценарии с чек-листами, контролем времени и предостережениями.
          </p>
        </div>

        <button
          onClick={handleSaveGuide}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors active:scale-[0.98] self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Опубликовать в каталог</span>
        </button>
      </div>

      <div className="rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 p-4 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
            <span>Готовые шаблоны структуры</span>
          </span>
          <span className="text-[11px] text-zinc-400">Кликните для автозаполнения</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {presets.map((bp) => (
            <button
              key={bp.id}
              onClick={() => applyBlueprint(bp)}
              className="text-left p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40 transition-colors active:scale-[0.99] space-y-1"
            >
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {bp.name}
              </div>
              <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                {bp.description}
              </p>
              <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-0.5">
                {bp.steps.length} шагов • ~{bp.steps.reduce((a, b) => a + b.expectedMinutes, 0)} мин
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Контроль качества сценария:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
              <Check className="w-3 h-3 text-emerald-500" />
              {steps.length} {steps.length === 1 ? 'шаг' : 'шагов'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
              <Check className="w-3 h-3 text-emerald-500" />
              ~{totalMinutes} мин всего
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
              <Check className="w-3 h-3 text-emerald-500" />
              {checklistCoverage}% шагов с чек-листами
            </span>
            <span>•</span>
            <span className={`flex items-center gap-1 ${hasWarningsOrTips ? 'text-zinc-600 dark:text-zinc-300' : 'text-amber-500'}`}>
              <Check className="w-3 h-3 text-emerald-500" />
              {hasWarningsOrTips ? 'Предупреждения добавлены' : 'Рекомендуется добавить совет'}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 p-5 space-y-4 shadow-2xs">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Основные параметры инструкции
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Название сценария *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Развертывание Docker Compose стека на Ubuntu Server"
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Краткое описание (summary)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Опишите результат выполнения и целевую аудиторию..."
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Категория
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
            >
              <option value="hardware">Hardware & DIY</option>
              <option value="study">ВУЗ & Документы</option>
              <option value="devops">IT & DevOps</option>
              <option value="everyday">Регламенты & Быт</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Уровень сложности
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
            >
              <option value="beginner">Базовый (новичок)</option>
              <option value="intermediate">Средний (базовые навыки)</option>
              <option value="advanced">Сложный (продвинутый)</option>
            </select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Теги (через запятую)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Docker, Linux, Nginx, Server"
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Шаги сценария ({steps.length})
          </h3>
          <button
            onClick={handleAddStep}
            className="px-3 py-1.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить шаг</span>
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 p-5 space-y-4 shadow-2xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono text-[11px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Этап #{idx + 1}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveStep(idx, 'up')}
                    className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 text-zinc-500"
                    title="Переместить вверх"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === steps.length - 1}
                    onClick={() => handleMoveStep(idx, 'down')}
                    className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 text-zinc-500"
                    title="Переместить вниз"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1 rounded hover:bg-red-500/10 text-zinc-400 hover:text-red-500 ml-1"
                    title="Удалить шаг"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    Название этапа
                  </label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    Время (мин)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={step.expectedMinutes}
                    onChange={(e) => handleUpdateStep(idx, 'expectedMinutes', parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    Подробное описание действий
                  </label>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => handleUpdateStep(idx, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Предупреждение (опционально)</span>
                  </label>
                  <input
                    type="text"
                    value={step.warning || ''}
                    onChange={(e) => handleUpdateStep(idx, 'warning', e.target.value)}
                    placeholder="Например: Не трогайте контакты руками..."
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    <span>Совет эксперта (опционально)</span>
                  </label>
                  <input
                    type="text"
                    value={step.tip || ''}
                    onChange={(e) => handleUpdateStep(idx, 'tip', e.target.value)}
                    placeholder="Например: Держите крепеж в отдельном лотке..."
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <CheckSquare className="w-3 h-3" />
                    <span>Пункты чек-листа для этого шага ({step.checklist.length})</span>
                  </span>
                  <button
                    onClick={() => handleAddChecklistItem(idx)}
                    className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Добавить пункт</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {step.checklist.map((item, cIdx) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded border border-zinc-400 flex items-center justify-center text-[10px] text-zinc-500 shrink-0">
                        ✓
                      </div>
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => handleUpdateChecklistItem(idx, cIdx, e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
                      />
                      <button
                        onClick={() => handleRemoveChecklistItem(idx, cIdx)}
                        className="p-1 rounded text-zinc-400 hover:text-red-500"
                        title="Удалить пункт"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
