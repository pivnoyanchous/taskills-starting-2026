import React from 'react'

interface LogoProps {
  className?: string
  showText?: boolean
  markSize?: number
}

export const StepFlowMark: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center shrink-0 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs ${className}`}
    >
      <svg
        width={Math.round(size * 0.65)}
        height={Math.round(size * 0.65)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform group-hover:scale-105"
      >
        <circle cx="4.5" cy="18.5" r="2" fill="#10b981" />
        <path
          d="M6.5 18.5H10.5C11.6046 18.5 12.5 17.6046 12.5 16.5V12.5C12.5 11.3954 13.3954 10.5 14.5 10.5H18.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12.5" cy="12.5" r="1.5" fill="#10b981" />
        <path
          d="M16 7.5L19.5 10.5L16 13.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export const StepFlowLogo: React.FC<LogoProps> = ({
  className = '',
  showText = true,
  markSize = 32,
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <StepFlowMark size={markSize} />
      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100 text-[15px] leading-tight">
            StepFlow
          </span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:inline leading-tight">
            Интерактивные сценарии
          </span>
        </div>
      )}
    </div>
  )
}
