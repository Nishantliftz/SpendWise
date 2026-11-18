/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50:'#eff6ff', 100:'#dbeafe', 200:'#bfdbfe', 300:'#93c5fd', 400:'#60a5fa', 500:'#3b82f6', 600:'#2563eb', 700:'#1d4ed8', 800:'#1e3a5f', 900:'#1e2a4a', 950:'#0f172a' },
        secondary: { 50:'#ecfdf5', 100:'#d1fae5', 400:'#34d399', 500:'#10b981', 600:'#059669', 700:'#047857' },
        danger: { 400:'#f87171', 500:'#ef4444', 600:'#dc2626' },
        warning: { 400:'#fbbf24', 500:'#f59e0b', 600:'#d97706' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
        'card-hover': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)'
      }
    }
  },
  plugins: []
}
