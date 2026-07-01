<template>
  <div class="space-y-4">
    <form class="space-y-3" @submit.prevent="saveBookmark">
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-600">Name</label>
        <input
          v-model="name"
          type="text"
          required
          placeholder="My view"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        class="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Save current view
      </button>
    </form>

    <ul v-if="bookmarks.length" class="space-y-2">
      <li
        v-for="bookmark in bookmarks"
        :key="bookmark.id"
        class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
      >
        <button
          type="button"
          class="text-left text-sm text-slate-800 hover:text-blue-600"
          @click="goToBookmark(bookmark)"
        >
          {{ bookmark.name }}
        </button>
        <button
          type="button"
          class="text-xs text-red-500 hover:text-red-700"
          @click="remove(bookmark.id)"
        >
          Delete
        </button>
      </li>
    </ul>
    <p v-else class="text-sm text-slate-500">No bookmarks saved yet.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useBookmarkStore } from '@/stores/bookmarkStore'
import { useMapStore } from '@/stores/mapStore'

const bookmarkStore = useBookmarkStore()
const mapStore = useMapStore()
const { bookmarks } = storeToRefs(bookmarkStore)
const name = ref('')

onMounted(() => bookmarkStore.fetchBookmarks())

async function saveBookmark() {
  await bookmarkStore.addBookmark({
    name: name.value,
    center: mapStore.center,
    zoom: mapStore.zoom,
    bearing: mapStore.bearing,
    pitch: mapStore.pitch,
  })
  name.value = ''
}

function goToBookmark(bookmark) {
  mapStore.flyTo({
    center: bookmark.center,
    zoom: bookmark.zoom,
    bearing: bookmark.bearing ?? 0,
    pitch: bookmark.pitch ?? 0,
  })
}

async function remove(id) {
  await bookmarkStore.removeBookmark(id)
}
</script>
