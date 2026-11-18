import React, { useState, useEffect } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  PiggyBank,
  Calendar,
  CheckCircle2,
  Coins,
  History,
  Target
} from 'lucide-react'
import * as savingsService from '../services/savingsService'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import StatCard from '../components/common/StatCard'
import EmptyState from '../components/common/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { formatCurrency, formatDate } from '../utils/formatters'
import toast from 'react-hot-toast'

const defaultGoalForm = {
  goalName: '',
  targetAmount: '',
  targetDate: '',
  description: ''
}

const defaultContributionForm = {
  amount: '',
  contributionDate: new Date().toISOString().split('T')[0],
  description: ''
}

export default function Savings() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  // Goal modal state
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [editGoal, setEditGoal] = useState(null)
  const [goalForm, setGoalForm] = useState(defaultGoalForm)
  const [submittingGoal, setSubmittingGoal] = useState(false)

  // Contribution modal state
  const [contribModalOpen, setContribModalOpen] = useState(false)
  const [activeGoalForContrib, setActiveGoalForContrib] = useState(null)
  const [contribForm, setContribForm] = useState(defaultContributionForm)
  const [submittingContrib, setSubmittingContrib] = useState(false)

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })

  // Contributions history modal state
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [activeGoalHistory, setActiveGoalHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    setLoading(true)
    try {
      const res = await savingsService.getSavingsGoals()
      setGoals(res.data.data || [])
    } catch {
      toast.error('Failed to load savings goals')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAddGoal = () => {
    setEditGoal(null)
    setGoalForm(defaultGoalForm)
    setGoalModalOpen(true)
  }

  const handleEditGoal = (goal) => {
    setEditGoal(goal)
    setGoalForm({
      goalName: goal.goalName,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate || '',
      description: goal.description || ''
    })
    setGoalModalOpen(true)
  }

  const handleSubmitGoal = async (e) => {
    e.preventDefault()
    if (!goalForm.targetAmount || parseFloat(goalForm.targetAmount) <= 0) {
      toast.error('Target amount must be greater than 0')
      return
    }
    setSubmittingGoal(true)
    try {
      const payload = {
        ...goalForm,
        targetAmount: parseFloat(goalForm.targetAmount)
      }
      if (editGoal) {
        await savingsService.updateSavingsGoal(editGoal.id, payload)
        toast.success('Savings goal updated!')
      } else {
        await savingsService.createSavingsGoal(payload)
        toast.success('Savings goal created!')
      }
      setGoalModalOpen(false)
      fetchGoals()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally {
      setSubmittingGoal(false)
    }
  }

  const handleDeleteGoal = async () => {
    try {
      await savingsService.deleteSavingsGoal(deleteDialog.id)
      toast.success('Savings goal deleted')
      setDeleteDialog({ open: false, id: null })
      fetchGoals()
    } catch {
      toast.error('Failed to delete savings goal')
    }
  }

  const handleOpenContrib = (goal) => {
    setActiveGoalForContrib(goal)
    setContribForm(defaultContributionForm)
    setContribModalOpen(true)
  }

  const handleSubmitContrib = async (e) => {
    e.preventDefault()
    if (!contribForm.amount || parseFloat(contribForm.amount) <= 0) {
      toast.error('Contribution amount must be greater than 0')
      return
    }
    setSubmittingContrib(true)
    try {
      await savingsService.addContribution(activeGoalForContrib.id, {
        ...contribForm,
        amount: parseFloat(contribForm.amount)
      })
      toast.success('Added money to goal!')
      setContribModalOpen(false)
      fetchGoals()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deposit savings')
    } finally {
      setSubmittingContrib(false)
    }
  }

  const handleViewHistory = async (goal) => {
    setHistoryModalOpen(true)
    setHistoryLoading(true)
    try {
      const res = await savingsService.getContributions(goal.id)
      setActiveGoalHistory(res.data.data || [])
    } catch {
      toast.error('Failed to load contributions history')
    } finally {
      setHistoryLoading(false)
    }
  }

  // Summary Metrics
  const totalTarget = goals.reduce((acc, g) => acc + parseFloat(g.targetAmount || 0), 0)
  const totalSaved = goals.reduce((acc, g) => acc + parseFloat(g.currentAmount || 0), 0)
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Savings & Financial Goals
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Build wealth, reserve emergency funds, and monitor milestone achievements
          </p>
        </div>
        <button
          onClick={handleOpenAddGoal}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" /> Create Goal
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Saved"
          value={formatCurrency(totalSaved)}
          icon={PiggyBank}
          color="green"
          subtitle="Cumulative progress"
        />
        <StatCard
          title="Total Target"
          value={formatCurrency(totalTarget)}
          icon={Target}
          color="blue"
          subtitle="Across all active goals"
        />
        <StatCard
          title="Milestone Completion"
          value={`${overallProgress}%`}
          icon={CheckCircle2}
          color="purple"
          subtitle="Overall savings achievement"
        />
      </div>

      {/* Goals Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : goals.length === 0 ? (
        <EmptyState
          icon={PiggyBank}
          title="No savings goals yet"
          description="Create your first goal to set aside money for vacations, emergency funds, or major investments."
          action={
            <button onClick={handleOpenAddGoal} className="btn-primary">
              Create Goal
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const current = parseFloat(goal.currentAmount || 0)
            const target = parseFloat(goal.targetAmount || 0)
            const pct = Math.min(100, Math.round(goal.progressPercentage || 0))
            const isCompleted = current >= target

            return (
              <div
                key={goal.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">
                        🎯
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                          {goal.goalName}
                        </h3>
                        {goal.targetDate && (
                          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            <span>Target: {formatDate(goal.targetDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-slate-800"
                        title="Edit Goal"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ open: true, id: goal.id })}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Delete Goal"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                      {goal.description}
                    </p>
                  )}

                  {/* Progress Bar & Amounts */}
                  <div className="space-y-2 my-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(current)}
                      </span>
                      <span className={`font-bold ${isCompleted ? 'text-emerald-500' : 'text-purple-600 dark:text-purple-400'}`}>
                        {pct}%
                      </span>
                    </div>

                    <div className="h-3 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : pct >= 50
                            ? 'bg-purple-600'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>Saved</span>
                      <span>Target: {formatCurrency(target)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Add Money & View History */}
                <div className="pt-4 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleViewHistory(goal)}
                    className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <History className="h-3.5 w-3.5" /> History
                  </button>

                  <button
                    onClick={() => handleOpenContrib(goal)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 transition-all"
                  >
                    <Coins className="h-3.5 w-3.5" /> Deposit
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Goal Create/Edit Modal */}
      <Modal
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        title={editGoal ? 'Edit Savings Goal' : 'Create New Savings Goal'}
      >
        <form onSubmit={handleSubmitGoal} className="space-y-4">
          <div>
            <label className="label">Goal Name *</label>
            <input
              type="text"
              required
              value={goalForm.goalName}
              onChange={(e) => setGoalForm({ ...goalForm, goalName: e.target.value })}
              className="input-field"
              placeholder="e.g. Vacation to Japan, Emergency Fund"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Target Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={goalForm.targetAmount}
                onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                className="input-field"
                placeholder="5000.00"
              />
            </div>
            <div>
              <label className="label">Target Date</label>
              <input
                type="date"
                value={goalForm.targetDate}
                onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Description / Purpose</label>
            <textarea
              rows={2}
              value={goalForm.description}
              onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
              className="input-field"
              placeholder="Short note about what this goal is for..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setGoalModalOpen(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingGoal}
              className="btn-primary"
            >
              {submittingGoal ? 'Saving...' : editGoal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Contribution Modal */}
      <Modal
        isOpen={contribModalOpen}
        onClose={() => setContribModalOpen(false)}
        title={`Deposit Money to ${activeGoalForContrib?.goalName || 'Goal'}`}
      >
        <form onSubmit={handleSubmitContrib} className="space-y-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <span>Current Balance:</span>
            <span className="font-bold">
              {formatCurrency(activeGoalForContrib?.currentAmount || 0)}
            </span>
          </div>

          <div>
            <label className="label">Deposit Amount ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={contribForm.amount}
              onChange={(e) => setContribForm({ ...contribForm, amount: e.target.value })}
              className="input-field"
              placeholder="100.00"
            />
          </div>

          <div>
            <label className="label">Contribution Date *</label>
            <input
              type="date"
              required
              value={contribForm.contributionDate}
              onChange={(e) => setContribForm({ ...contribForm, contributionDate: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Note / Note (Optional)</label>
            <input
              type="text"
              value={contribForm.description}
              onChange={(e) => setContribForm({ ...contribForm, description: e.target.value })}
              className="input-field"
              placeholder="e.g. Monthly savings allocation"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setContribModalOpen(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingContrib}
              className="btn-primary"
            >
              {submittingContrib ? 'Depositing...' : 'Confirm Deposit'}
            </button>
          </div>
        </form>
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title="Deposit History"
      >
        {historyLoading ? (
          <LoadingSpinner />
        ) : activeGoalHistory.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-8">
            No deposits made yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
            {activeGoalHistory.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.description || 'Savings Deposit'}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {formatDate(item.contributionDate)}
                  </p>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Goal Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDeleteGoal}
        title="Delete Savings Goal"
        message="Are you sure you want to remove this savings goal? This will also remove the contribution history."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}
