import React from 'react'
import Modal from './Modal'
import { AlertTriangle, AlertCircle } from 'lucide-react'

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) {
  const isDanger = variant === 'danger'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-4 mb-6">
        <div
          className={`p-3 rounded-xl shrink-0 ${
            isDanger
              ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
              : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
          }`}
        >
          {isDanger ? <AlertTriangle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-all ${
            isDanger
              ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
