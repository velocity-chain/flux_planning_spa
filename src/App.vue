<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon
        v-if="isAuthenticated"
        @click="drawer = !drawer"
        data-automation-id="nav-drawer-toggle"
        aria-label="Open navigation drawer"
      />
      <v-app-bar-title>Planning</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-if="isAuthenticated"
      v-model="drawer"
      temporary
    >
      <v-list density="compact" nav>
        
        <v-list-subheader>SCENARIO DOMAIN</v-list-subheader>
        <v-list-item
          to="/scenarios"
          prepend-icon="mdi-view-list"
          title="List Scenarios"
          data-automation-id="nav-scenarios-list-link"
        />
        <v-list-item
          to="/scenarios/new"
          prepend-icon="mdi-plus"
          title="New Scenario"
          data-automation-id="nav-scenarios-new-link"
        />

        <v-divider class="my-2" />
        
        <v-list-subheader>DEMAND DOMAIN</v-list-subheader>
        <v-list-item
          to="/demands"
          prepend-icon="mdi-view-list"
          title="List Demands"
          data-automation-id="nav-demands-list-link"
        />
        <v-list-item
          to="/demands/new"
          prepend-icon="mdi-plus"
          title="New Demand"
          data-automation-id="nav-demands-new-link"
        />

        <v-divider class="my-2" />
        
        
        <v-list-subheader>OPTIMIZATION DOMAIN</v-list-subheader>
        <v-list-item
          to="/optimizations"
          prepend-icon="mdi-view-list"
          title="List Optimizations"
          data-automation-id="nav-optimizations-list-link"
        />
        <v-list-item
          to="/optimizations/new"
          prepend-icon="mdi-plus"
          title="New Optimization"
          data-automation-id="nav-optimizations-new-link"
        />

        <v-divider class="my-2" />
        
        
        <v-list-subheader>ORGANIZATION DOMAIN</v-list-subheader>
        <v-list-item
          to="/organizations"
          prepend-icon="mdi-view-list"
          title="List Organizations"
          data-automation-id="nav-organizations-list-link"
        />
        
        <v-list-subheader>PRODUCT DOMAIN</v-list-subheader>
        <v-list-item
          to="/products"
          prepend-icon="mdi-view-list"
          title="List Products"
          data-automation-id="nav-products-list-link"
        />
        
        <v-list-subheader>SUPPLIER DOMAIN</v-list-subheader>
        <v-list-item
          to="/suppliers"
          prepend-icon="mdi-view-list"
          title="List Suppliers"
          data-automation-id="nav-suppliers-list-link"
        />
        
        <v-list-subheader>ANALYTICS DOMAIN</v-list-subheader>
        <v-list-item
          to="/analyticss"
          prepend-icon="mdi-view-list"
          title="List Analyticss"
          data-automation-id="nav-analyticss-list-link"
        />
        
      </v-list>

      <template v-slot:append>
        <v-divider />
        <v-list density="compact" nav>
          <v-list-item
            v-if="hasAdminRole"
            to="/admin"
            prepend-icon="mdi-cog"
            title="Admin"
            data-automation-id="nav-admin-link"
          />
          <v-list-item
            @click="handleLogout"
            prepend-icon="mdi-logout"
            title="Logout"
            data-automation-id="nav-logout-link"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useConfig } from '@/composables/useConfig'
import { useRoles } from '@/composables/useRoles'

const router = useRouter()
const { isAuthenticated, logout } = useAuth()
const { loadConfig } = useConfig()
const { hasRole } = useRoles()
const drawer = ref(false)

const hasAdminRole = hasRole('admin')

// Close temporary drawer when route changes (e.g. after clicking nav link)
router.afterEach(() => {
  drawer.value = false
})

onMounted(async () => {
  // Load config if user is already authenticated (e.g., on page reload)
  if (isAuthenticated.value) {
    try {
      await loadConfig()
    } catch (error) {
      // Silently fail - config will be loaded on next login if needed
      console.warn('Failed to load config on mount:', error)
    }
  }
})

function handleLogout() {
  logout()
  drawer.value = false
  router.push('/login')
}
</script>