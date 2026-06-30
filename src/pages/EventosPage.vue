<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useEventos } from '@/composables/useEventos'
import { usePersonas } from '@/composables/usePersonas'
import EventoCard from '@/components/EventoCard.vue'
import EventoForm from '@/components/EventoForm.vue'
import ExportadorPanel from '@/components/ExportadorPanel.vue'
import type { TipoEvento, CrearEventoPayload, EventoDTO } from '@/types/arbol.types'
import { obtenerIconoEvento, obtenerColorEvento } from '@/utils/formateadores'

const { personas, cargarPersonas } = usePersonas()
const { eventos, eventosFiltrados, loading, totalEventos, eventosPorTipo, setFiltroTipo, filtroTipo, actualizarEvento, eliminarEvento } = useEventos()

const tiposFiltro: { value: TipoEvento | null; label: string }[] = [
  { value: null, label: 'Todos' },
  { value: 'Nacimiento', label: '👶 Nacimientos' },
  { value: 'Matrimonio', label: '💒 Matrimonios' },
  { value: 'Defuncion', label: '⚰️ Defunciones' },
  { value: 'Migracion', label: '✈️ Migraciones' }
]

const allEventos = ref<any[]>([])
const filtroPersona = ref<string>('')
const showEventoForm = ref(false)
const eventoAEditar = ref<any>(null)

async function loadAllData() {
  await cargarPersonas()
  const all: any[] = []
  for (const p of personas.value) {
    if (p.eventos) {
      all.push(...p.eventos)
    }
  }
  allEventos.value = all
}

onMounted(async () => {
  await loadAllData()
})

function abrirEditarEvento(evento: any) {
  eventoAEditar.value = evento
  showEventoForm.value = true
}

function cerrarEventoForm() {
  eventoAEditar.value = null
  showEventoForm.value = false
}

async function handleGuardarEvento(payload: CrearEventoPayload) {
  if (!eventoAEditar.value) return
  try {
    await actualizarEvento(eventoAEditar.value.personaId, eventoAEditar.value.id, payload)
    cerrarEventoForm()
    await loadAllData()
  } catch {}
}

async function handleEliminarEvento(eventoId: string) {
  const ev = allEventos.value.find(x => x.id === eventoId)
  if (!ev) return
  try {
    await eliminarEvento(ev.personaId, eventoId)
    await loadAllData()
  } catch {}
}

const filteredByPersona = computed(() => {
  if (!filtroPersona.value) return allEventos.value
  return allEventos.value.filter(e => e.personaId === filtroPersona.value)
})

const displayedEventos = computed(() => {
  if (!filtroTipo.value) return filteredByPersona.value
  return filteredByPersona.value.filter(e => e.tipo === filtroTipo.value)
})

const totalPorTipo = computed(() => {
  const counts: Record<string, number> = { Nacimiento: 0, Matrimonio: 0, Defuncion: 0, Migracion: 0 }
  filteredByPersona.value.forEach(e => { if (counts[e.tipo] !== undefined) counts[e.tipo]++ })
  return counts
})

const maxCount = computed(() => Math.max(...Object.values(totalPorTipo.value), 1))
</script>

<template>
  <div class="eventos-page">
    <div class="page-header">
      <h1>Eventos</h1>
      <span class="count-badge">{{ displayedEventos.length }}</span>
    </div>

    <!-- Stats bars -->
    <div class="stats-bars">
      <div v-for="(count, tipo) in totalPorTipo" :key="tipo" class="stat-bar-item">
        <div class="stat-bar-label">
          <span>{{ obtenerIconoEvento(tipo as string) }} {{ tipo }}</span>
          <span class="stat-bar-count">{{ count }}</span>
        </div>
        <div class="stat-bar-track">
          <div class="stat-bar-fill" :style="{ width: `${(count / maxCount) * 100}%`, background: obtenerColorEvento(tipo as string) }"></div>
        </div>
      </div>
    </div>

    <!-- Filters container -->
    <div class="filters-container">
      <!-- Filter tabs -->
      <div class="filter-tabs">
        <button v-for="t in tiposFiltro" :key="t.label"
          :class="['filter-tab', { active: filtroTipo === t.value }]" @click="setFiltroTipo(t.value)">
          {{ t.label }}
        </button>
      </div>

      <!-- Person filter select -->
      <div class="person-filter">
        <label for="fp-select">👤 Persona:</label>
        <select id="fp-select" v-model="filtroPersona">
          <option value="">Todas las personas</option>
          <option v-for="p in personas" :key="p.id" :value="p.id">
            {{ p.nombre }} {{ p.apellido }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else-if="displayedEventos.length" class="eventos-grid">
      <EventoCard
        v-for="e in displayedEventos"
        :key="e.id"
        :evento="e"
        @eliminar="handleEliminarEvento"
        @editar="abrirEditarEvento"
      />
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">📅</span>
      <h3>No hay eventos</h3>
      <p>Los eventos aparecerán aquí cuando los registres desde una persona.</p>
    </div>

    <!-- Modales -->
    <EventoForm
      v-if="showEventoForm"
      :evento="eventoAEditar"
      @submit="handleGuardarEvento"
      @cancel="cerrarEventoForm"
    />

    <div class="export-section">
      <ExportadorPanel />
    </div>
  </div>
</template>

<style scoped>
.eventos-page { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.page-header { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
.page-header h1 { font-size: 1.8rem; font-weight: 700; color: #fff; margin: 0; }
.count-badge { padding: 4px 14px; background: rgba(6,182,212,0.15); color: #22d3ee;
  border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
.stats-bars { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
.stat-bar-item { padding: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px; }
.stat-bar-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
  font-size: 0.85rem; color: rgba(255,255,255,0.7); }
.stat-bar-count { font-weight: 700; color: #fff; }
.stat-bar-track { height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
.stat-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; min-width: 2px; }
.filters-container { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.filter-tabs { display: flex; gap: 6px; flex-wrap: wrap; padding: 4px;
  background: rgba(255,255,255,0.03); border-radius: 14px; border: 1px solid rgba(255,255,255,0.06); }
.filter-tab { padding: 10px 18px; background: transparent; border: none; border-radius: 10px;
  color: rgba(255,255,255,0.5); font-family: 'Inter', sans-serif; font-weight: 500;
  font-size: 0.85rem; cursor: pointer; transition: all 0.25s; white-space: nowrap; }
.filter-tab:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.04); }
.filter-tab.active { color: #fff; background: rgba(139,92,246,0.2); }
.person-filter { display: flex; align-items: center; gap: 10px; }
.person-filter label { font-size: 0.85rem; color: rgba(255,255,255,0.6); font-weight: 500; }
.person-filter select { padding: 10px 32px 10px 16px; background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff;
  font-size: 0.85rem; font-family: 'Inter', sans-serif; outline: none; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center; cursor: pointer; transition: all 0.2s; }
.person-filter select:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,0.2); }
.person-filter select option { background: #1a1040; color: #fff; }
.eventos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px; margin-bottom: 40px; }
.loading-state { text-align: center; padding: 60px; }
.spinner { width: 36px; height: 36px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #8b5cf6;
  border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { text-align: center; padding: 60px 20px; }
.empty-icon { font-size: 3rem; display: block; margin-bottom: 12px; opacity: 0.4; }
.empty-state h3 { color: rgba(255,255,255,0.6); margin-bottom: 8px; }
.empty-state p { color: rgba(255,255,255,0.35); font-size: 0.9rem; }
.export-section { margin-top: 20px; }
</style>
