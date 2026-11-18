export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount || 0)

export const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })

export const formatRelativeDate = (date) => {
  const diff = Date.now() - new Date(date)
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return formatDate(date)
}

export const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

export const truncateText = (text, max = 50) => text?.length > max ? text.slice(0, max) + '...' : text
