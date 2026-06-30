<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sidebarCollapsed = ref(false)

const navItems = [
  { path: '/', label: 'Inicio', icon: '🏠' },
  { path: '/personas', label: 'Personas', icon: '👥' },
  { path: '/eventos', label: 'Eventos', icon: '📅' }
]
</script>

<template>
  <div class="app-layout">
    <aside :class="['sidebar', { collapsed: sidebarCollapsed }]">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">🌳</span>
          <span v-if="!sidebarCollapsed" class="logo-text">SGE</span>
        </div>
        <button class="toggle-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>
      <nav class="sidebar-nav">
        <RouterLink v-for="item in navItems" :key="item.path" :to="item.path"
          :class="['nav-link', { active: route.path === item.path || (item.path !== '/' && route.path.startsWith(item.path)) }]">
          <span class="nav-icon">{{ item.icon }}</span>
          <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
        </RouterLink>
      </nav>
      <div class="sidebar-footer" v-if="!sidebarCollapsed">
        <p class="version">v1.0.0</p>
      </div>
    </aside>
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1040 50%, #0d1530 100%);
  color: #e2e8f0; min-height: 100vh; overflow-x: hidden;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.5); }
a { color: inherit; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.fade-enter-from { opacity: 0; transform: translateY(8px); }
.fade-leave-to { opacity: 0; transform: translateY(-8px); }
</style>

<style scoped>
.app-layout { display: flex; min-height: 100vh; }
.sidebar {
  width: 260px; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
  background: rgba(255,255,255,0.03); backdrop-filter: blur(24px);
  border-right: 1px solid rgba(255,255,255,0.08);
  display: flex; flex-direction: column; transition: width 0.3s ease;
}
.sidebar.collapsed { width: 72px; }
.sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 24px 20px 20px; }
.logo { display: flex; align-items: center; gap: 12px; }
.logo-icon { font-size: 1.8rem; }
.logo-text { font-size: 1.5rem; font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; }
.toggle-btn { background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 1rem;
  padding: 6px; border-radius: 6px; transition: all 0.2s; }
.toggle-btn:hover { color: #fff; background: rgba(255,255,255,0.1); }
.sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 8px 12px; }
.nav-link { display: flex; align-items: center; gap: 14px; padding: 14px 16px;
  border-radius: 12px; text-decoration: none; color: rgba(255,255,255,0.5);
  transition: all 0.25s; font-weight: 500; font-size: 0.92rem; }
.nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
.nav-link.active { color: #fff; background: rgba(139,92,246,0.15); box-shadow: 0 0 20px rgba(139,92,246,0.1); }
.nav-link.active .nav-icon { filter: drop-shadow(0 0 6px rgba(139,92,246,0.5)); }
.nav-icon { font-size: 1.25rem; flex-shrink: 0; }
.sidebar-footer { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.06); }
.version { font-size: 0.72rem; color: rgba(255,255,255,0.25); }
.main-content { flex: 1; margin-left: 260px; padding: 32px 40px; min-height: 100vh; transition: margin-left 0.3s ease; }
.sidebar.collapsed ~ .main-content { margin-left: 72px; }

@media (max-width: 768px) {
  .sidebar { width: 72px; }
  .sidebar .nav-label, .sidebar .logo-text, .sidebar .sidebar-footer { display: none; }
  .main-content { margin-left: 72px; padding: 24px 16px; }
}
</style>
