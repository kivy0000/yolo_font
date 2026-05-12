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
          component: () => import('../components/inside/center/Content.vue')
        } ,
        {
          path: '/data',
          name: 'Data',
          component: () => import('../components/inside/center/Data.vue')
        } ,
        {
          path: '/yolo',
          name: 'Yolo',
          component: () => import('../components/inside/center/Yolo.vue')
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
