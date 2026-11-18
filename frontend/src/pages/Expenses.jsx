import React, { useEffect, useState, useCallback } from 'react'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../services/expenseService'
import { formatCurrency, formatDate } from '../utils/formatters'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../utils/constants'
import { Plus, Pencil, Trash2, TrendingDown, Search, Filter, Calendar, CreditCard, ArrowDown } from 'lucide-react'
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

const EMPTY_FORM = {
  amount: '',
  category: 'Food',
  description: '',
  paymentMethod: 'Credit Card',
  transactionDate: new Date().toISOString().slice(0, 10),
  notes: ''
}

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })

  // Search & Filter state
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await getExpenses()
      const data = r.data?.data
      if (data?.content) {
        setExpenses(data.content)
      } else {
        setExpenses(Array.isArray(data) ? data : [])
      }
    } catch {
      toast.error('Failed to load expense records')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      amount: item.amount,
      category: item.category || 'Food',
      description: item.description || '',
      paymentMethod: item.paymentMethod || item.payment_method || 'Credit Card',
      transactionDate: (item.transactionDate || item.transaction_date || '').slice(0, 10),
      notes: item.notes || ''
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }
    setSaving(true)
    try {
      const payload = {
        amount: parseFloat(form.amount),
        category: form.category,
        description: form.description,
        paymentMethod: form.paymentMethod,
        transactionDate: form.transactionDate,
        notes: form.notes
      }

      if (editing) {
        await updateExpense(editing.id, payload)
        toast.success('Expense record updated')
      } else {
        await createExpense(payload)
        toast.success('Expense record logged')
      }
      setShowModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save expense')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteExpense(deleteDialog.id)
      toast.success('Expense entry removed')
      setDeleteDialog({ open: false, id: null })
      load()
    } catch {
      toast.error('Failed to delete expense record')
    }
  }

  // Filtered entries
  const filteredExpenses = expenses.filter(i => {
    const matchesSearch = !search ||
      (i.description && i.description.toLowerCase().includes(search.toLowerCase())) ||
      (i.category && i.category.toLowerCase().includes(search.toLowerCase())) ||
      (i.notes && i.notes.toLowerCase().includes(search.toLowerCase()))
    const matchesCat = !categoryFilter || i.category === categoryFilter
    return matchesSearch && matchesCat
  })

  // Metrics
  const totalExpense = expenses.reduce((s, i) => s + parseFloat(i.amount || 0), 0)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonthExpenses = expenses
    .filter(i => {
      const d = new Date(i.transactionDate || i.transaction_date)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .reduce((s, i) => s + parseFloat(i.amount || 0), 0)

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-rose-500" /> Expense Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Log expenditures, monitor category burn, and track personal outflows
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-danger flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" /> Add Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Lifetime Expenses"
          value={formatCurrency(totalExpense)}
          icon={TrendingDown}
          color="red"
          subtitle="Cumulative across all spending"
        />
        <StatCard
          title="Current Month Outflows"
          value={formatCurrency(thisMonthExpenses)}
          icon={Calendar}
          color="purple"
          subtitle="Expenditures this billing period"
        />
        <StatCard
          title="Recorded Expenses"
          value={expenses.length}
          icon={CreditCard}
          color="blue"
          subtitle="Individual logged transactions"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses by vendor, description, or notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="input-field sm:w-48 text-xs"
        >
          <option value="">All Categories</option>
          {EXPENSE_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Expense Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : filteredExpenses.length === 0 ? (
          <EmptyState
            icon={TrendingDown}
            title="No expenses logged"
            description="Start tracking your purchases, bills, groceries, and dining expenses."
            action={
              <button onClick={openAdd} className="btn-danger">
                Add Expense
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60 text-xs">
                {filteredExpenses.map(item => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="text-base">{CATEGORY_ICONS[item.category] || '📦'}</span>
                      <span>{item.category}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {item.description || '—'}
                      {item.notes && (
                        <span className="block text-[10px] text-gray-400 italic mt-0.5">
                          {item.notes}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {formatDate(item.transactionDate || item.transaction_date)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {item.paymentMethod || item.payment_method || '—'}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-rose-500 text-sm">
                      -{formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ open: true, id: item.id })}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Expense Record' : 'Record New Expense'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                className="input-field"
                placeholder="45.00"
                value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              />
            </div>
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
          </div>

          <div>
            <label className="label">Description / Merchant</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Whole Foods, Dinner with friends"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Payment Method</label>
              <select
                className="input-field"
                value={form.paymentMethod}
                onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))}
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Date *</label>
              <input
                type="date"
                required
                className="input-field"
                value={form.transactionDate}
                onChange={e => setForm(p => ({ ...p, transactionDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="label">Optional Notes</label>
            <textarea
              rows={2}
              className="input-field"
              placeholder="Receipt details, tax-deductible notes, etc."
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            />
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
              className="btn-danger"
            >
              {saving ? 'Saving...' : editing ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Expense Record"
        message="Are you sure you want to remove this expense entry? This will adjust your budget consumption and net balance."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}
