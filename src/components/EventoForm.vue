<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { EventoDTO, CrearEventoPayload, TipoEvento } from '@/types/arbol.types'
import { validarFecha, validarDescripcion, validarUbicacion } from '@/utils/validadores'

const props = defineProps<{ evento?: EventoDTO }>()
const emit = defineEmits<{ submit: [payload: CrearEventoPayload]; cancel: [] }>()

const tipo = ref<TipoEvento>('Nacimiento')
const fecha = ref('')
const descripcion = ref('')
const ubicacion = ref('')
const errores = ref<{ fecha: string|null; descripcion: string|null; ubicacion: string|null }>({ fecha: null, descripcion: null, ubicacion: null })

const tiposEvento: { value: TipoEvento; label: string; icon: string }[] = [
  { value: 'Nacimiento', label: 'Nacimiento', icon: '👶' },
  { value: 'Matrimonio', label: 'Matrimonio', icon: '💒' },
  { value: 'Defuncion', label: 'Defunción', icon: '⚰️' },
  { value: 'Migracion', label: 'Migración', icon: '✈️' }
]

onMounted(() => {
  if (props.evento) {
    tipo.value = props.evento.tipo
    // El input tipo date requiere formato YYYY-MM-DD
    fecha.value = props.evento.fecha ? props.evento.fecha.substring(0, 10) : ''
    descripcion.value = props.evento.descripcion || ''
    ubicacion.value = props.evento.ubicacion?.nombre || ''
  }
})

function handleSubmit() {
  errores.value.fecha = validarFecha(fecha.value)
  errores.value.descripcion = validarDescripcion(descripcion.value)
  errores.value.ubicacion = validarUbicacion(ubicacion.value)
  if (errores.value.fecha || errores.value.descripcion || errores.value.ubicacion) return
  emit('submit', { tipo: tipo.value, fecha: fecha.value, descripcion: descripcion.value.trim(), ubicacion: { nombre: ubicacion.value.trim() } })
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('cancel')">
    <div class="form-card">
      <div class="form-header">
        <h2>{{ evento ? '✏️ Editar Evento' : '📅 Nuevo Evento' }}</h2>
        <button class="close-btn" @click="emit('cancel')">✕</button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label>Tipo de Evento</label>
          <div class="tipo-grid">
            <button v-for="t in tiposEvento" :key="t.value" type="button"
              :class="['tipo-btn', { active: tipo === t.value }]" @click="tipo = t.value">
               <span class="tipo-icon">{{ t.icon }}</span>
               <span class="tipo-label">{{ t.label }}</span>
            </button>
          </div>
        </div>
        <div class="field">
          <label for="ef-fecha">Fecha</label>
          <input id="ef-fecha" v-model="fecha" type="date" />
          <span v-if="errores.fecha" class="error">{{ errores.fecha }}</span>
        </div>
        <div class="field">
          <label for="ef-desc">Descripción</label>
          <textarea id="ef-desc" v-model="descripcion" rows="3" placeholder="Describe el evento..."></textarea>
          <span v-if="errores.descripcion" class="error">{{ errores.descripcion }}</span>
        </div>
        <div class="field">
          <label for="ef-ubi">Ubicación</label>
          <input id="ef-ubi" v-model="ubicacion" type="text" placeholder="Ciudad o lugar" autocomplete="off" />
          <span v-if="errores.ubicacion" class="error">{{ errores.ubicacion }}</span>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="emit('cancel')">Cancelar</button>
          <button type="submit" class="btn-submit">{{ evento ? 'Guardar Cambios' : 'Crear Evento' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.form-card { background: rgba(255,255,255,0.07); backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 32px; width: 100%; max-width: 480px;
  animation: slideUp 0.3s ease; max-height: 90vh; overflow-y: auto; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.form-header h2 { font-size: 1.4rem; font-weight: 700; color: #fff; margin: 0; }
.close-btn { background: none; border: none; color: rgba(255,255,255,0.5); font-size: 1.2rem; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: all 0.2s; }
.close-btn:hover { color: #fff; background: rgba(255,255,255,0.1); }
.field { margin-bottom: 18px; }
.field label { display: block; color: rgba(255,255,255,0.7); font-size: 0.85rem; font-weight: 500; margin-bottom: 8px; }
.tipo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.tipo-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 8px;
  background: rgba(255,255,255,0.04); border: 2px solid rgba(255,255,255,0.1); border-radius: 12px;
  color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.25s; font-family: 'Inter', sans-serif; }
.tipo-btn:hover { background: rgba(255,255,255,0.08); }
.tipo-btn.active { background: rgba(139,92,246,0.15); border-color: #8b5cf6; color: #fff; }
.tipo-icon { font-size: 1.5rem; }
.tipo-label { font-size: 0.8rem; font-weight: 500; }
.field input, .field textarea { width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; color: #fff; font-size: 0.95rem;
  font-family: 'Inter', sans-serif; transition: border-color 0.2s, box-shadow 0.2s; outline: none; box-sizing: border-box; resize: vertical; }
.field input:focus, .field textarea:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,0.2); }
.field input::placeholder, .field textarea::placeholder { color: rgba(255,255,255,0.3); }
.error { color: #ef4444; font-size: 0.8rem; margin-top: 6px; display: block; }
.form-actions { display: flex; gap: 12px; margin-top: 24px; }
.btn-cancel { flex: 1; padding: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px; color: rgba(255,255,255,0.7); cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 500; transition: all 0.2s; }
.btn-cancel:hover { background: rgba(255,255,255,0.1); }
.btn-submit { flex: 1; padding: 12px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); border: none;
  border-radius: 12px; color: #fff; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600;
  transition: all 0.2s; box-shadow: 0 4px 16px rgba(139,92,246,0.3); }
.btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(139,92,246,0.4); }
</style>
