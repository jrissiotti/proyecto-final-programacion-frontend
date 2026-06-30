import axios, { type AxiosInstance } from 'axios'
import type {
  PersonaDTO,
  FamiliaDTO,
  EventoDTO,
  CambioDTO,
  CrearPersonaPayload,
  CrearEventoPayload,
  RelacionPayload,
  ApiResponse
} from '@/types/arbol.types'

class ApiService {
  private http: AxiosInstance

  constructor() {
    this.http = axios.create({
      baseURL: '/api',
      headers: { 'Content-Type': 'application/json' }
    })
  }

  async getPersonas(): Promise<PersonaDTO[]> {
    const { data } = await this.http.get<ApiResponse<PersonaDTO[]>>('/personas')
    return data.data
  }

  async getPersona(id: string): Promise<PersonaDTO> {
    const { data } = await this.http.get<ApiResponse<PersonaDTO>>(`/personas/${id}`)
    return data.data
  }

  async crearPersona(payload: CrearPersonaPayload): Promise<PersonaDTO> {
    const { data } = await this.http.post<ApiResponse<PersonaDTO>>('/personas', payload)
    return data.data
  }

  async eliminarPersona(id: string): Promise<void> {
    await this.http.delete(`/personas/${id}`)
  }

  async buscarPersonas(query: string): Promise<PersonaDTO[]> {
    const { data } = await this.http.get<ApiResponse<PersonaDTO[]>>('/personas/buscar', {
      params: { q: query }
    })
    return data.data
  }

  async getFamilia(personaId: string): Promise<FamiliaDTO> {
    const { data } = await this.http.get<ApiResponse<FamiliaDTO>>(`/personas/${personaId}/familia`)
    return data.data
  }

  async getEventos(personaId: string): Promise<EventoDTO[]> {
    const { data } = await this.http.get<ApiResponse<EventoDTO[]>>(`/personas/${personaId}/eventos`)
    return data.data
  }

  async crearEvento(personaId: string, payload: CrearEventoPayload): Promise<EventoDTO> {
    const { data } = await this.http.post<ApiResponse<EventoDTO>>(`/personas/${personaId}/eventos`, payload)
    return data.data
  }

  async actualizarEvento(personaId: string, eventoId: string, payload: CrearEventoPayload): Promise<EventoDTO> {
    const { data } = await this.http.put<ApiResponse<EventoDTO>>(`/personas/${personaId}/eventos/${eventoId}`, payload)
    return data.data
  }

  async eliminarEvento(personaId: string, eventoId: string): Promise<void> {
    await this.http.delete(`/personas/${personaId}/eventos/${eventoId}`)
  }

  async crearRelacion(payload: RelacionPayload): Promise<any> {
    const { data } = await this.http.post<ApiResponse<any>>('/personas/relaciones', payload)
    return data.data
  }

  async eliminarRelacion(relacionId: string): Promise<void> {
    await this.http.delete(`/personas/relaciones/${relacionId}`)
  }

  async exportar(formato: 'json' | 'csv', personaId?: string): Promise<Blob> {
    const params = personaId ? { personaId } : {}
    const { data } = await this.http.get(`/exportar/${formato}`, {
      params,
      responseType: 'blob'
    })
    return data
  }

  async exportarGEDCOM(): Promise<Blob> {
    const { data } = await this.http.get('/exportar/gedcom', {
      responseType: 'blob'
    })
    return data
  }

  async validarCronologia(): Promise<any> {
    const { data } = await this.http.post<ApiResponse<any>>('/validar')
    return data.data
  }

  async getHistorial(): Promise<CambioDTO[]> {
    const { data } = await this.http.get<ApiResponse<CambioDTO[]>>('/historial')
    return data.data
  }
}

export const apiService = new ApiService()
