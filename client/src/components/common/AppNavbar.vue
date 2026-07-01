<template>
  <header class="z-30 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 shadow-sm md:px-4">
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Toggle menu"
        @click="ui.mobileMenuOpen = !ui.mobileMenuOpen"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
          G
        </div>
        <div class="hidden sm:block">
          <p class="text-sm font-semibold text-slate-900">WebGIS Editor</p>
          <p class="text-xs text-slate-500">CRUD &amp; Layer Management</p>
        </div>
      </div>
    </div>

    <div class="hidden max-w-md flex-1 px-4 md:block">
      <div class="relative">
        <input
          type="search"
          placeholder="Search locations or features…"
          class="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          @focus="ui.openPanel('search')"
        />
        <svg class="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <div class="flex items-center gap-1">
      <button
        type="button"
        class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        aria-label="Search"
        @click="ui.openPanel('search')"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useUiStore } from '@/stores/uiStore'

const ui = useUiStore()
</script>
