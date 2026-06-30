import { computed } from 'vue'
import { usePersonasStore } from '@/stores/personas.store'
import { storeToRefs } from 'pinia'
import type { CrearPersonaPayload, RelacionPayload } from '@/types/arbol.types'

export function usePersonas() {
  const store = usePersonasStore()
  const { personas, personaActual, familia, loading, error, searchQuery, personasFiltradas, totalPersonas } = storeToRefs(store)

  const personasVivas = computed(() => personas.value.filter(p => p.estaViva))
  const personasFallecidas = computed(() => personas.value.filter(p => !p.estaViva))

  return {
    personas, personaActual, familia, loading, error, searchQuery,
    personasFiltradas, totalPersonas, personasVivas, personasFallecidas,
    cargarPersonas: () => store.fetchPersonas(),
    cargarPersona: (id: string) => store.fetchPersona(id),
    crearPersona: (payload: CrearPersonaPayload) => store.crearPersona(payload),
    eliminarPersona: (id: string) => store.eliminarPersona(id),
    buscarPersonas: (query: string) => store.buscarPersonas(query),
    cargarFamilia: (personaId: string) => store.fetchFamilia(personaId),
    crearRelacion: (payload: RelacionPayload) => store.crearRelacion(payload),
    eliminarRelacion: (id: string) => store.eliminarRelacion(id)
  }
}
