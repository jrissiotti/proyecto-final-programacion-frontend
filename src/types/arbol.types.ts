export type TipoEvento = 'Nacimiento' | 'Matrimonio' | 'Defuncion' | 'Migracion'
export type TipoRelacion = 'PADRE_DE' | 'MADRE_DE' | 'CONYUGE_DE'
export type Genero = 'M' | 'F'

export interface UbicacionDTO {
  nombre: string
}

export interface EventoDTO {
  id: string
  personaId: string
  tipo: TipoEvento
  fecha: string
  descripcion: string
  ubicacion: UbicacionDTO
  impacto: string
}

export interface PersonaDTO {
  id: string
  nombre: string
  apellido: string
  genero: Genero
  eventos: EventoDTO[]
  fechaNacimiento: string | null
  fechaDefuncion: string | null
  edad: number | null
  estaViva: boolean
  relacionId?: string
}

export interface FamiliaDTO {
  persona: PersonaDTO
  padres: PersonaDTO[]
  conyuges: PersonaDTO[]
  hijos: PersonaDTO[]
}

export interface CambioDTO {
  tipo: 'agregar_persona' | 'eliminar_persona' | 'agregar_evento' | 'eliminar_evento' | 'agregar_relacion' | 'eliminar_relacion'
  entidadId: string
  timestamp: string
}

export interface CrearPersonaPayload {
  nombre: string
  apellido: string
  genero: Genero
}

export interface CrearEventoPayload {
  tipo: TipoEvento
  fecha: string
  descripcion: string
  ubicacion: { nombre: string }
}

export interface RelacionPayload {
  personaOrigenId: string
  personaDestinoId: string
  tipo: TipoRelacion
}

export interface ApiResponse<T> {
  data: T
}

export interface ApiError {
  error: string
}
