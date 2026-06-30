import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/personas',
    name: 'personas',
    component: () => import('@/pages/PersonasPage.vue')
  },
  {
    path: '/personas/:id',
    name: 'persona',
    component: () => import('@/pages/PersonaPage.vue')
  },
  {
    path: '/eventos',
    name: 'eventos',
    component: () => import('@/pages/EventosPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
