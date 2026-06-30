export function validarNombre(nombre: string): string | null {
  if (!nombre || nombre.trim().length === 0) return 'El nombre es obligatorio'
  if (nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres'
  if (nombre.trim().length > 50) return 'El nombre no puede exceder 50 caracteres'
  return null
}

export function validarApellido(apellido: string): string | null {
  if (!apellido || apellido.trim().length === 0) return 'El apellido es obligatorio'
  if (apellido.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres'
  if (apellido.trim().length > 50) return 'El apellido no puede exceder 50 caracteres'
  return null
}

export function validarFecha(fecha: string): string | null {
  if (!fecha) return 'La fecha es obligatoria'
  const date = new Date(fecha)
  if (isNaN(date.getTime())) return 'Fecha inválida'
  if (date > new Date()) return 'La fecha no puede ser futura'
  return null
}

export function validarDescripcion(descripcion: string): string | null {
  if (!descripcion || descripcion.trim().length === 0) return 'La descripción es obligatoria'
  if (descripcion.trim().length > 500) return 'La descripción no puede exceder 500 caracteres'
  return null
}

export function validarUbicacion(ubicacion: string): string | null {
  if (!ubicacion || ubicacion.trim().length === 0) return 'La ubicación es obligatoria'
  if (ubicacion.trim().length > 100) return 'La ubicación no puede exceder 100 caracteres'
  return null
}
