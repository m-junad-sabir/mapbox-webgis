<template>
  <div class="space-y-4">
    <p class="text-sm text-slate-600">
      Upload GeoJSON, KML, KMZ, or ZIP Shapefile. Files are parsed by the Express API and stored in Supabase/PostGIS.
    </p>

    <label
      class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-4 py-10 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50"
    >
      <svg class="mb-2 h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5 5 5M12 5v12" />
      </svg>
      <span class="text-sm font-medium text-slate-700">Choose a file</span>
      <span class="mt-1 text-xs text-slate-500">.geojson, .kml, .kmz, .zip</span>
      <input
        type="file"
        class="hidden"
        accept=".geojson,.json,.kml,.kmz,.zip"
        @change="onFileSelect"
      />
    </label>

    <div v-if="uploading" class="text-sm text-blue-600">Uploading…</div>
    <div v-if="uploadError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ uploadError }}
    </div>
    <div v-if="uploadSuccess" class="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
      Layer created successfully.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { uploadService } from '@/services/gisServices'
import { useLayerStore } from '@/stores/layerStore'

const layerStore = useLayerStore()
const uploading = ref(false)
const uploadError = ref(null)
const uploadSuccess = ref(false)

async function onFileSelect(event) {
  const file = event.target.files?.[0]
  if (!file) return

  uploading.value = true
  uploadError.value = null
  uploadSuccess.value = false

  try {
    await uploadService.upload(file)
    uploadSuccess.value = true
    await layerStore.fetchLayers()
  } catch (err) {
    uploadError.value = err.message
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}
</script>
