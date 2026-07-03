export const formatearFechaDDMMYYYY = (fechaISO) => {
  if (!fechaISO) return ""

  const [año, mes, dia] = fechaISO.split("T")[0].split("-")
  return `${dia}/${mes}/${año}`
}

export const separarFechaHora = (fechaCompleta) => {
  if (!fechaCompleta) return { fecha: "", hora: "" }

  const [fecha, horaCompleta] = fechaCompleta.split(" ")
  const [year, month, day] = fecha.split("-")
  const hora = horaCompleta.slice(0, 5) // hh:mm

  return {
    fecha: `${day}-${month}-${year}`,
    hora: hora,
  }
}

export const formatearFechaHora = (fechaISO) => {
  const fecha = new Date(fechaISO)
  const dia = String(fecha.getDate()).padStart(2, "0")
  const mes = String(fecha.getMonth() + 1).padStart(2, "0")
  const anio = fecha.getFullYear()
  const horas = String(fecha.getHours()).padStart(2, "0")
  const minutos = String(fecha.getMinutes()).padStart(2, "0")
  return `${dia}/${mes}/${anio} ${horas}:${minutos}`
}

export const formatearFechaHoraSQL = (fechaSQL) => {
  if (!fechaSQL) return "";
  
  // Si viene en formato "YYYY-MM-DD HH:MM:SS"
  const partes = fechaSQL.split(" ");
  if (partes.length === 2) {
    const [fecha, hora] = partes;
    const [year, month, day] = fecha.split("-");
    const [hours, minutes] = hora.split(":");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  
  // Si viene en formato ISO
  return formatearFechaHora(fechaSQL);
};
