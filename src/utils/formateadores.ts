export function formatearFecha(fechaISO: string | null): string {
  if (!fechaISO) return '—'
  const fecha = new Date(fechaISO)
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatearFechaCorta(fechaISO: string | null): string {
  if (!fechaISO) return '—'
  const fecha = new Date(fechaISO)
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatearEdad(edad: number | null): string {
  if (edad === null) return 'Edad desconocida'
  return `${edad} año${edad !== 1 ? 's' : ''}`
}

export function formatearGenero(genero: 'M' | 'F'): string {
  return genero === 'M' ? 'Masculino' : 'Femenino'
}

export function obtenerIconoEvento(tipo: string): string {
  const iconos: Record<string, string> = {
    Nacimiento: '👶',
    Matrimonio: '💒',
    Defuncion: '⚰️',
    Migracion: '✈️'
  }
  return iconos[tipo] || '📌'
}

export function obtenerColorEvento(tipo: string): string {
  const colores: Record<string, string> = {
    Nacimiento: '#10b981',
    Matrimonio: '#8b5cf6',
    Defuncion: '#ef4444',
    Migracion: '#06b6d4'
  }
  return colores[tipo] || '#6b7280'
}

export function formatearTipoCambio(tipo: string): string {
  const tipos: Record<string, string> = {
    agregar_persona: 'Persona agregada',
    eliminar_persona: 'Persona eliminada',
    agregar_evento: 'Evento agregado',
    eliminar_evento: 'Evento eliminado',
    agregar_relacion: 'Relación agregada'
  }
  return tipos[tipo] || tipo
}

export function formatearTiempoRelativo(fechaISO: string): string {
  const ahora = new Date()
  const fecha = new Date(fechaISO)
  const diffMs = ahora.getTime() - fecha.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDias = Math.floor(diffHr / 24)

  if (diffMin < 1) return 'Hace un momento'
  if (diffMin < 60) return `Hace ${diffMin} min`
  if (diffHr < 24) return `Hace ${diffHr}h`
  if (diffDias < 7) return `Hace ${diffDias}d`
  return formatearFechaCorta(fechaISO)
}
