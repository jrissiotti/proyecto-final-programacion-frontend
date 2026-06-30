<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePersonas } from '@/composables/usePersonas'
import { useEventos } from '@/composables/useEventos'
import PersonaDetalle from '@/components/PersonaDetalle.vue'
import ArbolGenealogico from '@/components/ArbolGenealogico.vue'
import LineaTemporal from '@/components/LineaTemporal.vue'
import EventoForm from '@/components/EventoForm.vue'
import EventoCard from '@/components/EventoCard.vue'
import RelacionForm from '@/components/RelacionForm.vue'
import type { CrearEventoPayload, RelacionPayload } from '@/types/arbol.types'

const route = useRoute()
const router = useRouter()
const {
  personaActual,
  familia,
  personas,
  loading: loadingPersona,
  error: errorPersona,
  cargarPersona,
  cargarFamilia,
  cargarPersonas,
  eliminarPersona,
  crearRelacion,
  eliminarRelacion
} = usePersonas()

const { eventos, cargarEventos, crearEvento, actualizarEvento, eliminarEvento } = useEventos()

const activeTab = ref<'info' | 'arbol' | 'timeline'>('info')
const showEventoForm = ref(false)
const showRelacionForm = ref(false)
const showDeleteConfirm = ref(false)
const relacionError = ref<string | null>(null)
const eventoAEditar = ref<any>(null)

const personaId = route.params.id as string

async function loadData() {
  await cargarPersona(personaId)
  await cargarFamilia(personaId)
  await cargarEventos(personaId)
  await cargarPersonas() // Cargamos la lista completa de personas para poder relacionarlas
}

function abrirCrearEvento() {
  eventoAEditar.value = null
  showEventoForm.value = true
}

function abrirEditarEvento(evento: any) {
  eventoAEditar.value = evento
  showEventoForm.value = true
}

function cerrarEventoForm() {
  eventoAEditar.value = null
  showEventoForm.value = false
}

async function handleGuardarEvento(payload: CrearEventoPayload) {
  try {
    if (eventoAEditar.value) {
      await actualizarEvento(personaId, eventoAEditar.value.id, payload)
    } else {
      await crearEvento(personaId, payload)
    }
    cerrarEventoForm()
    await cargarPersona(personaId)
    await cargarEventos(personaId)
  } catch {}
}

async function handleEliminarEvento(eventoId: string) {
  try {
    await eliminarEvento(personaId, eventoId)
    await cargarPersona(personaId)
  } catch {}
}

async function handleCrearRelacion(payload: RelacionPayload) {
  relacionError.value = null
  try {
    await crearRelacion(payload)
    showRelacionForm.value = false
    // Refrescar explícitamente familia y eventos para actualizar el árbol
    await cargarFamilia(personaId)
    await cargarEventos(personaId)
  } catch (err: any) {
    relacionError.value = err.response?.data?.error || 'Error al crear relación'
  }
}

async function handleEliminarRelacion(relacionId: string) {
  relacionError.value = null
  try {
    await eliminarRelacion(relacionId)
    // Refrescar explícitamente la familia
    await cargarFamilia(personaId)
  } catch (err: any) {
    relacionError.value = err.response?.data?.error || 'Error al eliminar relación'
  }
}

async function handleEliminarPersona() {
  try {
    await eliminarPersona(personaId)
    router.push('/personas')
  } catch {}
}

onMounted(loadData)
</script>

<template>
  <div class="persona-page">
    <nav class="breadcrumb">
      <RouterLink to="/">Inicio</RouterLink>
      <span class="sep">›</span>
      <RouterLink to="/personas">Personas</RouterLink>
      <span class="sep">›</span>
      <span class="current" v-if="personaActual">{{ personaActual.nombre }} {{ personaActual.apellido }}</span>
    </nav>

    <div v-if="loadingPersona && !personaActual" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando...</p>
    </div>

    <div v-else-if="errorPersona" class="error-msg">⚠️ {{ errorPersona }}</div>

    <template v-else-if="personaActual">
      <div class="tabs">
        <button :class="['tab', { active: activeTab === 'info' }]" @click="activeTab = 'info'">📋 Información</button>
        <button :class="['tab', { active: activeTab === 'arbol' }]" @click="activeTab = 'arbol'">🌳 Árbol Familiar</button>
        <button :class="['tab', { active: activeTab === 'timeline' }]" @click="activeTab = 'timeline'">📅 Línea Temporal</button>
      </div>

      <div v-if="activeTab === 'info'" class="tab-content">
        <PersonaDetalle :persona="personaActual" :familia="familia" @eliminar-relacion="handleEliminarRelacion" />
      </div>

      <div v-if="activeTab === 'arbol'" class="tab-content">
        <ArbolGenealogico v-if="familia" :familia="familia" />
        <p v-else class="empty-msg">Cargando árbol familiar...</p>
      </div>

      <div v-if="activeTab === 'timeline'" class="tab-content">
        <div class="timeline-header">
          <h3>Eventos de {{ personaActual.nombre }}</h3>
          <button class="btn-add-event" @click="abrirCrearEvento">➕ Agregar Evento</button>
        </div>
        <LineaTemporal :eventos="eventos" />
        <div v-if="eventos.length" class="eventos-grid">
          <EventoCard v-for="e in eventos" :key="e.id" :evento="e" @eliminar="handleEliminarEvento" @editar="abrirEditarEvento" />
        </div>
      </div>

      <div class="page-actions">
        <button class="btn-add-event" @click="abrirCrearEvento">📅 Agregar Evento</button>
        <button class="btn-add-relacion" @click="showRelacionForm = true">🔗 Agregar Relación</button>
        <button class="btn-delete" @click="showDeleteConfirm = true">🗑️ Eliminar Persona</button>
      </div>

      <!-- Relación Error Banner -->
      <div v-if="relacionError" class="relacion-error">
        ⚠️ {{ relacionError }}
        <button class="close-err" @click="relacionError = null">✕</button>
      </div>

      <!-- Delete confirmation -->
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
        <div class="confirm-card">
          <h3>⚠️ Confirmar Eliminación</h3>
          <p>¿Estás seguro de eliminar a <strong>{{ personaActual.nombre }} {{ personaActual.apellido }}</strong>?</p>
          <p class="warn-text">Esta acción no se puede deshacer.</p>
          <div class="confirm-actions">
            <button class="btn-cancel" @click="showDeleteConfirm = false">Cancelar</button>
            <button class="btn-confirm-delete" @click="handleEliminarPersona">Eliminar</button>
          </div>
        </div>
      </div>

      <!-- Modales -->
      <EventoForm
        v-if="showEventoForm"
        :evento="eventoAEditar"
        @submit="handleGuardarEvento"
        @cancel="cerrarEventoForm"
      />
      
      <RelacionForm
        v-if="showRelacionForm"
        :personas="personas"
        @submit="handleCrearRelacion"
        @cancel="showRelacionForm = false"
      />
    </template>
  </div>
</template>

<style scoped>
.persona-page { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 28px; font-size: 0.88rem; }
.breadcrumb a { color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
.breadcrumb a:hover { color: #8b5cf6; }
.sep { color: rgba(255,255,255,0.2); }
.current { color: rgba(255,255,255,0.7); }
.tabs { display: flex; gap: 4px; margin-bottom: 24px; padding: 4px;
  background: rgba(255,255,255,0.04); border-radius: 14px; border: 1px solid rgba(255,255,255,0.06); }
.tab { flex: 1; padding: 12px 16px; background: transparent; border: none; border-radius: 11px;
  color: rgba(255,255,255,0.5); font-family: 'Inter', sans-serif; font-weight: 500;
  font-size: 0.88rem; cursor: pointer; transition: all 0.25s; }
.tab:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.04); }
.tab.active { color: #fff; background: rgba(139,92,246,0.2); box-shadow: 0 0 12px rgba(139,92,246,0.15); }
.tab-content { animation: fadeIn 0.3s ease; }
.timeline-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.timeline-header h3 { color: #fff; font-size: 1.1rem; margin: 0; }
.eventos-grid { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
.page-actions { display: flex; gap: 12px; margin-top: 32px; padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.06); }
.btn-add-event { padding: 12px 20px; background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.3);
  border-radius: 12px; color: #a78bfa; cursor: pointer; font-family: 'Inter', sans-serif;
  font-weight: 600; font-size: 0.88rem; transition: all 0.25s; }
.btn-add-event:hover { background: rgba(139,92,246,0.2); box-shadow: 0 0 16px rgba(139,92,246,0.2); }
.btn-add-relacion { padding: 12px 20px; background: rgba(6,182,212,0.12); border: 1px solid rgba(6,182,212,0.3);
  border-radius: 12px; color: #22d3ee; cursor: pointer; font-family: 'Inter', sans-serif;
  font-weight: 600; font-size: 0.88rem; transition: all 0.25s; }
.btn-add-relacion:hover { background: rgba(6,182,212,0.2); box-shadow: 0 0 16px rgba(6,182,212,0.2); }
.btn-delete { padding: 12px 20px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
  border-radius: 12px; color: #ef4444; cursor: pointer; font-family: 'Inter', sans-serif;
  font-weight: 600; font-size: 0.88rem; transition: all 0.25s; }
.btn-delete:hover { background: rgba(239,68,68,0.2); }
.relacion-error { margin-top: 16px; padding: 12px 16px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
  border-radius: 12px; color: #ef4444; font-size: 0.88rem; display: flex; justify-content: space-between; align-items: center; }
.close-err { background: none; border: none; color: #ef4444; font-weight: bold; cursor: pointer; font-size: 1rem; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000; }
.confirm-card { background: rgba(255,255,255,0.07); backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 32px; max-width: 420px; text-align: center; }
.confirm-card h3 { margin: 0 0 12px 0; color: #fff; }
.confirm-card p { color: rgba(255,255,255,0.6); font-size: 0.92rem; margin-bottom: 8px; }
.warn-text { color: #ef4444; font-size: 0.82rem; }
.confirm-actions { display: flex; gap: 12px; margin-top: 24px; }
.btn-cancel { flex: 1; padding: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px; color: rgba(255,255,255,0.7); cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 500; }
.btn-confirm-delete { flex: 1; padding: 12px; background: #ef4444; border: none;
  border-radius: 12px; color: #fff; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600; transition: all 0.2s; }
.btn-confirm-delete:hover { background: #dc2626; }
.loading-state { text-align: center; padding: 80px; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #8b5cf6;
  border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-state p { color: rgba(255,255,255,0.4); }
.error-msg { padding: 14px 18px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
  border-radius: 12px; color: #ef4444; font-size: 0.9rem; }
.empty-msg { color: rgba(255,255,255,0.4); text-align: center; padding: 40px; }
</style>
