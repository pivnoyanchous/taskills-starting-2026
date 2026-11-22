import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Printer, FileText, Code2, Copy, Check, Download } from 'lucide-react'
import { useApp } from '../context/AppContext'

export const ExportModal: React.FC = () => {
  const { exportModalGuide, setExportModalGuide } = useApp()
  const [tab, setTab] = useState<'pdf' | 'markdown' | 'embed'>('pdf')
  const [copied, setCopied] = useState(false)

  if (!exportModalGuide) return null

  const generateMarkdown = () => {
    let md = `# ${exportModalGuide.title}\n\n`
    md += `> ${exportModalGuide.summary}\n\n`
    md += `- **Автор**: ${exportModalGuide.author.name} (${exportModalGuide.author.handle})\n`
    md += `- **Расчетное время**: ${exportModalGuide.estimatedMinutes} мин\n`
    md += `- **Сложность**: ${exportModalGuide.difficulty}\n\n`
    md += `## Содержание шагов\n\n`

    exportModalGuide.steps.forEach((step, idx) => {
      md += `### Шаг ${idx + 1}: ${step.title}\n\n`
      md += `${step.description}\n\n`

      if (step.warning) {
        md += `> ⚠️ **Предостережение**: ${step.warning}\n\n`
      }
      if (step.tip) {
        md += `> 💡 **Рекомендация**: ${step.tip}\n\n`
      }
      if (step.codeSnippet) {
        md += `\`\`\`${step.codeSnippet.language}\n${step.codeSnippet.code}\n\`\`\`\n\n`
      }

      if (step.checklist.length > 0) {
        md += `**Чек-лист:**\n`
        step.checklist.forEach((item) => {
          md += `- [ ] ${item.text}\n`
        })
        md += `\n`
      }
    })

    md += `---\n*Сформировано в платформе StepFlow*\n`
    return md
  }

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown()
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${exportModalGuide.slug}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  const embedCode = `<iframe 
  src="${window.location.origin}?embed=${exportModalGuide.id}" 
  width="100%" 
  height="600" 
  style="border: 1px solid rgba(0,0,0,0.1); border-radius: 12px;" 
  title="${exportModalGuide.title}">
</iframe>`

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-xl rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-zinc-800 p-5 shadow-xl space-y-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Экспорт и встраивание сценария
            </h3>
            <button
              onClick={() => setExportModalGuide(null)}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200/70 dark:border-zinc-800">
            <button
              onClick={() => setTab('pdf')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                tab === 'pdf'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-emerald-500" />
              <span>Печать / PDF</span>
            </button>
            <button
              onClick={() => setTab('markdown')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                tab === 'markdown'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>Markdown (.md)</span>
            </button>
            <button
              onClick={() => setTab('embed')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                tab === 'embed'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Iframe-виджет</span>
            </button>
          </div>

          {tab === 'pdf' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Форматирование для печати и сохранения в PDF
                </p>
                <p className="leading-relaxed">
                  Сценарий автоматически подготовлен для печати в формате А4. В системном диалоге печати браузера выберите пункт «Сохранить как PDF». Все элементы управления интерфейса будут скрыты.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 text-white dark:text-zinc-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs active:scale-[0.98]"
              >
                <Printer className="w-4 h-4" />
                <span>Открыть диалог печати / PDF</span>
              </button>
            </div>
          )}

          {tab === 'markdown' && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 font-mono text-xs max-h-52 overflow-y-auto p-3 text-zinc-300">
                <pre>{generateMarkdown()}</pre>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="flex-1 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 text-white dark:text-zinc-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Скопировано' : 'Копировать Markdown'}</span>
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="px-3.5 py-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Скачать .md</span>
                </button>
              </div>
            </div>
          )}

          {tab === 'embed' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500">
                Код для встраивания интерактивного плеера на внутренний портал или в базу знаний:
              </p>

              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 font-mono text-xs p-3 text-emerald-400">
                <code>{embedCode}</code>
              </div>

              <button
                onClick={handleCopyEmbed}
                className="w-full py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs active:scale-[0.98]"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Код скопирован' : 'Скопировать код вставки'}</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
