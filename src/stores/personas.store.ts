import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PersonaDTO, FamiliaDTO, CrearPersonaPayload, RelacionPayload } from '@/types/arbol.types'
import { apiService } from '@/services/api.service'

export const usePersonasStore = defineStore('personas', () => {
  const personas = ref<PersonaDTO[]>([])
  const personaActual = ref<PersonaDTO | null>(null)
  const familia = ref<FamiliaDTO | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const personasFiltradas = computed(() => {
    if (!searchQuery.value) return personas.value
    const q = searchQuery.value.toLowerCase()
    return personas.value.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.apellido.toLowerCase().includes(q)
    )
  })

  const totalPersonas = computed(() => personas.value.length)

  async function fetchPersonas() {
    loading.value = true
    error.value = null
    try {
      personas.value = await apiService.getPersonas()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar personas'
    } finally {
      loading.value = false
    }
  }

  async function fetchPersona(id: string) {
    loading.value = true
    error.value = null
    try {
      personaActual.value = await apiService.getPersona(id)
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Persona no encontrada'
    } finally {
      loading.value = false
    }
  }

  async function crearPersona(payload: CrearPersonaPayload) {
    loading.value = true
    error.value = null
    try {
      const nueva = await apiService.crearPersona(payload)
      personas.value.push(nueva)
      return nueva
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al crear persona'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function eliminarPersona(id: string) {
    loading.value = true
    error.value = null
    try {
      await apiService.eliminarPersona(id)
      personas.value = personas.value.filter(p => p.id !== id)
      if (personaActual.value?.id === id) {
        personaActual.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al eliminar persona'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function buscarPersonas(query: string) {
    loading.value = true
    error.value = null
    try {
      personas.value = await apiService.buscarPersonas(query)
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error en la búsqueda'
    } finally {
      loading.value = false
    }
  }

  async function fetchFamilia(personaId: string) {
    loading.value = true
    error.value = null
    try {
      familia.value = await apiService.getFamilia(personaId)
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar familia'
      familia.value = null
    } finally {
      loading.value = false
    }
  }

  async function crearRelacion(payload: RelacionPayload) {
    loading.value = true
    error.value = null
    try {
      await apiService.crearRelacion(payload)
      // Refrescar datos después de crear la relación
      if (personaActual.value) {
        await fetchPersona(personaActual.value.id)
        await fetchFamilia(personaActual.value.id)
      }
      // También refrescar la lista global de personas
      await fetchPersonas()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al crear relación'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function eliminarRelacion(relacionId: string) {
    loading.value = true
    error.value = null
    try {
      await apiService.eliminarRelacion(relacionId)
      // Refrescar datos después de eliminar la relación
      if (personaActual.value) {
        await fetchPersona(personaActual.value.id)
        await fetchFamilia(personaActual.value.id)
      }
      await fetchPersonas()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al eliminar relación'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    personas,
    personaActual,
    familia,
    loading,
    error,
    searchQuery,
    personasFiltradas,
    totalPersonas,
    fetchPersonas,
    fetchPersona,
    crearPersona,
    eliminarPersona,
    buscarPersonas,
    fetchFamilia,
    crearRelacion,
    eliminarRelacion
  }
})
