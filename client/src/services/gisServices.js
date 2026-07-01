import api from './api'

export const layerService = {
  getAll: () => api.get('/layers').then((r) => r.data),
  create: (payload) => api.post('/layers', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/layers/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/layers/${id}`).then((r) => r.data),
}

export const featureService = {
  getByLayer: (layerId) =>
    api.get(`/layers/${layerId}/features`).then((r) => r.data),
  create: (layerId, payload) =>
    api.post(`/layers/${layerId}/features`, payload).then((r) => r.data),
  update: (id, payload) => api.put(`/features/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/features/${id}`).then((r) => r.data),
}

export const uploadService = {
  upload: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },
}

export const bookmarkService = {
  getAll: () => api.get('/bookmarks').then((r) => r.data),
  create: (payload) => api.post('/bookmarks', payload).then((r) => r.data),
  remove: (id) => api.delete(`/bookmarks/${id}`).then((r) => r.data),
}

export const flagService = {
  getAll: () => api.get('/flags').then((r) => r.data),
  create: (payload) => api.post('/flags', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/flags/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/flags/${id}`).then((r) => r.data),
}
