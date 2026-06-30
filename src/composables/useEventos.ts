import { computed } from 'vue'
import { useEventosStore } from '@/stores/eventos.store'
import { storeToRefs } from 'pinia'
import type { CrearEventoPayload, TipoEvento } from '@/types/arbol.types'

export function useEventos() {
  const store = useEventosStore()
  const { eventos, historial, loading, error, filtroTipo, eventosFiltrados, totalEventos, eventosPorTipo } = storeToRefs(store)

  const eventosOrdenados = computed(() =>
    [...eventosFiltrados.value].sort((a, b) =>
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    )
  )

  return {
    eventos, historial, loading, error, filtroTipo,
    eventosFiltrados, eventosOrdenados, totalEventos, eventosPorTipo,
    cargarEventos: (personaId: string) => store.fetchEventos(personaId),
    crearEvento: (personaId: string, payload: CrearEventoPayload) => store.crearEvento(personaId, payload),
    actualizarEvento: (personaId: string, eventoId: string, payload: CrearEventoPayload) => store.actualizarEvento(personaId, eventoId, payload),
    eliminarEvento: (personaId: string, eventoId: string) => store.eliminarEvento(personaId, eventoId),
    cargarHistorial: () => store.fetchHistorial(),
  
    exportar: (formato: 'json' | 'csv', personaId?: string) => store.exportar(formato, personaId),
    exportarGEDCOM: () => store.exportarGEDCOM(),
    setFiltroTipo: (tipo: TipoEvento | null) => { filtroTipo.value = tipo }
  }
}
