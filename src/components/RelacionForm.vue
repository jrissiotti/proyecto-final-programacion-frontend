<script setup lang="ts">
import { ref } from 'vue'
import type { PersonaDTO, RelacionPayload } from '@/types/arbol.types'

const props = defineProps<{ personas: PersonaDTO[] }>()
const emit = defineEmits<{ submit: [payload: RelacionPayload]; cancel: [] }>()

const personaOrigenId = ref('')
const personaDestinoId = ref('')
const tipo = ref<string>('PADRE_DE')

const tiposRelacion = [
  { value: 'PADRE_DE', label: 'Padre de', icon: '👨' },
  { value: 'MADRE_DE', label: 'Madre de', icon: '👩' },
  { value: 'HIJO_DE', label: 'Hijo/a de', icon: '👶' },
  { value: 'CONYUGE_DE', label: 'Cónyuge de', icon: '💍' }
]

function handleSubmit() {
  if (!personaOrigenId.value || !personaDestinoId.value) return
  if (personaOrigenId.value === personaDestinoId.value) return

  let originId = personaOrigenId.value
  let destId = personaDestinoId.value
  let relTipo = tipo.value

  // Mapeo especial para "HIJO_DE"
  if (relTipo === 'HIJO_DE') {
    // Si A es HIJO_DE B, significa que B es el padre/madre de A.
    // Buscamos a B (el destino seleccionado en el formulario) para ver su género.
    const parent = props.personas.find(p => p.id === destId)
    const isFemale = parent?.genero === 'F'
    
    // Invertimos los roles: origen es el padre (B) y destino es el hijo (A).
    originId = destId
    destId = personaOrigenId.value
    relTipo = isFemale ? 'MADRE_DE' : 'PADRE_DE'
  }

  emit('submit', {
    personaOrigenId: originId,
    personaDestinoId: destId,
    tipo: relTipo as any
  })
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('cancel')">
    <div class="form-card">
      <div class="form-header">
        <h2>🔗 Nueva Relación</h2>
        <button class="close-btn" @click="emit('cancel')">✕</button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label for="rf-origen">Persona Origen</label>
          <select id="rf-origen" v-model="personaOrigenId">
            <option value="" disabled>Seleccionar persona...</option>
            <option v-for="p in personas" :key="p.id" :value="p.id">{{ p.nombre }} {{ p.apellido }}</option>
          </select>
        </div>
        <div class="field">
          <label>Tipo de Relación</label>
          <div class="tipo-grid">
            <button v-for="t in tiposRelacion" :key="t.value" type="button"
              :class="['tipo-btn', { active: tipo === t.value }]" @click="tipo = t.value">
              <span>{{ t.icon }}</span>
              <span>{{ t.label }}</span>
            </button>
          </div>
        </div>
        <div class="field">
          <label for="rf-destino">Persona Destino</label>
          <select id="rf-destino" v-model="personaDestinoId">
            <option value="" disabled>Seleccionar persona...</option>
            <option v-for="p in personas" :key="p.id" :value="p.id" :disabled="p.id === personaOrigenId">
              {{ p.nombre }} {{ p.apellido }}
            </option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="emit('cancel')">Cancelar</button>
          <button type="submit" class="btn-submit" :disabled="!personaOrigenId || !personaDestinoId">Crear Relación</button>
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
  border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 32px; width: 100%; max-width: 440px; }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.form-header h2 { font-size: 1.4rem; font-weight: 700; color: #fff; margin: 0; }
.close-btn { background: none; border: none; color: rgba(255,255,255,0.5); font-size: 1.2rem; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: all 0.2s; }
.close-btn:hover { color: #fff; background: rgba(255,255,255,0.1); }
.field { margin-bottom: 18px; }
.field label { display: block; color: rgba(255,255,255,0.7); font-size: 0.85rem; font-weight: 500; margin-bottom: 8px; }
.field select { width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; color: #fff;
  font-size: 0.95rem; font-family: 'Inter', sans-serif; outline: none; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 16px center; cursor: pointer; }
.field select:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,0.2); }
.field select option { background: #1a1040; color: #fff; }
.tipo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.tipo-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px;
  background: rgba(255,255,255,0.04); border: 2px solid rgba(255,255,255,0.1); border-radius: 12px;
  color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.25s; font-family: 'Inter', sans-serif; font-size: 0.8rem; }
.tipo-btn.active { background: rgba(139,92,246,0.15); border-color: #8b5cf6; color: #fff; }
.form-actions { display: flex; gap: 12px; margin-top: 24px; }
.btn-cancel { flex: 1; padding: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px; color: rgba(255,255,255,0.7); cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 500; transition: all 0.2s; }
.btn-cancel:hover { background: rgba(255,255,255,0.1); }
.btn-submit { flex: 1; padding: 12px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); border: none;
  border-radius: 12px; color: #fff; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600;
  transition: all 0.2s; box-shadow: 0 4px 16px rgba(139,92,246,0.3); }
.btn-submit:hover { transform: translateY(-1px); }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
</style>
