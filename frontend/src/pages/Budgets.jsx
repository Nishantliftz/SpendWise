import React, { useEffect, useState, useCallback } from 'react'
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../services/budgetService'
import { formatCurrency } from '../utils/formatters'
import { EXPENSE_CATEGORIES } from '../utils/constants'
import {
  Plus,
  Pencil,
  Trash2,
  PieChart as PieIcon,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  AlertCircle,
  TrendingDown
} from 'lucide-react'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import StatCard from '../components/common/StatCard'
import EmptyState from '../components/common/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const CATEGORY_ICONS = {
  Food: '🍔',
  Transportation: '🚗',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Education: '📚',
  Healthcare: '🏥',
  Rent: '🏠',
  'Bills & Utilities': '💡',
  Travel: '✈️',
  Groceries: '🛒',
  Other: '📦'
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const now = new Date()
const EMPTY_FORM = {
  category: 'Food',
  monthlyLimit: '',
  month: now.getMonth() + 1,
  year: now.getFullYear()
}

export default function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })

  // Active viewing period
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await getBudgets({ month: selectedMonth, year: selectedYear })
      setBudgets(r.data?.data || [])
    } catch {
      toast.error('Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }, [selectedMonth, selectedYear])

  useEffect(() => {
    load()
  }, [load])

  const openAdd = () => {
    setEditing(null)
    setForm({
      ...EMPTY_FORM,
      month: selectedMonth,
      year: selectedYear
    })
    setShowModal(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      category: item.category,
      monthlyLimit: item.monthlyLimit || item.monthly_limit,
      month: item.month,
      year: item.year
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.monthlyLimit || parseFloat(form.monthlyLimit) <= 0) {
      toast.error('Budget limit must be greater than 0')
      return
    }
    setSaving(true)
    try {
      const payload = {
        category: form.category,
        monthlyLimit: parseFloat(form.monthlyLimit),
        month: parseInt(form.month),
        year: parseInt(form.year)
      }

      if (editing) {
        await updateBudget(editing.id, payload)
        toast.success('Budget allocation updated')
      } else {
        await createBudget(payload)
        toast.success('Monthly budget set')
      }
      setShowModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save budget')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteBudget(deleteDialog.id)
      toast.success('Budget deleted')
      setDeleteDialog({ open: false, id: null })
      load()
    } catch {
      toast.error('Failed to delete budget')
    }
  }

  // Summary figures
  const totalLimit = budgets.reduce((s, b) => s + parseFloat(b.monthlyLimit || b.monthly_limit || 0), 0)
  const totalSpent = budgets.reduce((s, b) => s + parseFloat(b.spent || 0), 0)
  const totalRemaining = totalLimit - totalSpent

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <PieIcon className="h-6 w-6 text-amber-500" /> Monthly Budget Planner
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Establish category limits, prevent overspending, and track consumption
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" /> Set Budget
        </button>
      </div>

      {/* Viewing Period Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Period:</span>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="input-field text-xs w-36"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx + 1}>{name}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="input-field text-xs w-24"
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Showing allocations for <span className="font-bold text-gray-900 dark:text-white">{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Budgeted"
          value={formatCurrency(totalLimit)}
          icon={PieIcon}
          color="blue"
          subtitle="Sum of all allocated limits"
        />
        <StatCard
          title="Total Utilized"
          value={formatCurrency(totalSpent)}
          icon={TrendingDown}
          color="red"
          subtitle="Expenses charged to budgeted categories"
        />
        <StatCard
          title="Remaining Surplus"
          value={formatCurrency(Math.max(0, totalRemaining))}
          icon={CheckCircle2}
          color={totalRemaining >= 0 ? 'green' : 'red'}
          subtitle={totalRemaining >= 0 ? 'Available buffer' : 'Exceeded budget limit'}
        />
      </div>

      {/* Budgets Cards Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={PieIcon}
          title="No budgets configured for this month"
          description="Create category budgets to automatically track limits and receive overspending warnings."
          action={
            <button onClick={openAdd} className="btn-primary">
              Set Budget
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map(b => {
            const limit = parseFloat(b.monthlyLimit || b.monthly_limit || 0)
            const spent = parseFloat(b.spent || 0)
            const remaining = Math.max(0, limit - spent)
            const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0
            const isExceeded = pct >= 100
            const isWarning = pct >= 80 && !isExceeded

            return (
              <div
                key={b.id}
                className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm transition-all duration-200 ${
                  isExceeded
                    ? 'border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-500/20'
                    : isWarning
                    ? 'border-amber-300 dark:border-amber-900/60 ring-1 ring-amber-500/20'
                    : 'border-gray-100 dark:border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_ICONS[b.category] || '📦'}</span>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {b.category}
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        {MONTH_NAMES[b.month - 1]} {b.year}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(b)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ open: true, id: b.id })}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status Badges */}
                {isExceeded && (
                  <div className="mb-3 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Budget Exceeded by {formatCurrency(spent - limit)}!</span>
                  </div>
                )}
                {isWarning && (
                  <div className="mb-3 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>80% limit warning reached ({pct}%)</span>
                  </div>
                )}

                {/* Progress bar */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Spent: <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(spent)}</span>
                    </span>
                    <span className={`font-bold ${isExceeded ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {pct}%
                    </span>
                  </div>

                  <div className="h-2.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isExceeded
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>Limit: {formatCurrency(limit)}</span>
                    <span>Remaining: {formatCurrency(remaining)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Budget Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Budget Allocation' : 'Set Category Budget'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Category *</label>
            <select
              className="input-field"
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            >
              {EXPENSE_CATEGORIES.map(c => (
                <option key={c} value={c}>{CATEGORY_ICONS[c] || '📦'} {c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Monthly Limit ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              className="input-field"
              placeholder="500.00"
              value={form.monthlyLimit}
              onChange={e => setForm(p => ({ ...p, monthlyLimit: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Month</label>
              <select
                className="input-field"
                value={form.month}
                onChange={e => setForm(p => ({ ...p, month: Number(e.target.value) }))}
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx + 1}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Year</label>
              <select
                className="input-field"
                value={form.year}
                onChange={e => setForm(p => ({ ...p, year: Number(e.target.value) }))}
              >
                {[2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : editing ? 'Update Budget' : 'Set Budget'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Budget"
        message="Are you sure you want to remove this category budget? This will not remove your logged expenses."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}
