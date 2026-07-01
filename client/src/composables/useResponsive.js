import { ref, computed, onMounted, onUnmounted } from 'vue'

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
}

export function useResponsive() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)

  const isMobile = computed(() => width.value < BREAKPOINTS.mobile)
  const isTablet = computed(
    () => width.value >= BREAKPOINTS.mobile && width.value < BREAKPOINTS.tablet,
  )
  const isDesktop = computed(() => width.value >= BREAKPOINTS.tablet)

  function updateWidth() {
    width.value = window.innerWidth
  }

  onMounted(() => window.addEventListener('resize', updateWidth))
  onUnmounted(() => window.removeEventListener('resize', updateWidth))

  return { width, isMobile, isTablet, isDesktop }
}
