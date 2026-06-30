import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ArbolGenealogico from '@/components/ArbolGenealogico.vue'
import type { FamiliaDTO, PersonaDTO } from '@/types/arbol.types'

const persona: PersonaDTO = {
  id: '1', nombre: 'Juan', apellido: 'Pérez', genero: 'M',
  eventos: [], fechaNacimiento: '1990-01-15T00:00:00.000Z',
  fechaDefuncion: null, edad: 35, estaViva: true
}

const padre: PersonaDTO = {
  id: '2', nombre: 'Carlos', apellido: 'Pérez', genero: 'M',
  eventos: [], fechaNacimiento: '1960-03-10T00:00:00.000Z',
  fechaDefuncion: null, edad: 65, estaViva: true
}

const madre: PersonaDTO = {
  id: '3', nombre: 'Ana', apellido: 'López', genero: 'F',
  eventos: [], fechaNacimiento: '1962-07-22T00:00:00.000Z',
  fechaDefuncion: null, edad: 63, estaViva: true
}

const hijo: PersonaDTO = {
  id: '4', nombre: 'Luis', apellido: 'Pérez', genero: 'M',
  eventos: [], fechaNacimiento: '2015-11-05T00:00:00.000Z',
  fechaDefuncion: null, edad: 10, estaViva: true
}

const conyuge: PersonaDTO = {
  id: '5', nombre: 'Laura', apellido: 'Martínez', genero: 'F',
  eventos: [], fechaNacimiento: '1991-02-14T00:00:00.000Z',
  fechaDefuncion: null, edad: 34, estaViva: true
}

describe('ArbolGenealogico Component', () => {
  it('debe renderizar el árbol con la persona central', () => {
    const familia: FamiliaDTO = { persona, padres: [], conyuges: [], hijos: [] }
    const wrapper = mount(ArbolGenealogico, {
      props: { familia },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } }
    })
    expect(wrapper.text()).toContain('Juan')
    expect(wrapper.text()).toContain('Pérez')
  })

  it('debe mostrar padres en la fila superior', () => {
    const familia: FamiliaDTO = { persona, padres: [padre, madre], conyuges: [], hijos: [] }
    const wrapper = mount(ArbolGenealogico, {
      props: { familia },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } }
    })
    expect(wrapper.text()).toContain('Carlos')
    expect(wrapper.text()).toContain('Ana')
  })

  it('debe mostrar hijos en la fila inferior', () => {
    const familia: FamiliaDTO = { persona, padres: [], conyuges: [], hijos: [hijo] }
    const wrapper = mount(ArbolGenealogico, {
      props: { familia },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } }
    })
    expect(wrapper.text()).toContain('Luis')
  })

  it('debe mostrar cónyuge al lado', () => {
    const familia: FamiliaDTO = { persona, padres: [], conyuges: [conyuge], hijos: [] }
    const wrapper = mount(ArbolGenealogico, {
      props: { familia },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } }
    })
    expect(wrapper.text()).toContain('Laura')
  })

  it('debe renderizar árbol completo con toda la familia', () => {
    const familia: FamiliaDTO = { persona, padres: [padre, madre], conyuges: [conyuge], hijos: [hijo] }
    const wrapper = mount(ArbolGenealogico, {
      props: { familia },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } }
    })
    expect(wrapper.text()).toContain('Juan')
    expect(wrapper.text()).toContain('Carlos')
    expect(wrapper.text()).toContain('Ana')
    expect(wrapper.text()).toContain('Laura')
    expect(wrapper.text()).toContain('Luis')
  })

  it('debe mostrar estado vacío cuando no hay familia', () => {
    const familia: FamiliaDTO = { persona, padres: [], conyuges: [], hijos: [] }
    const wrapper = mount(ArbolGenealogico, {
      props: { familia },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } }
    })
    expect(wrapper.find('.arbol-container').exists()).toBe(true)
  })
})
