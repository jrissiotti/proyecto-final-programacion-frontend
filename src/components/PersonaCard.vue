<script setup lang="ts">
import type { PersonaDTO } from '@/types/arbol.types'
import { formatearEdad } from '@/utils/formateadores'

defineProps<{ persona: PersonaDTO }>()
</script>

<template>
  <RouterLink :to="`/personas/${persona.id}`" class="persona-card">
    <div class="avatar" :class="persona.genero === 'M' ? 'male' : 'female'">
      {{ persona.genero === 'M' ? '👨' : '👩' }}
    </div>
    <div class="info">
      <h3 class="name">{{ persona.nombre }} {{ persona.apellido }}</h3>
      <div class="meta">
        <span class="age">{{ formatearEdad(persona.edad) }}</span>
        <span class="status" :class="persona.estaViva ? 'alive' : 'deceased'">
          <span class="dot"></span>
          {{ persona.estaViva ? 'Viva' : 'Fallecida' }}
        </span>
      </div>
    </div>
    <div class="event-count" v-if="persona.eventos && persona.eventos.length">
      <span class="count">{{ persona.eventos.length }}</span>
      <span class="label">eventos</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.persona-card {
  display: flex; align-items: center; gap: 16px; padding: 20px;
  background: rgba(255,255,255,0.05); backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
  text-decoration: none; color: #fff; transition: all 0.3s ease; cursor: pointer;
}
.persona-card:hover {
  transform: translateY(-3px); border-color: rgba(139,92,246,0.4);
  box-shadow: 0 8px 32px rgba(139,92,246,0.15), 0 0 20px rgba(139,92,246,0.1);
  background: rgba(255,255,255,0.08);
}
.avatar {
  width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem; flex-shrink: 0;
}
.avatar.male { background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2)); border: 2px solid rgba(59,130,246,0.3); }
.avatar.female { background: linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2)); border: 2px solid rgba(236,72,153,0.3); }
.info { flex: 1; min-width: 0; }
.name { font-size: 1.05rem; font-weight: 600; margin: 0 0 6px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.meta { display: flex; align-items: center; gap: 12px; font-size: 0.82rem; color: rgba(255,255,255,0.5); }
.status { display: flex; align-items: center; gap: 5px; }
.dot { width: 7px; height: 7px; border-radius: 50%; }
.alive .dot { background: #10b981; box-shadow: 0 0 8px rgba(16,185,129,0.5); }
.deceased .dot { background: #6b7280; }
.event-count { text-align: center; padding: 8px 12px; background: rgba(139,92,246,0.1); border-radius: 12px; flex-shrink: 0; }
.event-count .count { display: block; font-size: 1.1rem; font-weight: 700; color: #8b5cf6; }
.event-count .label { font-size: 0.7rem; color: rgba(255,255,255,0.4); }
</style>
