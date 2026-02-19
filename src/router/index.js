import { createRouter, createWebHistory } from 'vue-router'
import TopView from '../views/TopView.vue'
import DescriptionView from '../views/DescriptionView.vue'
import InstructionView from '../views/InstructionView.vue'
import IntroStartView from '../views/IntroStartView.vue'
import ProfileView from '../views/ProfileView.vue'
import SurveyView from '../views/SurveyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'top',
      component: TopView,
    },
    {
      path: '/description',
      name: 'description',
      component: DescriptionView,
    },
    {
      path: '/instruction',
      name: 'instruction',
      component: InstructionView,
    },
    {
      path: '/intro-start',
      name: 'intro-start',
      component: IntroStartView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      // Optional :step parameter for 'input' or 'result'
      path: '/survey/:phaseSlug/:step?',
      name: 'survey',
      component: SurveyView,
      // Extract numeric ID from "phase0", "phase1" etc.
      props: (route) => {
        const slug = route.params.phaseSlug
        // Remove 'phase' prefix and parse int
        const id = parseInt(slug.replace('phase', ''))

        return {
          phaseId: isNaN(id) ? 0 : id,
          step: route.params.step || 'input',
        }
      },
    },
    {
      path: '/results',
      name: 'results',
      component: () => import('../views/ResultsView.vue'),
    },
    {
      path: '/finish',
      name: 'finish',
      component: () => import('../views/FinishView.vue'),
    },
  ],
})

export default router
