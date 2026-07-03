export const capitalizarTexto = (texto) => {
  if (!texto) return "";
  return texto
    .toLowerCase()
    .split(" ")
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
};

export const nombreCompleto = (apellido, nombre) => {
  return `${capitalizarTexto(apellido)} ${capitalizarTexto(nombre)}`;
};