import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const rightPanelOpen = ref(false)
  const activePanel = ref(null)
  const mobileMenuOpen = ref(false)

  const panelTitles = {
    layers: 'Layers',
    search: 'Search',
    upload: 'Upload',
    bookmarks: 'Bookmarks',
    qc: 'QC Flags',
    basemap: 'Basemaps',
  }

  const activePanelTitle = computed(() => panelTitles[activePanel.value] || '')

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function openPanel(panel) {
    activePanel.value = panel
    rightPanelOpen.value = true
    mobileMenuOpen.value = false
  }

  function closePanel() {
    rightPanelOpen.value = false
    activePanel.value = null
  }

  function togglePanel(panel) {
    if (activePanel.value === panel && rightPanelOpen.value) {
      closePanel()
    } else {
      openPanel(panel)
    }
  }

  function setSidebarForViewport({ isMobile, isTablet }) {
    if (isMobile) {
      sidebarOpen.value = false
    } else if (isTablet) {
      sidebarOpen.value = false
    } else {
      sidebarOpen.value = true
    }
  }

  return {
    sidebarOpen,
    rightPanelOpen,
    activePanel,
    mobileMenuOpen,
    activePanelTitle,
    toggleSidebar,
    openPanel,
    closePanel,
    togglePanel,
    setSidebarForViewport,
  }
})
