<script setup lang="ts">
import { ref } from 'vue'
import type { CrearPersonaPayload, Genero } from '@/types/arbol.types'
import { validarNombre, validarApellido } from '@/utils/validadores'

const emit = defineEmits<{
  submit: [payload: CrearPersonaPayload]
  cancel: []
}>()

const nombre = ref('')
const apellido = ref('')
const genero = ref<Genero>('M')
const errores = ref<{ nombre: string | null; apellido: string | null }>({ nombre: null, apellido: null })

function handleSubmit() {
  errores.value.nombre = validarNombre(nombre.value)
  errores.value.apellido = validarApellido(apellido.value)
  if (errores.value.nombre || errores.value.apellido) return
  emit('submit', { nombre: nombre.value.trim(), apellido: apellido.value.trim(), genero: genero.value })
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('cancel')">
    <div class="form-card">
      <div class="form-header">
        <h2>👤 Nueva Persona</h2>
        <button class="close-btn" @click="emit('cancel')">✕</button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label for="pf-nombre">Nombre</label>
          <input id="pf-nombre" v-model="nombre" type="text" placeholder="Ingresa el nombre" autocomplete="off" />
          <span v-if="errores.nombre" class="error">{{ errores.nombre }}</span>
        </div>
        <div class="field">
          <label for="pf-apellido">Apellido</label>
          <input id="pf-apellido" v-model="apellido" type="text" placeholder="Ingresa el apellido" autocomplete="off" />
          <span v-if="errores.apellido" class="error">{{ errores.apellido }}</span>
        </div>
        <div class="field">
          <label>Género</label>
          <div class="genero-toggle">
            <button type="button" :class="['genero-btn', { active: genero === 'M' }]" @click="genero = 'M'">
              <span class="genero-icon">👨</span>
              <span>Masculino</span>
            </button>
            <button type="button" :class="['genero-btn', { active: genero === 'F' }]" @click="genero = 'F'">
              <span class="genero-icon">👩</span>
              <span>Femenino</span>
            </button>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="emit('cancel')">Cancelar</button>
          <button type="submit" class="btn-submit">Crear Persona</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.form-card {
  background: rgba(255,255,255,0.07); backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.12); border-radius: 20px;
  padding: 32px; width: 100%; max-width: 440px;
  animation: slideUp 0.3s ease;
}
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.form-header h2 { font-size: 1.4rem; font-weight: 700; color: #fff; margin: 0; }
.close-btn { background: none; border: none; color: rgba(255,255,255,0.5); font-size: 1.2rem; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: all 0.2s; }
.close-btn:hover { color: #fff; background: rgba(255,255,255,0.1); }
.field { margin-bottom: 20px; }
.field label { display: block; color: rgba(255,255,255,0.7); font-size: 0.85rem; font-weight: 500; margin-bottom: 8px; }
.field input { width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px; color: #fff; font-size: 0.95rem; font-family: 'Inter', sans-serif;
  transition: border-color 0.2s, box-shadow 0.2s; outline: none; box-sizing: border-box; }
.field input:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,0.2); }
.field input::placeholder { color: rgba(255,255,255,0.3); }
.error { color: #ef4444; font-size: 0.8rem; margin-top: 6px; display: block; }
.genero-toggle { display: flex; gap: 12px; }
.genero-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 16px 12px;
  background: rgba(255,255,255,0.04); border: 2px solid rgba(255,255,255,0.1); border-radius: 14px;
  color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.25s; font-family: 'Inter', sans-serif; font-size: 0.85rem; }
.genero-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
.genero-btn.active { background: rgba(139,92,246,0.15); border-color: #8b5cf6; color: #fff; box-shadow: 0 0 16px rgba(139,92,246,0.2); }
.genero-icon { font-size: 1.8rem; }
.form-actions { display: flex; gap: 12px; margin-top: 28px; }
.btn-cancel { flex: 1; padding: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px; color: rgba(255,255,255,0.7); cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 500; transition: all 0.2s; }
.btn-cancel:hover { background: rgba(255,255,255,0.1); }
.btn-submit { flex: 1; padding: 12px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); border: none;
  border-radius: 12px; color: #fff; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.95rem;
  transition: all 0.2s; box-shadow: 0 4px 16px rgba(139,92,246,0.3); }
.btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(139,92,246,0.4); }
</style>
