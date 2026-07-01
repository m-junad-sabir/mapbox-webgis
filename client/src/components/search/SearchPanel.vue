<template>
  <div class="space-y-4">
    <div>
      <label class="mb-1 block text-xs font-medium text-slate-600">Location search</label>
      <input
        v-model="locationQuery"
        type="search"
        placeholder="Search places…"
        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      <p class="mt-2 text-xs text-slate-500">
        MapTiler Geocoder will be wired in Phase 10. Requires
        <code class="font-mono">VITE_MAPTILER_API_KEY</code>.
      </p>
    </div>

    <div>
      <label class="mb-1 block text-xs font-medium text-slate-600">Feature search</label>
      <input
        v-model="featureQuery"
        type="search"
        placeholder="Search active layer attributes…"
        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const locationQuery = ref('')
const featureQuery = ref('')
</script>
