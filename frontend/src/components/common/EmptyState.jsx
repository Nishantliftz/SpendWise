import React from 'react'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-2xl mb-4 text-gray-400 dark:text-gray-500 shadow-inner">
        {Icon && <Icon className="h-8 w-8" />}
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  )
}
