import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import TestView from '../views/TestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/test',
      name: 'test',
      component: TestView,
      meta: { 
        requiresAuth: false,
        title: 'Test Page',
        breadcrumbs: [
          { title: 'Home', disabled: false, to: '/' },
          { title: 'Test', disabled: true }
        ]
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { 
        requiresAuth: true,
        title: 'Dashboard',
        breadcrumbs: [
          { title: 'Dashboard', disabled: true }
        ]
      },
    },
    {
      path: '/projects',
      name: 'projects',
      component: HomeView, // Reuse HomeView for now
      meta: { 
        requiresAuth: true,
        title: 'Projects',
        breadcrumbs: [
          { title: 'Home', disabled: false, to: '/' },
          { title: 'Projects', disabled: true }
        ]
      },
    },
    {
      path: '/artifacts',
      name: 'artifacts',
      component: HomeView, // Reuse HomeView for now
      meta: { 
        requiresAuth: true,
        title: 'Artifacts',
        breadcrumbs: [
          { title: 'Home', disabled: false, to: '/' },
          { title: 'Artifacts', disabled: true }
        ]
      },
    },
    {
      path: '/reports',
      name: 'reports',
      component: HomeView, // Reuse HomeView for now
      meta: { 
        requiresAuth: true,
        title: 'Reports',
        breadcrumbs: [
          { title: 'Home', disabled: false, to: '/' },
          { title: 'Reports', disabled: true }
        ]
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: TestView, // Reuse TestView for now
      meta: { 
        requiresAuth: true,
        title: 'Settings',
        breadcrumbs: [
          { title: 'Home', disabled: false, to: '/' },
          { title: 'Settings', disabled: true }
        ]
      },
    },
    {
      path: '/epic/:id',
      name: 'epic-detail',
      component: () => import('../views/EpicDetailView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Epic Detail',
        breadcrumbs: [
          { title: 'Home', disabled: false, to: '/' },
          { title: 'Epic Detail', disabled: true }
        ]
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'About',
        breadcrumbs: [
          { title: 'Home', disabled: false, to: '/' },
          { title: 'About', disabled: true }
        ]
      },
    },
  ],
})

// Navigation guard for authentication
router.beforeEach((to, _from, next) => {
  console.log('Router navigation:', to.path, to.name)
  const token = localStorage.getItem('tuleap_token')
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !token) {
    console.log('Redirecting to login - no token')
    next('/login')
  } else if (to.path === '/login' && token) {
    console.log('Redirecting to home - has token')
    next('/')
  } else {
    console.log('Allowing navigation')
    next()
  }
})

export default router
