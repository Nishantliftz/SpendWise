import api from './api'
export const getSummary = (params) => api.get('/dashboard/summary', { params })
export const getMonthlyTrends = (params) => api.get('/dashboard/monthly-trends', { params })
export const getCategoryBreakdown = (params) => api.get('/dashboard/category-breakdown', { params })
