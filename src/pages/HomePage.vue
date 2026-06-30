<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePersonas } from '@/composables/usePersonas'
import { useEventos } from '@/composables/useEventos'
import { formatearTipoCambio, formatearTiempoRelativo } from '@/utils/formateadores'

const { personas, cargarPersonas, totalPersonas, personasVivas } = usePersonas()
const { historial, cargarHistorial, totalEventos, cargarEventos } = useEventos()

const animatedPersonas = ref(0)
const animatedEventos = ref(0)
const animatedVivas = ref(0)

function animateCounter(target: number, setter: (v: number) => void, duration = 1000) {
  const start = 0
  const startTime = performance.now()
  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    setter(Math.round(start + (target - start) * eased))
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

onMounted(async () => {
  await cargarPersonas()
  await cargarHistorial()

  // Load all events for all personas
  let eventCount = 0
  for (const p of personas.value) {
    eventCount += p.eventos?.length || 0
  }

  setTimeout(() => {
    animateCounter(totalPersonas.value, v => animatedPersonas.value = v)
    animateCounter(eventCount, v => animatedEventos.value = v)
    animateCounter(personasVivas.value.length, v => animatedVivas.value = v)
  }, 300)
})
</script>

<template>
  <div class="home-page">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>

    <section class="hero">
      <h1 class="hero-title">
        <span class="gradient-text">Sistema Genealógico</span>
        <span class="subtitle">de Eventos</span>
      </h1>
      <p class="hero-desc">Gestiona tu árbol genealógico familiar, registra eventos históricos y exporta datos en múltiples formatos.</p>
    </section>

    <section class="stats-row">
      <div class="stat-card">
        <span class="stat-icon">👥</span>
        <span class="stat-number">{{ animatedPersonas }}</span>
        <span class="stat-label">Personas</span>
      </div>
      <div class="stat-card">
        <span class="stat-icon">📅</span>
        <span class="stat-number">{{ animatedEventos }}</span>
        <span class="stat-label">Eventos</span>
      </div>
      <div class="stat-card">
        <span class="stat-icon">💚</span>
        <span class="stat-number">{{ animatedVivas }}</span>
        <span class="stat-label">Personas Vivas</span>
      </div>
    </section>

    <section class="quick-actions">
      <RouterLink to="/personas" class="action-btn primary">
        <span>➕</span> Nueva Persona
      </RouterLink>
      <RouterLink to="/personas" class="action-btn secondary">
        <span>🌳</span> Ver Árbol
      </RouterLink>
      <RouterLink to="/eventos" class="action-btn tertiary">
        <span>📦</span> Exportar Datos
      </RouterLink>
    </section>

    <section class="activity-section" v-if="historial.length">
      <h2>🕐 Actividad Reciente</h2>
      <div class="activity-list">
        <div v-for="(cambio, i) in historial.slice(0, 8)" :key="i" class="activity-item">
          <div class="activity-dot"></div>
          <div class="activity-info">
            <span class="activity-tipo">{{ formatearTipoCambio(cambio.tipo) }}</span>
            <span class="activity-time">{{ formatearTiempoRelativo(cambio.timestamp) }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page { position: relative; overflow: hidden; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; pointer-events: none; z-index: 0; }
.orb-1 { width: 400px; height: 400px; background: #8b5cf6; top: -100px; right: -100px; animation: float1 8s ease-in-out infinite; }
.orb-2 { width: 300px; height: 300px; background: #06b6d4; bottom: 100px; left: -100px; animation: float2 10s ease-in-out infinite; }
@keyframes float1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-40px, 40px); } }
@keyframes float2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -30px); } }
.hero { position: relative; z-index: 1; margin-bottom: 48px; animation: fadeUp 0.6s ease; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.hero-title { font-size: 2.8rem; font-weight: 800; line-height: 1.15; margin-bottom: 16px; }
.gradient-text { background: linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; display: block; }
.subtitle { color: rgba(255,255,255,0.6); font-weight: 300; font-size: 2rem; }
.hero-desc { color: rgba(255,255,255,0.45); font-size: 1.05rem; max-width: 520px; line-height: 1.6; }
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px;
  margin-bottom: 40px; position: relative; z-index: 1; animation: fadeUp 0.6s ease 0.15s both; }
.stat-card { padding: 28px 24px; background: rgba(255,255,255,0.05); backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; text-align: center;
  transition: all 0.3s; }
.stat-card:hover { transform: translateY(-4px); border-color: rgba(139,92,246,0.3);
  box-shadow: 0 8px 32px rgba(139,92,246,0.1); }
.stat-icon { font-size: 1.8rem; display: block; margin-bottom: 8px; }
.stat-number { font-size: 2.4rem; font-weight: 800; color: #fff; display: block; }
.stat-label { font-size: 0.82rem; color: rgba(255,255,255,0.4); font-weight: 500; }
.quick-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 48px;
  position: relative; z-index: 1; animation: fadeUp 0.6s ease 0.3s both; }
.action-btn { display: flex; align-items: center; gap: 10px; padding: 14px 24px;
  border-radius: 14px; text-decoration: none; font-weight: 600; font-size: 0.92rem;
  transition: all 0.25s; border: 1px solid; }
.action-btn.primary { background: rgba(139,92,246,0.12); border-color: rgba(139,92,246,0.3); color: #a78bfa; }
.action-btn.primary:hover { background: rgba(139,92,246,0.2); box-shadow: 0 0 20px rgba(139,92,246,0.2); }
.action-btn.secondary { background: rgba(6,182,212,0.12); border-color: rgba(6,182,212,0.3); color: #22d3ee; }
.action-btn.secondary:hover { background: rgba(6,182,212,0.2); box-shadow: 0 0 20px rgba(6,182,212,0.2); }
.action-btn.tertiary { background: rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.3); color: #34d399; }
.action-btn.tertiary:hover { background: rgba(16,185,129,0.2); box-shadow: 0 0 20px rgba(16,185,129,0.2); }
.activity-section { position: relative; z-index: 1; animation: fadeUp 0.6s ease 0.45s both; }
.activity-section h2 { font-size: 1.2rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 20px; }
.activity-list { display: flex; flex-direction: column; gap: 8px; }
.activity-item { display: flex; align-items: center; gap: 14px; padding: 14px 18px;
  background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);
  transition: background 0.2s; }
.activity-item:hover { background: rgba(255,255,255,0.06); }
.activity-dot { width: 8px; height: 8px; border-radius: 50%; background: #8b5cf6; flex-shrink: 0;
  box-shadow: 0 0 8px rgba(139,92,246,0.4); }
.activity-info { display: flex; justify-content: space-between; flex: 1; align-items: center; }
.activity-tipo { font-size: 0.88rem; color: rgba(255,255,255,0.75); }
.activity-time { font-size: 0.78rem; color: rgba(255,255,255,0.35); }
</style>
