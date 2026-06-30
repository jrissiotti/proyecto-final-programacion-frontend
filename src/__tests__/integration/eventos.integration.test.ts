import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useEventosStore } from '@/stores/eventos.store'

const mockEvento = vi.hoisted(() => ({
  id: 'e1', personaId: '1', tipo: 'Nacimiento' as const, fecha: '1990-01-15T00:00:00.000Z',
  descripcion: 'Nacimiento de Juan', ubicacion: { nombre: 'Buenos Aires' }, impacto: 'Nacimiento registrado'
}))

vi.mock('@/services/api.service', () => ({
  apiService: {
    getEventos: vi.fn().mockResolvedValue([mockEvento]),
    crearEvento: vi.fn().mockResolvedValue({ ...mockEvento, id: 'e2', tipo: 'Matrimonio', descripcion: 'Boda' }),
    eliminarEvento: vi.fn().mockResolvedValue(undefined),
    getHistorial: vi.fn().mockResolvedValue([{ tipo: 'agregar_evento', entidadId: 'e1', timestamp: new Date().toISOString() }]),
    validarCronologia: vi.fn().mockResolvedValue({ valido: true }),
    exportar: vi.fn().mockResolvedValue(new Blob(['test'])),
    exportarGEDCOM: vi.fn().mockResolvedValue(new Blob(['test']))
  }
}))

describe('Eventos Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('debe cargar eventos de una persona', async () => {
    const store = useEventosStore()
    await store.fetchEventos('1')
    expect(store.eventos).toHaveLength(1)
    expect(store.eventos[0].tipo).toBe('Nacimiento')
  })

  it('debe crear un evento', async () => {
    const store = useEventosStore()
    const nuevo = await store.crearEvento('1', {
      tipo: 'Matrimonio', fecha: '2020-06-15', descripcion: 'Boda', ubicacion: { nombre: 'Madrid' }
    })
    expect(nuevo.tipo).toBe('Matrimonio')
  })

  it('debe eliminar un evento', async () => {
    const store = useEventosStore()
    await store.fetchEventos('1')
    await store.eliminarEvento('1', 'e1')
    expect(store.eventos).toHaveLength(0)
  })

  it('debe cargar historial', async () => {
    const store = useEventosStore()
    await store.fetchHistorial()
    expect(store.historial).toHaveLength(1)
  })

  it('debe filtrar eventos por tipo', async () => {
    const store = useEventosStore()
    await store.fetchEventos('1')
    store.filtroTipo = 'Nacimiento'
    expect(store.eventosFiltrados).toHaveLength(1)
    store.filtroTipo = 'Matrimonio'
    expect(store.eventosFiltrados).toHaveLength(0)
  })

  it('debe contar eventos por tipo', async () => {
    const store = useEventosStore()
    await store.fetchEventos('1')
    expect(store.eventosPorTipo.Nacimiento).toBe(1)
    expect(store.eventosPorTipo.Matrimonio).toBe(0)
  })
})
