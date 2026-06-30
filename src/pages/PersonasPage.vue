<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePersonas } from '@/composables/usePersonas'
import PersonaCard from '@/components/PersonaCard.vue'
import PersonaForm from '@/components/PersonaForm.vue'
import type { CrearPersonaPayload } from '@/types/arbol.types'

const { personasFiltradas, loading, error, searchQuery, totalPersonas, cargarPersonas, crearPersona } = usePersonas()
const showForm = ref(false)

async function handleCrear(payload: CrearPersonaPayload) {
  try {
    await crearPersona(payload)
    showForm.value = false
  } catch {}
}

onMounted(() => cargarPersonas())
</script>

<template>
  <div class="personas-page">
    <div class="page-header">
      <div class="header-left">
        <h1>Personas</h1>
        <span class="count-badge">{{ totalPersonas }}</span>
      </div>
      <button class="btn-add" @click="showForm = true">
        <span>➕</span> Agregar Persona
      </button>
    </div>

    <div class="search-bar">
      <span class="search-icon">🔍</span>
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre o apellido..." id="personas-search" />
    </div>

    <div v-if="error" class="error-msg">⚠️ {{ error }}</div>

    <div v-if="loading" class="skeleton-grid">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <div class="skeleton-circle"></div>
        <div class="skeleton-lines">
          <div class="skeleton-line w70"></div>
          <div class="skeleton-line w50"></div>
        </div>
      </div>
    </div>

    <div v-else-if="personasFiltradas.length" class="personas-grid">
      <PersonaCard v-for="persona in personasFiltradas" :key="persona.id" :persona="persona" />
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">👥</span>
      <h3>No hay personas registradas</h3>
      <p>Comienza agregando la primera persona a tu árbol genealógico.</p>
      <button class="btn-add-empty" @click="showForm = true">➕ Agregar Persona</button>
    </div>

    <PersonaForm v-if="showForm" @submit="handleCrear" @cancel="showForm = false" />
  </div>
</template>

<style scoped>
.personas-page { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
.header-left { display: flex; align-items: center; gap: 12px; }
.header-left h1 { font-size: 1.8rem; font-weight: 700; color: #fff; margin: 0; }
.count-badge { padding: 4px 14px; background: rgba(139,92,246,0.15); color: #a78bfa;
  border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
.btn-add { display: flex; align-items: center; gap: 8px; padding: 12px 24px;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4); border: none; border-radius: 14px;
  color: #fff; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.92rem;
  cursor: pointer; transition: all 0.25s; box-shadow: 0 4px 16px rgba(139,92,246,0.3); }
.btn-add:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(139,92,246,0.4); }
.search-bar { position: relative; margin-bottom: 28px; }
.search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); font-size: 1rem; }
.search-bar input { width: 100%; padding: 14px 18px 14px 48px; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; color: #fff;
  font-size: 0.95rem; font-family: 'Inter', sans-serif; outline: none; transition: all 0.2s; box-sizing: border-box; }
.search-bar input:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,0.15); }
.search-bar input::placeholder { color: rgba(255,255,255,0.3); }
.error-msg { padding: 14px 18px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
  border-radius: 12px; color: #ef4444; margin-bottom: 20px; font-size: 0.9rem; }
.personas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.skeleton-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.skeleton-card { display: flex; align-items: center; gap: 16px; padding: 20px;
  background: rgba(255,255,255,0.04); border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); }
.skeleton-circle { width: 52px; height: 52px; border-radius: 50%; background: rgba(255,255,255,0.08);
  animation: pulse 1.5s ease-in-out infinite; flex-shrink: 0; }
.skeleton-lines { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.skeleton-line { height: 12px; border-radius: 6px; background: rgba(255,255,255,0.08); animation: pulse 1.5s ease-in-out infinite; }
.skeleton-line.w70 { width: 70%; }
.skeleton-line.w50 { width: 50%; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.empty-state { text-align: center; padding: 80px 20px; }
.empty-icon { font-size: 4rem; display: block; margin-bottom: 16px; opacity: 0.4; }
.empty-state h3 { color: rgba(255,255,255,0.6); font-size: 1.2rem; margin-bottom: 8px; }
.empty-state p { color: rgba(255,255,255,0.35); font-size: 0.9rem; margin-bottom: 24px; }
.btn-add-empty { padding: 12px 24px; background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  border: none; border-radius: 14px; color: #fff; font-family: 'Inter', sans-serif;
  font-weight: 600; cursor: pointer; transition: all 0.25s; }
.btn-add-empty:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(139,92,246,0.4); }
</style>
