// src/utils/validaciones.js
export function esFechaConAnioValido(fecha) {
  if (!fecha) return false;

  const añoActual = new Date().getFullYear();
  const añoFecha = new Date(fecha).getFullYear();

  return añoFecha >= añoActual;
}
