import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EventoDTO, CambioDTO, CrearEventoPayload, TipoEvento } from '@/types/arbol.types'
import { apiService } from '@/services/api.service'

export const useEventosStore = defineStore('eventos', () => {
  const eventos = ref<EventoDTO[]>([])
  const historial = ref<CambioDTO[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filtroTipo = ref<TipoEvento | null>(null)

  const eventosFiltrados = computed(() => {
    if (!filtroTipo.value) return eventos.value
    return eventos.value.filter(e => e.tipo === filtroTipo.value)
  })

  const totalEventos = computed(() => eventos.value.length)

  const eventosPorTipo = computed(() => {
    const counts: Record<string, number> = {
      Nacimiento: 0, Matrimonio: 0, Defuncion: 0, Migracion: 0
    }
    eventos.value.forEach(e => {
      if (counts[e.tipo] !== undefined) counts[e.tipo]++
    })
    return counts
  })

  async function fetchEventos(personaId: string) {
    loading.value = true
    error.value = null
    try {
      eventos.value = await apiService.getEventos(personaId)
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar eventos'
    } finally {
      loading.value = false
    }
  }

  async function crearEvento(personaId: string, payload: CrearEventoPayload) {
    loading.value = true
    error.value = null
    try {
      const nuevo = await apiService.crearEvento(personaId, payload)
      eventos.value.push(nuevo)
      return nuevo
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al crear evento'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function eliminarEvento(personaId: string, eventoId: string) {
    loading.value = true
    error.value = null
    try {
      await apiService.eliminarEvento(personaId, eventoId)
      eventos.value = eventos.value.filter(e => e.id !== eventoId)
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al eliminar evento'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function actualizarEvento(personaId: string, eventoId: string, payload: CrearEventoPayload) {
    loading.value = true
    error.value = null
    try {
      const actualizado = await apiService.actualizarEvento(personaId, eventoId, payload)
      // Actualizar reactivamente en el array de eventos
      const index = eventos.value.findIndex(e => e.id === eventoId)
      if (index !== -1) {
        eventos.value[index] = actualizado
      }
      return actualizado
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al actualizar evento'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchHistorial() {
    try {
      historial.value = await apiService.getHistorial()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar historial'
    }
  }

  async function validarCronologia() {
    loading.value = true
    error.value = null
    try {
      return await apiService.validarCronologia()
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error en la validación'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function exportar(formato: 'json' | 'csv', personaId?: string) {
    try {
      const blob = await apiService.exportar(formato, personaId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `eventos.${formato}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al exportar'
      throw err
    }
  }

  async function exportarGEDCOM() {
    try {
      const blob = await apiService.exportarGEDCOM()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'arbol.ged'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al exportar GEDCOM'
      throw err
    }
  }

  return {
    eventos, historial, loading, error, filtroTipo,
    eventosFiltrados, totalEventos, eventosPorTipo,
    fetchEventos, crearEvento, actualizarEvento, eliminarEvento, fetchHistorial,
    validarCronologia, exportar, exportarGEDCOM
  }
})
