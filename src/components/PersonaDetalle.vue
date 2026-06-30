<script setup lang="ts">
import type { PersonaDTO, FamiliaDTO } from '@/types/arbol.types'
import { formatearFecha, formatearEdad, formatearGenero, obtenerIconoEvento, obtenerColorEvento } from '@/utils/formateadores'

defineProps<{ persona: PersonaDTO; familia: FamiliaDTO | null }>()
const emit = defineEmits<{ 'agregar-evento': []; eliminar: []; 'eliminar-relacion': [relacionId: string] }>()
</script>

<template>
  <div class="detalle-container">
    <div class="header-section">
      <div class="avatar-large" :class="persona.genero === 'M' ? 'male' : 'female'">
        {{ persona.genero === 'M' ? '👨' : '👩' }}
      </div>
      <div class="header-info">
        <h1>{{ persona.nombre }} {{ persona.apellido }}</h1>
        <div class="header-meta">
          <span class="badge-genero">{{ formatearGenero(persona.genero) }}</span>
          <span class="badge-edad">{{ formatearEdad(persona.edad) }}</span>
          <span class="badge-status" :class="persona.estaViva ? 'alive' : 'deceased'">
            {{ persona.estaViva ? '● Viva' : '● Fallecida' }}
          </span>
        </div>
        <div class="dates">
          <span v-if="persona.fechaNacimiento">🎂 {{ formatearFecha(persona.fechaNacimiento) }}</span>
          <span v-if="persona.fechaDefuncion">⚰️ {{ formatearFecha(persona.fechaDefuncion) }}</span>
        </div>
      </div>
    </div>

    <div class="familia-section" v-if="familia">
      <div class="familia-group" v-if="familia.padres.length">
        <h3>👨‍👩‍👧 Padres</h3>
        <div class="familia-cards">
          <div v-for="p in familia.padres" :key="p.id" class="mini-card-wrapper">
            <RouterLink :to="`/personas/${p.id}`" class="mini-card">
              <span class="mini-avatar">{{ p.genero === 'M' ? '👨' : '👩' }}</span>
              <span>{{ p.nombre }} {{ p.apellido }}</span>
            </RouterLink>
            <button v-if="p.relacionId" class="btn-unlink" @click.prevent.stop="emit('eliminar-relacion', p.relacionId)" title="Eliminar relación">✕</button>
          </div>
        </div>
      </div>
      <div class="familia-group" v-if="familia.conyuges.length">
        <h3>💍 Cónyuges</h3>
        <div class="familia-cards">
          <div v-for="c in familia.conyuges" :key="c.id" class="mini-card-wrapper">
            <RouterLink :to="`/personas/${c.id}`" class="mini-card">
              <span class="mini-avatar">{{ c.genero === 'M' ? '👨' : '👩' }}</span>
              <span>{{ c.nombre }} {{ c.apellido }}</span>
            </RouterLink>
            <button v-if="c.relacionId" class="btn-unlink" @click.prevent.stop="emit('eliminar-relacion', c.relacionId)" title="Eliminar relación">✕</button>
          </div>
        </div>
      </div>
      <div class="familia-group" v-if="familia.hijos.length">
        <h3>👶 Hijos</h3>
        <div class="familia-cards">
          <div v-for="h in familia.hijos" :key="h.id" class="mini-card-wrapper">
            <RouterLink :to="`/personas/${h.id}`" class="mini-card">
              <span class="mini-avatar">{{ h.genero === 'M' ? '👨' : '👩' }}</span>
              <span>{{ h.nombre }} {{ h.apellido }}</span>
            </RouterLink>
            <button v-if="h.relacionId" class="btn-unlink" @click.prevent.stop="emit('eliminar-relacion', h.relacionId)" title="Eliminar relación">✕</button>
          </div>
        </div>
      </div>
      <p v-if="!familia.padres.length && !familia.conyuges.length && !familia.hijos.length" class="empty-text">
        No hay relaciones familiares registradas.
      </p>
    </div>

    <div class="eventos-section" v-if="persona.eventos && persona.eventos.length">
      <h3>📋 Eventos</h3>
      <div class="eventos-list">
        <div v-for="e in persona.eventos" :key="e.id" class="evento-mini" :style="{ borderLeftColor: obtenerColorEvento(e.tipo) }">
          <span class="evento-icon">{{ obtenerIconoEvento(e.tipo) }}</span>
          <div>
            <strong>{{ e.tipo }}</strong>
            <span class="evento-fecha">{{ formatearFecha(e.fecha) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detalle-container { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.header-section { display: flex; gap: 24px; align-items: center; margin-bottom: 32px;
  padding: 28px; background: rgba(255,255,255,0.05); backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; }
.avatar-large { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.4rem; flex-shrink: 0; }
.avatar-large.male { background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2)); border: 3px solid rgba(59,130,246,0.3); }
.avatar-large.female { background: linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2)); border: 3px solid rgba(236,72,153,0.3); }
.header-info h1 { margin: 0 0 8px 0; font-size: 1.6rem; font-weight: 700; color: #fff; }
.header-meta { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.badge-genero, .badge-edad, .badge-status { padding: 4px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 500; }
.badge-genero { background: rgba(139,92,246,0.15); color: #a78bfa; }
.badge-edad { background: rgba(6,182,212,0.15); color: #22d3ee; }
.badge-status.alive { color: #10b981; }
.badge-status.deceased { color: #6b7280; }
.dates { font-size: 0.85rem; color: rgba(255,255,255,0.5); display: flex; gap: 16px; }
.familia-section, .eventos-section { margin-bottom: 24px; padding: 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
.familia-section h3, .eventos-section h3 { margin: 0 0 16px 0; font-size: 1.1rem; color: rgba(255,255,255,0.9); }
.familia-group { margin-bottom: 16px; }
.familia-group h3 { font-size: 0.95rem; margin-bottom: 10px; }
.familia-cards { display: flex; gap: 10px; flex-wrap: wrap; }
.mini-card-wrapper { display: flex; align-items: center; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; transition: all 0.2s; }
.mini-card-wrapper:hover { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.3); }
.mini-card { display: flex; align-items: center; gap: 8px; padding: 10px 12px 10px 16px;
  text-decoration: none; color: #fff; font-size: 0.88rem; transition: all 0.2s; border-radius: 12px 0 0 12px; }
.btn-unlink { background: none; border: none; color: rgba(255, 255, 255, 0.4); font-size: 0.85rem; padding: 10px 14px; cursor: pointer; transition: color 0.2s, transform 0.2s; border-radius: 0 12px 12px 0; border-left: 1px solid rgba(255, 255, 255, 0.08); height: 100%; display: flex; align-items: center; justify-content: center; }
.btn-unlink:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
.mini-avatar { font-size: 1.2rem; }
.eventos-list { display: flex; flex-direction: column; gap: 8px; }
.evento-mini { display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  background: rgba(255,255,255,0.04); border-radius: 10px; border-left: 3px solid; }
.evento-icon { font-size: 1.3rem; }
.evento-mini strong { color: #fff; font-size: 0.88rem; }
.evento-fecha { display: block; color: rgba(255,255,255,0.45); font-size: 0.78rem; }
.empty-text { color: rgba(255,255,255,0.4); font-style: italic; font-size: 0.9rem; }
</style>
