import React from 'react'
import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ fullScreen = false, size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  const spinner = (
    <div className="flex items-center justify-center">
      <Loader2 className={`${sizes[size]} animate-spin text-primary-600 dark:text-primary-400`} />
    </div>
  )
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-950 z-50">
        {spinner}
      </div>
    )
  }
  return spinner
}
