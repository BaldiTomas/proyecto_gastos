import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '../components/auth.vue'
import administrador from '../components/administrador.vue'
import { getAuth } from 'firebase/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Auth
  },
  {
    path: '/dashboard',
    component: administrador,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
    next('/');
  } else {
    next();
  }
});

export default router