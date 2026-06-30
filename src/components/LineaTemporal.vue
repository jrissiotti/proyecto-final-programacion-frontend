<script setup lang="ts">
import { computed } from 'vue'
import type { EventoDTO } from '@/types/arbol.types'
import { formatearFecha, obtenerIconoEvento, obtenerColorEvento } from '@/utils/formateadores'

const props = defineProps<{ eventos: EventoDTO[] }>()

const eventosOrdenados = computed(() =>
  [...props.eventos].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
)
</script>

<template>
  <div class="timeline-container">
    <div class="timeline-line"></div>
    <div v-for="(evento, i) in eventosOrdenados" :key="evento.id"
      :class="['timeline-item', i % 2 === 0 ? 'left' : 'right']"
      :style="{ animationDelay: `${i * 0.1}s` }">
      <div class="timeline-dot" :style="{ background: obtenerColorEvento(evento.tipo), boxShadow: `0 0 12px ${obtenerColorEvento(evento.tipo)}40` }"></div>
      <div class="timeline-card" :style="{ '--accent': obtenerColorEvento(evento.tipo) }">
        <div class="card-tipo">
          <span>{{ obtenerIconoEvento(evento.tipo) }}</span>
          <span class="tipo-text">{{ evento.tipo }}</span>
        </div>
        <p class="card-desc">{{ evento.descripcion }}</p>
        <div class="card-meta">
          <span>📅 {{ formatearFecha(evento.fecha) }}</span>
          <span v-if="evento.ubicacion?.nombre">📍 {{ evento.ubicacion.nombre }}</span>
        </div>
      </div>
    </div>
    <p v-if="!eventos.length" class="empty">No hay eventos registrados.</p>
  </div>
</template>

<style scoped>
.timeline-container { position: relative; padding: 20px 0; }
.timeline-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px;
  background: linear-gradient(to bottom, rgba(139,92,246,0.3), rgba(6,182,212,0.3)); transform: translateX(-50%); }
.timeline-item { display: flex; align-items: flex-start; position: relative; margin-bottom: 32px;
  animation: fadeSlide 0.5s ease both; width: 100%; }
@keyframes fadeSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.timeline-item.left { justify-content: flex-start; padding-right: calc(50% + 24px); }
.timeline-item.right { justify-content: flex-end; padding-left: calc(50% + 24px); }
.timeline-dot { position: absolute; left: 50%; transform: translateX(-50%); top: 20px;
  width: 14px; height: 14px; border-radius: 50%; z-index: 2; border: 3px solid #0a0a1a; }
.timeline-card { padding: 18px; background: rgba(255,255,255,0.05); backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; max-width: 100%;
  transition: all 0.3s; border-left: 3px solid var(--accent, #8b5cf6); }
.timeline-card:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
.card-tipo { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-weight: 600; color: #fff; }
.tipo-text { font-size: 0.9rem; }
.card-desc { color: rgba(255,255,255,0.65); font-size: 0.85rem; margin: 0 0 10px 0; line-height: 1.5; }
.card-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 0.78rem; color: rgba(255,255,255,0.4); }
.empty { text-align: center; color: rgba(255,255,255,0.4); font-style: italic; padding: 40px; }

@media (max-width: 768px) {
  .timeline-line { left: 20px; }
  .timeline-item.left, .timeline-item.right { padding-left: 48px; padding-right: 0; justify-content: flex-start; }
  .timeline-dot { left: 20px; }
}
</style>
