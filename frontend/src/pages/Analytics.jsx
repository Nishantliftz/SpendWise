import React, { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieIcon,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Percent
} from 'lucide-react'
import * as dashboardService from '../services/dashboardService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatCard from '../components/common/StatCard'
import { formatCurrency } from '../utils/formatters'
import { CHART_COLORS } from '../utils/constants'
import toast from 'react-hot-toast'

export default function Analytics() {
  const [trends, setTrends] = useState([])
  const [breakdown, setBreakdown] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6m')

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const [trendsRes, breakdownRes] = await Promise.all([
        dashboardService.getMonthlyTrends(),
        dashboardService.getCategoryBreakdown()
      ])
      setTrends(trendsRes.data.data || [])
      setBreakdown(breakdownRes.data.data || [])
    } catch {
      toast.error('Failed to load financial analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  // Derived Analytics Calculations
  const totalIncome = trends.reduce((acc, t) => acc + parseFloat(t.income || 0), 0)
  const totalExpenses = trends.reduce((acc, t) => acc + parseFloat(t.expenses || 0), 0)
  const netSavings = totalIncome - totalExpenses
  const averageIncome = trends.length > 0 ? totalIncome / trends.length : 0
  const averageExpenses = trends.length > 0 ? totalExpenses / trends.length : 0
  const avgDailyExpense = averageExpenses / 30
  const overallSavingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Financial Analytics & Insights
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Deep dive into your cashflow, savings patterns, and category expenditures
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['3m', '6m', '1y'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === range
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700'
              }`}
            >
              {range.toUpperCase()} View
            </button>
          ))}
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Net Cashflow"
          value={formatCurrency(netSavings)}
          icon={TrendingUp}
          color={netSavings >= 0 ? 'green' : 'red'}
          subtitle="Total income minus total expenses"
        />
        <StatCard
          title="Avg Monthly Income"
          value={formatCurrency(averageIncome)}
          icon={ArrowUpRight}
          color="blue"
          subtitle="Based on recorded period"
        />
        <StatCard
          title="Avg Daily Spend"
          value={formatCurrency(avgDailyExpense)}
          icon={ArrowDownRight}
          color="red"
          subtitle="Estimated 30-day daily burn"
        />
        <StatCard
          title="Savings Rate"
          value={`${overallSavingsRate}%`}
          icon={Percent}
          color="purple"
          subtitle="Proportion of income retained"
        />
      </div>

      {/* Primary Chart: Monthly Income vs Expenses Comparison */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Income vs Expenses Comparison
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Historical view of money incoming versus outgoing
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={v => `$${v}`} />
            <Tooltip
              formatter={v => formatCurrency(v)}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Secondary Charts: Savings Trend + Expense Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Savings Trajectory */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Monthly Savings Trajectory
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Net surplus saved at the conclusion of each month
            </p>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={v => `$${v}`} />
              <Tooltip
                formatter={v => formatCurrency(v)}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="savings"
                name="Net Savings"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Category Distribution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="mb-2">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Category Distribution
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Current month percentage allocation by expense type
            </p>
          </div>

          {breakdown.length > 0 ? (
            <div className="flex-1 flex flex-col justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
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
                    formatter={v => formatCurrency(v)}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend
                    formatter={val => (
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        {val}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
              No expense breakdown available for this month
            </div>
          )}
        </div>
      </div>

      {/* Monthly Financial Breakdown Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Historical Financial Ledger
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Month-by-month cashflow statement summary
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Month</th>
                <th className="px-6 py-3.5">Income</th>
                <th className="px-6 py-3.5">Expenses</th>
                <th className="px-6 py-3.5">Net Savings</th>
                <th className="px-6 py-3.5">Savings Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60 text-xs">
              {trends.map(t => {
                const inc = parseFloat(t.income || 0)
                const exp = parseFloat(t.expenses || 0)
                const sav = inc - exp
                const rate = inc > 0 ? Math.round((sav / inc) * 100) : 0

                return (
                  <tr key={t.month} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{t.month}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(inc)}</td>
                    <td className="px-6 py-4 font-semibold text-rose-500">{formatCurrency(exp)}</td>
                    <td className={`px-6 py-4 font-bold ${sav >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                      {formatCurrency(sav)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        rate >= 20
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : rate > 0
                          ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                      }`}>
                        {rate}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
