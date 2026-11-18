import React from 'react'
import { Outlet } from 'react-router-dom'
import { DollarSign, TrendingUp, PieChart, Shield } from 'lucide-react'

const features = [
  { icon: TrendingUp, text: 'Track income & expenses in real time' },
  { icon: PieChart, text: 'Visualize spending with smart analytics' },
  { icon: Shield, text: 'Set budgets and reach savings goals' },
]

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f1f3d] via-[#1a3a6b] to-[#2563eb] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-56 h-56 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="p-2.5 bg-white/15 backdrop-blur-sm rounded-xl">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SpendWise</span>
          </div>

          {/* Tagline */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Take control of your finances
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed">
              Track spending, set budgets, and reach your savings goals with SpendWise — your personal finance companion.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-5">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-lg shrink-0">
                  <Icon className="h-5 w-5 text-blue-200" />
                </div>
                <span className="text-blue-100 text-sm font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-blue-300 text-xs">
          © {new Date().getFullYear()} SpendWise. All rights reserved.
        </p>
      </div>

      {/* ── Right auth panel ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="p-2 bg-blue-600 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">SpendWise</span>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
            <Outlet />
          </div>

          <p className="text-center text-gray-400 text-xs mt-6 lg:hidden">
            © {new Date().getFullYear()} SpendWise. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
