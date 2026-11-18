import React, { useState, useEffect } from 'react'
import {
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  Shield,
  Save,
  KeyRound,
  CheckCircle2
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import * as userService from '../services/userService'
import { getInitials } from '../utils/formatters'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateUser } = useAuth()

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    currency: user?.currency || 'USD'
  })
  const [profileLoading, setProfileLoading] = useState(false)

  // Password Form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        currency: user.currency || 'USD'
      })
    }
  }, [user])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      const res = await userService.updateProfile(profileForm)
      updateUser(res.data.data)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    setPasswordLoading(true)
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      toast.success('Password changed successfully!')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal identity, contact details, security credentials, and preferred currency
        </p>
      </div>

      {/* Hero Badge Profile Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
          {getInitials(user?.fullName || 'User')}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {user?.fullName || 'SpendWise User'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {user?.email || 'user@example.com'}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Active User
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Currency: {user?.currency || 'USD'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
              <User className="h-4 w-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Personal Information
              </h3>
            </div>

            <form onSubmit={handleProfileSubmit} id="profile-form" className="space-y-4">
              <div>
                <label className="label">Full Legal Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="input-field pl-10"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="label">Email Address (Primary)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="input-field pl-10 opacity-60 cursor-not-allowed bg-gray-50 dark:bg-slate-800"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed directly.</p>
              </div>

              <div>
                <label className="label">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="input-field pl-10"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="label">Preferred Currency</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={profileForm.currency}
                    onChange={(e) => setProfileForm({ ...profileForm, currency: e.target.value })}
                    className="input-field pl-10"
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="CAD">CAD ($) - Canadian Dollar</option>
                    <option value="AUD">AUD ($) - Australian Dollar</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              form="profile-form"
              disabled={profileLoading}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>{profileLoading ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
              <Shield className="h-4 w-4 text-purple-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Change Password
              </h3>
            </div>

            <form onSubmit={handlePasswordSubmit} id="password-form" className="space-y-4">
              <div>
                <label className="label">Current Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="label">New Password *</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="input-field pl-10"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="label">Confirm New Password *</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="input-field pl-10"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              form="password-form"
              disabled={passwordLoading}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <KeyRound className="h-4 w-4" />
              <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
