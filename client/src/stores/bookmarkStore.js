import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bookmarkService } from '@/services/gisServices'

export const useBookmarkStore = defineStore('bookmarks', () => {
  const bookmarks = ref([])
  const loading = ref(false)

  async function fetchBookmarks() {
    loading.value = true
    try {
      bookmarks.value = await bookmarkService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function addBookmark(payload) {
    const created = await bookmarkService.create(payload)
    bookmarks.value.unshift(created)
    return created
  }

  async function removeBookmark(id) {
    await bookmarkService.remove(id)
    bookmarks.value = bookmarks.value.filter((b) => b.id !== id)
  }

  return { bookmarks, loading, fetchBookmarks, addBookmark, removeBookmark }
})
