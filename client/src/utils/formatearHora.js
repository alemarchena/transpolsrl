export const formatearHora = (hora) => {
  if (!hora) return "Hora inválida";

  // Si es un objeto Date, obtener horas y minutos
  if (hora instanceof Date) {
    const horas = hora.getHours();
    const minutos = hora.getMinutes();
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')} hs`;
  }

  // Si es un string, seguir con la lógica original
  if (typeof hora === "string") {
    const partes = hora.split(":");
    if (partes.length < 2) return "Hora inválida";
    const [horas, minutos] = partes;
    return `${horas.padStart(2, '0')}:${minutos.padStart(2, '0')} hs`;
  }

  return "Hora inválida";
};
