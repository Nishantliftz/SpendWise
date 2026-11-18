import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  trend,
  trendLabel,
  subtitle
}) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/30'
    },
    green: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      icon: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/30'
    },
    red: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      icon: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/30'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-900/30'
    }
  }

  const c = colorMap[color] || colorMap.blue

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border ${c.border} shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1.5 tracking-tight">
            {value}
          </p>

          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}

          {trend !== undefined && (
            <div className={`flex items-center gap-1.5 mt-2 text-xs font-bold ${trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
              {trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span>{Math.abs(trend)}%</span>
              {trendLabel && <span className="font-normal text-gray-400 ml-0.5">{trendLabel}</span>}
            </div>
          )}
        </div>

        <div className={`p-3 rounded-xl ${c.bg} shrink-0`}>
          <Icon className={`h-5 w-5 ${c.icon}`} />
        </div>
      </div>
    </div>
  )
}
