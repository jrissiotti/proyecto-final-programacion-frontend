<script setup lang="ts">
import type { FamiliaDTO } from '@/types/arbol.types'

defineProps<{ familia: FamiliaDTO }>()
</script>

<template>
  <div class="arbol-container">
    <!-- Padres Row -->
    <div class="tree-row padres-row" v-if="familia.padres.length">
      <RouterLink v-for="p in familia.padres" :key="p.id" :to="`/personas/${p.id}`" class="tree-node parent-node">
        <div class="node-avatar" :class="p.genero === 'M' ? 'male' : 'female'">{{ p.genero === 'M' ? '👨' : '👩' }}</div>
        <span class="node-name">{{ p.nombre }}</span>
        <span class="node-apellido">{{ p.apellido }}</span>
      </RouterLink>
    </div>

    <!-- Connection lines padres -> persona -->
    <div class="connector-down" v-if="familia.padres.length">
      <div class="v-line"></div>
    </div>

    <!-- Central Row: Persona + Cónyuges -->
    <div class="tree-row central-row">
      <div class="central-group">
        <div class="tree-node persona-node highlight">
          <div class="node-avatar" :class="familia.persona.genero === 'M' ? 'male' : 'female'">
            {{ familia.persona.genero === 'M' ? '👨' : '👩' }}
          </div>
          <span class="node-name">{{ familia.persona.nombre }}</span>
          <span class="node-apellido">{{ familia.persona.apellido }}</span>
          <span class="node-badge">Principal</span>
        </div>

        <template v-if="familia.conyuges.length">
          <div class="h-connector" v-for="c in familia.conyuges" :key="c.id">
            <div class="h-line"></div>
            <span class="h-label">💍</span>
            <div class="h-line"></div>
            <RouterLink :to="`/personas/${c.id}`" class="tree-node conyuge-node">
              <div class="node-avatar" :class="c.genero === 'M' ? 'male' : 'female'">{{ c.genero === 'M' ? '👨' : '👩' }}</div>
              <span class="node-name">{{ c.nombre }}</span>
              <span class="node-apellido">{{ c.apellido }}</span>
            </RouterLink>
          </div>
        </template>
      </div>
    </div>

    <!-- Connection lines persona -> hijos -->
    <div class="connector-down" v-if="familia.hijos.length">
      <div class="v-line"></div>
    </div>

    <!-- Hijos Row -->
    <div class="tree-row hijos-row" v-if="familia.hijos.length">
      <RouterLink v-for="h in familia.hijos" :key="h.id" :to="`/personas/${h.id}`" class="tree-node child-node">
        <div class="node-avatar" :class="h.genero === 'M' ? 'male' : 'female'">{{ h.genero === 'M' ? '👨' : '👩' }}</div>
        <span class="node-name">{{ h.nombre }}</span>
        <span class="node-apellido">{{ h.apellido }}</span>
      </RouterLink>
    </div>

    <p v-if="!familia.padres.length && !familia.conyuges.length && !familia.hijos.length" class="empty-tree">
      🌳 No hay relaciones familiares registradas aún.
    </p>
  </div>
</template>

<style scoped>
.arbol-container { display: flex; flex-direction: column; align-items: center; gap: 0; padding: 32px 16px;
  animation: fadeIn 0.5s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.tree-row { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; }
.connector-down { display: flex; justify-content: center; padding: 0; }
.v-line { width: 2px; height: 32px; background: linear-gradient(to bottom, rgba(139,92,246,0.5), rgba(6,182,212,0.5)); }
.central-row { display: flex; justify-content: center; }
.central-group { display: flex; align-items: center; gap: 0; flex-wrap: wrap; justify-content: center; }
.h-connector { display: flex; align-items: center; gap: 0; }
.h-line { width: 24px; height: 2px; background: linear-gradient(to right, rgba(139,92,246,0.5), rgba(6,182,212,0.5)); }
.h-label { font-size: 1.2rem; margin: 0 4px; }
.tree-node { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 18px 20px;
  background: rgba(255,255,255,0.05); backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
  text-decoration: none; color: #fff; transition: all 0.3s; min-width: 100px; cursor: pointer; }
.tree-node:hover { transform: translateY(-3px); border-color: rgba(139,92,246,0.4);
  box-shadow: 0 8px 24px rgba(139,92,246,0.15); background: rgba(255,255,255,0.08); }
.persona-node.highlight { border: 2px solid rgba(139,92,246,0.5); background: rgba(139,92,246,0.1);
  box-shadow: 0 0 24px rgba(139,92,246,0.15); cursor: default; }
.persona-node.highlight:hover { transform: none; }
.node-avatar { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.node-avatar.male { background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2)); border: 2px solid rgba(59,130,246,0.3); }
.node-avatar.female { background: linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2)); border: 2px solid rgba(236,72,153,0.3); }
.node-name { font-weight: 600; font-size: 0.88rem; }
.node-apellido { font-size: 0.78rem; color: rgba(255,255,255,0.5); }
.node-badge { font-size: 0.65rem; padding: 2px 10px; background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  border-radius: 10px; font-weight: 600; margin-top: 4px; }
.empty-tree { color: rgba(255,255,255,0.4); text-align: center; font-size: 1rem; padding: 40px; }
</style>
