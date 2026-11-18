import api from './api'
export const getSavingsGoals = (params) => api.get('/savings-goals', { params })
export const createSavingsGoal = (data) => api.post('/savings-goals', data)
export const updateSavingsGoal = (id, data) => api.put(`/savings-goals/${id}`, data)
export const deleteSavingsGoal = (id) => api.delete(`/savings-goals/${id}`)
export const addContribution = (goalId, data) => api.post(`/savings-goals/${goalId}/contributions`, data)
export const getContributions = (goalId) => api.get(`/savings-goals/${goalId}/contributions`)
