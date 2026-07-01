import { defineStore } from 'pinia'
import { ref } from 'vue'
import { flagService } from '@/services/gisServices'

export const useFlagStore = defineStore('flags', () => {
  const flags = ref([])
  const loading = ref(false)

  async function fetchFlags() {
    loading.value = true
    try {
      flags.value = await flagService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function addFlag(payload) {
    const created = await flagService.create(payload)
    flags.value.unshift(created)
    return created
  }

  async function updateFlag(id, payload) {
    const updated = await flagService.update(id, payload)
    const index = flags.value.findIndex((f) => f.id === id)
    if (index !== -1) flags.value[index] = updated
    return updated
  }

  async function removeFlag(id) {
    await flagService.remove(id)
    flags.value = flags.value.filter((f) => f.id !== id)
  }

  return { flags, loading, fetchFlags, addFlag, updateFlag, removeFlag }
})
