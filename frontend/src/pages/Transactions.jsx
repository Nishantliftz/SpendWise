import React, { useState, useEffect } from 'react'
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Calendar,
  FileSpreadsheet,
  ArrowUpDown
} from 'lucide-react'
import * as transactionService from '../services/transactionService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import Pagination from '../components/common/Pagination'
import { formatCurrency, formatDate } from '../utils/formatters'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants'
import toast from 'react-hot-toast'

const ALL_CATEGORIES = Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]))

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters & Pagination
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => {
    fetchTransactions()
  }, [type, category, startDate, endDate, sortBy, page, pageSize])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const res = await transactionService.getTransactions({
        type: type !== 'all' ? type : undefined,
        category: category || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: search.trim() || undefined,
        sortBy,
        page,
        size: pageSize
      })

      const data = res.data.data
      if (data?.content) {
        setTransactions(data.content)
        setTotalPages(data.totalPages)
        setTotalElements(data.totalElements)
      } else {
        setTransactions(Array.isArray(data) ? data : [])
      }
    } catch {
      toast.error('Failed to load transaction history')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(0)
    fetchTransactions()
  }

  const handleResetFilters = () => {
    setType('all')
    setCategory('')
    setStartDate('')
    setEndDate('')
    setSearch('')
    setSortBy('date_desc')
    setPage(0)
  }

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast.error('No transactions to export')
      return
    }

    const headers = ['Type', 'Category', 'Description', 'Amount', 'Payment Method', 'Date', 'Notes']
    const rows = transactions.map(t => [
      t.type.toUpperCase(),
      `"${t.category || ''}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.amount,
      `"${t.paymentMethod || ''}"`,
      t.transactionDate,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `SpendWise_Transactions_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Downloaded CSV export!')
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Transaction History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete centralized ledger of all revenues, expenditures, and cash transactions
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn-secondary flex items-center gap-2 self-start"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
        {/* Top search & type bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by description or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </form>

          {/* Type segmented control */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-slate-800 p-1 shrink-0">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'income', label: 'Income Only' },
              { id: 'expense', label: 'Expenses Only' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setType(t.id)
                  setPage(0)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  type === t.id
                    ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-gray-50 dark:border-slate-800/80">
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setPage(0)
              }}
              className="input-field text-xs"
            >
              <option value="">All Categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                setPage(0)
              }}
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                setPage(0)
              }}
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field text-xs"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {(category || startDate || endDate || search || type !== 'all') && (
          <div className="flex justify-end pt-1">
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-500 hover:underline font-semibold"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={FileSpreadsheet}
            title="No transactions found"
            description="Try modifying your active filter parameters or record new income and expenses."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60 text-xs">
                {transactions.map((tx, idx) => {
                  const isIncome = tx.type?.toLowerCase() === 'income'

                  return (
                    <tr
                      key={`${tx.type}-${tx.id}-${idx}`}
                      className="hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isIncome
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {isIncome ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {isIncome ? 'Income' : 'Expense'}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {tx.category}
                      </td>

                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {tx.description || '-'}
                        {tx.notes && (
                          <span className="block text-[10px] text-gray-400 italic truncate">
                            {tx.notes}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {tx.paymentMethod || 'Other'}
                      </td>

                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {formatDate(tx.transactionDate)}
                      </td>

                      <td className={`px-6 py-4 text-right font-bold text-sm ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  )
}
