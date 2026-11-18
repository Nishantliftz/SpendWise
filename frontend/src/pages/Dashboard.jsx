import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getSummary, getMonthlyTrends, getCategoryBreakdown } from '../services/dashboardService'
import { formatCurrency, formatDate, formatRelativeDate } from '../utils/formatters'
import { CHART_COLORS } from '../utils/constants'
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  CreditCard,
  PieChart as PieIcon,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatCard from '../components/common/StatCard'

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState([])
  const [breakdown, setBreakdown] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const [s, t, b] = await Promise.all([
        getSummary(),
        getMonthlyTrends(),
        getCategoryBreakdown()
      ])
      setSummary(s.data?.data)
      setTrends(t.data?.data || [])
      setBreakdown(b.data?.data || [])
    } catch (e) {
      console.error('Error fetching dashboard data:', e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner fullScreen={false} />

  // Normalization for both camelCase and snake_case API shapes
  const totalBalance = summary?.totalBalance ?? summary?.total_balance ?? 0
  const totalIncome = summary?.totalIncome ?? summary?.total_income ?? 0
  const totalExpenses = summary?.totalExpenses ?? summary?.total_expenses ?? 0
  const monthlySavings = summary?.monthlySavings ?? summary?.monthly_savings ?? (totalIncome - totalExpenses)
  const monthlyBudget = summary?.monthlyBudget ?? summary?.monthly_budget ?? 0
  const budgetProgress = summary?.budgetUsageProgress ?? summary?.budget_utilization ?? 0
  const recentTransactions = summary?.recentTransactions ?? summary?.recent_transactions ?? []
  const budgetSummary = summary?.budgetSummary ?? []
  const savingsGoals = summary?.savingsGoals ?? []

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Welcome back, <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.fullName?.split(' ')[0] || 'Investor'}</span>! Here is your current financial standing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/income"
            className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/20 transition-all"
          >
            <PlusCircle className="h-4 w-4" /> Add Income
          </Link>
          <Link
            to="/expenses"
            className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 border border-rose-500/20 transition-all"
          >
            <CreditCard className="h-4 w-4" /> Add Expense
          </Link>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Net Balance"
          value={formatCurrency(totalBalance)}
          icon={Wallet}
          color="blue"
          subtitle="Cumulative reserves"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          color="green"
          subtitle="All income channels"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          color="red"
          subtitle="Outflows & bills"
        />
        <StatCard
          title="Monthly Savings"
          value={formatCurrency(monthlySavings)}
          icon={PiggyBank}
          color="purple"
          subtitle="Retained this month"
        />
      </div>

      {/* Primary Analytics Section: Income vs Expense Trend & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 Cols) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Cashflow Dynamics
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Income streams vs expense spending over recent months
              </p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              Full Analytics <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `$${v}`} />
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                fill="url(#incGrad)"
                name="Income"
                strokeWidth={2.5}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#f43f5e"
                fill="url(#expGrad)"
                name="Expenses"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Category Breakdown (1 Col) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Expense Breakdown
              </h2>
              <span className="text-[11px] text-gray-400">This Month</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Category allocation of total expenditure
            </p>
          </div>

          {breakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie
                  data={breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="amount"
                  nameKey="category"
                >
                  {breakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || CHART_COLORS.categories[index % CHART_COLORS.categories.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatCurrency(v)}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-400 py-12">
              No expenses recorded for this month yet
            </div>
          )}
        </div>
      </div>

      {/* Middle Row: Budget Consumption Progress & Savings Goals Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Health Tracker */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Monthly Budget Utilization
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Target thresholds vs current consumption
              </p>
            </div>
            <Link
              to="/budgets"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              Manage <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {budgetSummary.length > 0 ? (
            <div className="space-y-4">
              {budgetSummary.slice(0, 4).map((b) => {
                const pct = Math.min(100, Math.round(b.percentageUsed || 0))
                const isOver = pct >= 100
                const isWarn = pct >= 80 && !isOver

                return (
                  <div key={b.id || b.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {b.category}
                      </span>
                      <span className={`font-bold ${isOver ? 'text-rose-500' : isWarn ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {formatCurrency(b.spent || 0)} / {formatCurrency(b.monthlyLimit || 0)} ({pct}%)
                      </span>
                    </div>

                    <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-xs text-gray-400">No monthly budgets configured yet.</p>
              <Link to="/budgets" className="text-xs text-emerald-500 font-bold mt-2 inline-block">
                + Set Monthly Budget
              </Link>
            </div>
          )}
        </div>

        {/* Savings Goals Sneak Peek */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Savings Goals Progress
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Milestones currently being accumulated
              </p>
            </div>
            <Link
              to="/savings"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              All Goals <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {savingsGoals.length > 0 ? (
            <div className="space-y-4">
              {savingsGoals.slice(0, 3).map((g) => {
                const pct = Math.min(100, Math.round(g.progressPercentage || 0))
                return (
                  <div key={g.id} className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {g.goalName}
                      </span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {pct}%
                      </span>
                    </div>

                    <div className="h-2 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>{formatCurrency(g.currentAmount)} saved</span>
                      <span>Target: {formatCurrency(g.targetAmount)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-xs text-gray-400">No active savings goals found.</p>
              <Link to="/savings" className="text-xs text-purple-500 font-bold mt-2 inline-block">
                + Create Savings Goal
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions Feed */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Latest financial activity logged
            </p>
          </div>
          <Link
            to="/transactions"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
          >
            View All Ledger <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-gray-50 dark:divide-slate-800/60">
            {recentTransactions.slice(0, 6).map((tx, idx) => {
              const isIncome = tx.type?.toLowerCase() === 'income'
              return (
                <div
                  key={`${tx.type}-${tx.id}-${idx}`}
                  className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isIncome
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                        {tx.description || tx.category}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {formatDate(tx.transactionDate || tx.transaction_date)} · {tx.category} · {tx.paymentMethod || 'Other'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-extrabold ${
                      isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-gray-400">
            No recent transactions logged yet. Add your first income or expense above.
          </div>
        )}
      </div>
    </div>
  )
}
