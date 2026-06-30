import { http, HttpResponse } from 'msw'

const mockPersonas = [
  { id: '1', nombre: 'Juan', apellido: 'Pérez', genero: 'M', eventos: [], fechaNacimiento: '1990-01-15T00:00:00.000Z', fechaDefuncion: null, edad: 35, estaViva: true },
  { id: '2', nombre: 'María', apellido: 'García', genero: 'F', eventos: [], fechaNacimiento: '1988-05-20T00:00:00.000Z', fechaDefuncion: null, edad: 37, estaViva: true }
]

const mockEventos = [
  { id: 'e1', personaId: '1', tipo: 'Nacimiento', fecha: '1990-01-15T00:00:00.000Z', descripcion: 'Nacimiento de Juan', ubicacion: { nombre: 'Buenos Aires' }, impacto: 'Nacimiento registrado' }
]

const mockFamilia = {
  persona: mockPersonas[0],
  padres: [],
  conyuges: [mockPersonas[1]],
  hijos: []
}

export const handlers = [
  http.get('/api/personas', () => HttpResponse.json({ data: mockPersonas })),
  http.get('/api/personas/buscar', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase() || ''
    const filtered = mockPersonas.filter(p =>
      p.nombre.toLowerCase().includes(q) || p.apellido.toLowerCase().includes(q)
    )
    return HttpResponse.json({ data: filtered })
  }),
  http.get('/api/personas/:id', ({ params }) => {
    const persona = mockPersonas.find(p => p.id === params.id)
    if (!persona) return HttpResponse.json({ error: 'No encontrada' }, { status: 404 })
    return HttpResponse.json({ data: persona })
  }),
  http.post('/api/personas', async ({ request }) => {
    const body = await request.json() as any
    const nueva = { id: '3', ...body, eventos: [], fechaNacimiento: null, fechaDefuncion: null, edad: null, estaViva: true }
    return HttpResponse.json({ data: nueva }, { status: 201 })
  }),
  http.delete('/api/personas/:id', () => HttpResponse.json({ data: { eliminado: true } })),
  http.get('/api/personas/:id/familia', () => HttpResponse.json({ data: mockFamilia })),
  http.get('/api/personas/:personaId/eventos', () => HttpResponse.json({ data: mockEventos })),
  http.post('/api/personas/:personaId/eventos', async ({ request }) => {
    const body = await request.json() as any
    const nuevo = { id: 'e2', personaId: '1', ...body, impacto: 'Evento registrado' }
    return HttpResponse.json({ data: nuevo }, { status: 201 })
  }),
  http.delete('/api/personas/:personaId/eventos/:eventoId', () => HttpResponse.json({ data: { eliminado: true } })),
  http.get('/api/historial', () => HttpResponse.json({ data: [{ tipo: 'agregar_persona', entidadId: '1', timestamp: new Date().toISOString() }] }))
]
