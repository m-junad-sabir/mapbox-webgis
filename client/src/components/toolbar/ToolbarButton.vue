<template>
  <button
    type="button"
    :title="label"
    :aria-label="label"
    :class="[
      'inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors',
      active ? 'bg-blue-600 text-white' : 'hover:bg-slate-100',
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
  active: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>
