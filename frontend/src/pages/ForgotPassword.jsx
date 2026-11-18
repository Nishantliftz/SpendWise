import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    // Simulate API call delay
    await new Promise((res) => setTimeout(res, 1200))
    setLoading(false)
    setSubmitted(true)
    toast.success('Reset link sent! Check your email.')
  }

  if (submitted) {
    return (
      <div className="w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          We&apos;ve sent a password reset link to
        </p>
        <p className="font-semibold text-gray-800 dark:text-gray-200 mb-6">{email}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
          Didn&apos;t receive an email? Check your spam folder or{' '}
          <button
            onClick={() => setSubmitted(false)}
            className="text-primary-800 dark:text-blue-400 hover:underline font-medium"
          >
            try again
          </button>
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Mail className="h-7 w-7 text-blue-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot password?</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          No worries! Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              placeholder="john@example.com"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
      <div className="text-center mt-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
