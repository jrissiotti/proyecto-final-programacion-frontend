<script setup lang="ts">
import type { EventoDTO } from '@/types/arbol.types'
import { formatearFecha, obtenerIconoEvento, obtenerColorEvento } from '@/utils/formateadores'

defineProps<{ evento: EventoDTO }>()
const emit = defineEmits<{ eliminar: [eventoId: string]; editar: [evento: EventoDTO] }>()
</script>

<template>
  <div class="evento-card" :style="{ '--accent': obtenerColorEvento(evento.tipo) }">
    <div class="card-accent"></div>
    <div class="card-body">
      <div class="card-header">
        <span class="tipo-badge">
          <span class="icon">{{ obtenerIconoEvento(evento.tipo) }}</span>
          {{ evento.tipo }}
        </span>
        <div class="action-buttons">
          <button class="edit-btn" @click.stop="emit('editar', evento)" title="Editar evento">✏️</button>
          <button class="delete-btn" @click.stop="emit('eliminar', evento.id)" title="Eliminar evento">🗑️</button>
        </div>
      </div>
      <p class="descripcion">{{ evento.descripcion }}</p>
      <div class="card-footer">
        <span class="fecha">📅 {{ formatearFecha(evento.fecha) }}</span>
        <span class="ubicacion" v-if="evento.ubicacion?.nombre">📍 {{ evento.ubicacion.nombre }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.evento-card { display: flex; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px; overflow: hidden; transition: all 0.3s ease; }
.evento-card:hover { transform: translateY(-2px); background: rgba(255,255,255,0.07);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2); border-color: var(--accent, rgba(255,255,255,0.15)); }
.card-accent { width: 4px; background: var(--accent, #8b5cf6); flex-shrink: 0; }
.card-body { padding: 16px 18px; flex: 1; min-width: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.tipo-badge { display: flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px;
  background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); font-size: 0.82rem; font-weight: 600; }
.icon { font-size: 1rem; }
.action-buttons { display: flex; gap: 8px; }
.edit-btn, .delete-btn { background: none; border: none; cursor: pointer; font-size: 0.9rem; opacity: 0.4; transition: opacity 0.2s, transform 0.2s; padding: 4px; }
.edit-btn:hover, .delete-btn:hover { opacity: 1; transform: scale(1.1); }
.descripcion { color: rgba(255,255,255,0.75); font-size: 0.9rem; margin: 0 0 12px 0; line-height: 1.5; }
.card-footer { display: flex; gap: 16px; font-size: 0.8rem; color: rgba(255,255,255,0.4); }
</style>
