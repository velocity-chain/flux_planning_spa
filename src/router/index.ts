import { createRouter, createWebHistory } from 'vue-router'
import { useAuth, hasStoredRole } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/scenarios'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { requiresAuth: false }
    },
    
    // Control domain: Scenario
    {
      path: '/scenarios',
      name: 'Scenarios',
      component: () => import('@/pages/ScenariosListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/scenarios/new',
      name: 'ScenarioNew',
      component: () => import('@/pages/ScenarioNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/scenarios/:id',
      name: 'ScenarioEdit',
      component: () => import('@/pages/ScenarioEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Control domain: Demand
    {
      path: '/demands',
      name: 'Demands',
      component: () => import('@/pages/DemandsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/demands/new',
      name: 'DemandNew',
      component: () => import('@/pages/DemandNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/demands/:id',
      name: 'DemandEdit',
      component: () => import('@/pages/DemandEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    
    // Create domain: Optimization
    {
      path: '/optimizations',
      name: 'Optimizations',
      component: () => import('@/pages/OptimizationsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/optimizations/new',
      name: 'OptimizationNew',
      component: () => import('@/pages/OptimizationNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/optimizations/:id',
      name: 'OptimizationView',
      component: () => import('@/pages/OptimizationViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    
    // Consume domain: Organization
    {
      path: '/organizations',
      name: 'Organizations',
      component: () => import('@/pages/OrganizationsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/organizations/:id',
      name: 'OrganizationView',
      component: () => import('@/pages/OrganizationViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Consume domain: Product
    {
      path: '/products',
      name: 'Products',
      component: () => import('@/pages/ProductsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/products/:id',
      name: 'ProductView',
      component: () => import('@/pages/ProductViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Consume domain: Supplier
    {
      path: '/suppliers',
      name: 'Suppliers',
      component: () => import('@/pages/SuppliersListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/suppliers/:id',
      name: 'SupplierView',
      component: () => import('@/pages/SupplierViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Consume domain: Analytics
    {
      path: '/analyticss',
      name: 'Analyticss',
      component: () => import('@/pages/AnalyticssListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/analyticss/:id',
      name: 'AnalyticsView',
      component: () => import('@/pages/AnalyticsViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Admin route
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/pages/AdminPage.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth()
  
  // Check authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check role-based authorization
  const requiredRole = to.meta.requiresRole as string | undefined
  if (requiredRole && !hasStoredRole(requiredRole)) {
    // Redirect to default page if user doesn't have required role
    next({ name: 'Scenarios' })
    return
  }
  
  next()
})

router.afterEach((to) => {
  document.title = to.path === '/login' ? 'Velocity Chain Login' : 'Planning'
})

export default router