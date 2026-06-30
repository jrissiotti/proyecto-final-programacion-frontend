import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { usePersonasStore } from '@/stores/personas.store'
import PersonaCard from '@/components/PersonaCard.vue'
import type { PersonaDTO } from '@/types/arbol.types'

const mockPersona = vi.hoisted(() => ({
  id: '1', nombre: 'Juan', apellido: 'Pérez', genero: 'M',
  eventos: [], fechaNacimiento: '1990-01-15T00:00:00.000Z',
  fechaDefuncion: null, edad: 35, estaViva: true
}));

vi.mock('@/services/api.service', () => ({
  apiService: {
    getPersonas: vi.fn().mockResolvedValue([mockPersona]),
    getPersona: vi.fn().mockResolvedValue(mockPersona),
    crearPersona: vi.fn().mockResolvedValue({ ...mockPersona, id: '2', nombre: 'Pedro' }),
    eliminarPersona: vi.fn().mockResolvedValue(undefined),
    buscarPersonas: vi.fn().mockResolvedValue([mockPersona]),
    getFamilia: vi.fn().mockResolvedValue({ persona: mockPersona, padres: [], conyuges: [], hijos: [] })
  }
}))

describe('Personas Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('debe cargar personas desde el store', async () => {
    const store = usePersonasStore()
    await store.fetchPersonas()
    expect(store.personas).toHaveLength(1)
    expect(store.personas[0].nombre).toBe('Juan')
  })

  it('debe crear una persona', async () => {
    const store = usePersonasStore()
    const nueva = await store.crearPersona({ nombre: 'Pedro', apellido: 'López', genero: 'M' })
    expect(nueva.nombre).toBe('Pedro')
    expect(store.personas).toHaveLength(1)
  })

  it('debe eliminar una persona', async () => {
    const store = usePersonasStore()
    await store.fetchPersonas()
    await store.eliminarPersona('1')
    expect(store.personas).toHaveLength(0)
  })

  it('debe renderizar PersonaCard correctamente', () => {
    const wrapper = mount(PersonaCard, {
      props: { persona: mockPersona },
      global: {
        stubs: { RouterLink: { template: '<a><slot /></a>' } }
      }
    })
    expect(wrapper.text()).toContain('Juan')
    expect(wrapper.text()).toContain('Pérez')
  })

  it('debe filtrar personas por búsqueda', async () => {
    const store = usePersonasStore()
    await store.fetchPersonas()
    store.searchQuery = 'Juan'
    expect(store.personasFiltradas).toHaveLength(1)
    store.searchQuery = 'ZZZ'
    expect(store.personasFiltradas).toHaveLength(0)
  })

  it('debe cargar familia de una persona', async () => {
    const store = usePersonasStore()
    await store.fetchFamilia('1')
    expect(store.familia).not.toBeNull()
    expect(store.familia?.persona.nombre).toBe('Juan')
  })
})
