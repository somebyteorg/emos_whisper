import { createRouter, createWebHistory } from 'vue-router'
import { useSignStore } from '@/stores/sign'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  let token = to.query.token
  if (typeof token === 'string' && token) {
    useSignStore().setToken(token)
    return { path: '/', replace: true }
  }

  return true
})

export default router
