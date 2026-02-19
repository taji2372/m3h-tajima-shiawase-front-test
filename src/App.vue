<script setup>
import { ref, computed } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const transitionName = ref('fade')

const showLeftStack = computed(() => {
  const name = route.name
  return name !== 'top'
})

const isResultsPage = computed(() => route.name === 'results')

const getRouteDepth = (route) => {
  if (route.name === 'top') return 0
  if (route.name === 'description') return 10
  if (route.name === 'instruction') return 12
  if (route.name === 'intro-start') return 13
  if (route.name === 'profile') return 15
  if (route.name === 'results') return 200
  if (route.name === 'finish') return 300

  if (route.path.startsWith('/survey')) {
    const slug = route.params.phaseSlug || ''
    const phaseId = parseInt(slug.replace('phase', '')) || 0
    const isResult = route.params.step === 'result'
    return 20 + phaseId * 2 + (isResult ? 1 : 0)
  }

  return 100
}

const isFlipPair = (from, to) => {
  const fromName = from?.name
  const toName = to?.name
  const a = (fromName === 'top' && toName === 'description')
  const b = (fromName === 'description' && toName === 'top')
  return a || b
}

router.afterEach((to, from) => {
  if (isFlipPair(from, to)) {
    const toDepth = getRouteDepth(to)
    const fromDepth = getRouteDepth(from)
    transitionName.value = toDepth < fromDepth ? 'page-flip-reverse' : 'page-flip'
    return
  }
  transitionName.value = 'fade'
})
</script>

<template>
  <main>
    <div class="book-container" :class="{ 'results-container': isResultsPage }">
      <div v-show="showLeftStack" class="left-page-stack"></div>

      <RouterView v-slot="{ Component, route }">
        <Transition :name="transitionName">
          <div class="page-wrapper" :key="route.path">
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--cork-color);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E");
  overflow: hidden;
  perspective: 2000px;
  transform-style: preserve-3d;
}

.book-container {
  position: relative;
  width: 90vw;
  height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
}

/* Tablet optimization (iPad, etc.) */
@media (min-width: 768px) and (max-width: 1366px) {
  .book-container {
    width: 95vw;
    height: 92vh;
  }
}

.left-page-stack {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  transform: rotateY(-180deg);
  z-index: 0;
  background-color: #fdfbf7;
  background-image:
    linear-gradient(
      to right,
      rgba(0, 0, 0, 0.05) 0%,
      rgba(255, 255, 255, 0.2) 5%,
      rgba(255, 255, 255, 0.2) 95%,
      rgba(0, 0, 0, 0.1) 100%
    ),
    url('@/assets/paper-texture.jpg');
  background-repeat: repeat;
  background-size: 500px auto;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
  border-left: 1px solid #ddd;
}

.page-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  transform-style: preserve-3d;
  will-change: transform;
}

.page-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #f8f8f8 0%, #ffffff 5%, #ffffff 95%, #f0f0f0 100%);
  transform: rotateY(180deg);
  backface-visibility: visible;
  z-index: -1;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
}

/* Forward Page Flip Animation */
.page-flip-enter-active,
.page-flip-leave-active {
  transition: all 1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.page-flip-leave-from {
  transform: rotateY(0deg);
  filter: brightness(1);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}

.page-flip-leave-active {
  z-index: 10;
}

.page-flip-leave-to {
  transform: rotateY(-180deg);
  filter: brightness(0.6);
  box-shadow: -20px 0 50px rgba(0, 0, 0, 0.5);
}

.page-flip-enter-active {
  z-index: 1;
}

.page-flip-enter-from {
  transform: rotateY(0deg);
  filter: brightness(0.85);
}

.page-flip-enter-to {
  transform: rotateY(0deg);
  filter: brightness(1);
}

/* Reverse Page Flip (Backward) */
.page-flip-reverse-enter-active,
.page-flip-reverse-leave-active {
  transition: all 1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.page-flip-reverse-enter-active {
  z-index: 10;
}

.page-flip-reverse-enter-from {
  transform: rotateY(-180deg);
  filter: brightness(0.6);
  box-shadow: -20px 0 50px rgba(0, 0, 0, 0.5);
}

.page-flip-reverse-enter-to {
  transform: rotateY(0deg);
  filter: brightness(1);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}

.page-flip-reverse-leave-active {
  z-index: 1;
}

.page-flip-reverse-leave-from {
  transform: rotateY(0deg);
  filter: brightness(1);
}

.page-flip-reverse-leave-to {
  transform: rotateY(0deg);
  filter: brightness(0.85);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (max-width: 768px) {
  main {
    height: 100vh;
    min-height: 0;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    padding: 0;
    perspective: 1500px;
    background-size: cover;
  }

  .book-container {
    width: 88vw;
    height: 85vh;
    min-height: 0;
    padding: 0;
    margin-left: 20px;
    transform-style: preserve-3d;
  }

  .left-page-stack {
    display: block;
  }

  .page-wrapper {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--paper-color, #fdfbf7);
    -webkit-overflow-scrolling: touch;
  }
}

@media (max-width: 380px) {
  .book-container {
    width: 85vw;
    height: 80vh;
    margin-left: 15px;
  }
}
</style>
