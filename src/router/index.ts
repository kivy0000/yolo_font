import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_API),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('../components/Main.vue'),
      redirect: '/content',
      children: [
        {
          path: '/content',
          name: 'Content',
          component: () => import('../components/Content.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../components/Login.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Error',
      component: () => import('../components/Error.vue'),
      meta: {
        filePath: ''
      }
    }
  ],
})

export default router
