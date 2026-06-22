import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 8000,
})

export const listTherapists = (params: any) =>
  api.get('/therapists', { params }).then((res) => res.data)

export const getTherapist = (id: number) =>
  api.get(`/therapists/${id}`).then((res) => res.data)

export const getFilters = (params?: any) =>
  api.get('/therapists/filters', { params }).then((res) => res.data)

export default api
