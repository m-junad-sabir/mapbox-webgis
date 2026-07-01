<template>
  <div class="space-y-4">
    <p class="text-sm text-slate-600">
      Click the map to place a QC flag. Full flag workflow ships in Phase 9.
    </p>

    <ul v-if="flags.length" class="space-y-2">
      <li
        v-for="flag in flags"
        :key="flag.id"
        class="rounded-lg border border-slate-200 px-3 py-2 text-sm"
      >
        <p class="font-medium text-slate-900">{{ flag.issue }}</p>
        <p class="text-xs text-slate-500">{{ flag.status }}</p>
      </li>
    </ul>
    <p v-else class="text-sm text-slate-500">No QC flags yet.</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFlagStore } from '@/stores/flagStore'

const flagStore = useFlagStore()
const { flags } = storeToRefs(flagStore)

onMounted(() => flagStore.fetchFlags())
</script>
