<template>
  <div class="flex h-full flex-col overflow-hidden bg-slate-100">
    <AppNavbar />

    <div class="relative flex min-h-0 flex-1">
      <AppSidebar />

      <main class="relative min-w-0 flex-1">
        <MapContainer />
        <MapToolbar />
      </main>

      <RightPanel />
    </div>

    <AppStatusBar />
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppStatusBar from '@/components/common/AppStatusBar.vue'
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
import MapContainer from '@/components/map/MapContainer.vue'
import MapToolbar from '@/components/toolbar/MapToolbar.vue'
import RightPanel from '@/components/panels/RightPanel.vue'
import { useResponsive } from '@/composables/useResponsive'
import { useUiStore } from '@/stores/uiStore'

const ui = useUiStore()
const { isMobile, isTablet, isDesktop } = useResponsive()

watch([isMobile, isTablet, isDesktop], () => {
  ui.setSidebarForViewport({ isMobile: isMobile.value, isTablet: isTablet.value })
}, { immediate: true })

onMounted(() => {
  ui.setSidebarForViewport({ isMobile: isMobile.value, isTablet: isTablet.value })
})
</script>
