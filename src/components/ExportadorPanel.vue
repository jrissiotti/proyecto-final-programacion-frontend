<script setup lang="ts">
import { ref } from 'vue'
import { useEventos } from '@/composables/useEventos'
import { usePersonas } from '@/composables/usePersonas'

const { exportar, exportarGEDCOM, validarCronologia, loading } = useEventos()
const { personas } = usePersonas()

const personaId = ref('')
const validacionResult = ref<any>(null)
const showValidacion = ref(false)

async function handleExportar(formato: 'json' | 'csv') {
  await exportar(formato, personaId.value || undefined)
}

async function handleValidar() {
  try {
    validacionResult.value = await validarCronologia()
    showValidacion.value = true
  } catch {
    validacionResult.value = { error: true }
    showValidacion.value = true
  }
}
</script>

<template>
  <div class="export-panel">
    <h3>📦 Exportar y Herramientas</h3>

    <div class="filter-section">
      <label for="ep-filter">Filtrar por persona (opcional)</label>
      <select id="ep-filter" v-model="personaId">
        <option value="">Todas las personas</option>
        <option v-for="p in personas" :key="p.id" :value="p.id">{{ p.nombre }} {{ p.apellido }}</option>
      </select>
    </div>

    <div class="export-buttons">
      <button class="export-btn json" @click="handleExportar('json')">
        <span class="btn-icon">{ }</span>
        <span>JSON</span>
      </button>
      <button class="export-btn csv" @click="handleExportar('csv')">
        <span class="btn-icon">📊</span>
        <span>CSV</span>
      </button>
      <button class="export-btn gedcom" @click="exportarGEDCOM()">
        <span class="btn-icon">🌳</span>
        <span>GEDCOM</span>
      </button>
    </div>

    <div class="validacion-section">
      <button class="validate-btn" @click="handleValidar" :disabled="loading">
        {{ loading ? 'Validando...' : '🔍 Validar Cronología' }}
      </button>
      <div v-if="showValidacion && validacionResult" class="validacion-result"
        :class="validacionResult.error ? 'error' : 'success'">
        <template v-if="validacionResult.error">
          <p>❌ Error en la validación</p>
        </template>
        <template v-else>
          <p>✅ Validación completada</p>
          <pre>{{ JSON.stringify(validacionResult, null, 2) }}</pre>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.export-panel { padding: 24px; background: rgba(255,255,255,0.04); backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
.export-panel h3 { margin: 0 0 20px 0; color: #fff; font-size: 1.1rem; }
.filter-section { margin-bottom: 20px; }
.filter-section label { display: block; color: rgba(255,255,255,0.6); font-size: 0.82rem; margin-bottom: 8px; }
.filter-section select { width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; color: #fff;
  font-family: 'Inter', sans-serif; font-size: 0.9rem; outline: none; }
.filter-section select option { background: #1a1040; }
.export-buttons { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.export-btn { flex: 1; min-width: 90px; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 16px 12px;
  border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; cursor: pointer;
  font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.85rem; transition: all 0.25s; color: #fff; }
.export-btn.json { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.3); }
.export-btn.json:hover { background: rgba(245,158,11,0.2); box-shadow: 0 0 16px rgba(245,158,11,0.2); }
.export-btn.csv { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); }
.export-btn.csv:hover { background: rgba(16,185,129,0.2); box-shadow: 0 0 16px rgba(16,185,129,0.2); }
.export-btn.gedcom { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.3); }
.export-btn.gedcom:hover { background: rgba(139,92,246,0.2); box-shadow: 0 0 16px rgba(139,92,246,0.2); }
.btn-icon { font-size: 1.4rem; }
.validate-btn { width: 100%; padding: 14px; background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3);
  border-radius: 12px; color: #22d3ee; cursor: pointer; font-family: 'Inter', sans-serif;
  font-weight: 600; font-size: 0.95rem; transition: all 0.25s; }
.validate-btn:hover { background: rgba(6,182,212,0.2); box-shadow: 0 0 16px rgba(6,182,212,0.2); }
.validate-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.validacion-result { margin-top: 16px; padding: 16px; border-radius: 12px; font-size: 0.85rem; }
.validacion-result.success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10b981; }
.validacion-result.error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; }
.validacion-result p { margin: 0 0 8px 0; font-weight: 600; }
.validacion-result pre { margin: 0; font-size: 0.78rem; color: rgba(255,255,255,0.5); overflow-x: auto; white-space: pre-wrap; }
</style>
