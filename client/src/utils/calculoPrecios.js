export const OPCIONES_REDONDEO = {
  decimales: 2,
  modo: 'round' // puede ser 'round', 'floor', 'ceil'
};

function redondear(valor) {
  const factor = Math.pow(10, OPCIONES_REDONDEO.decimales);
  switch (OPCIONES_REDONDEO.modo) {
    case 'floor': return Math.floor(valor * factor) / factor;
    case 'ceil':  return Math.ceil(valor * factor) / factor;
    default:      return Math.round(valor * factor) / factor;
  }
}
export function calcularIVADesdeNeto(neto, porcentaje) {
  const iva = (neto * porcentaje) / 100;
  return redondear(iva);
}

export function calcularNetoDesdeIVA(iva, porcentaje) {
  if (porcentaje === 0) return 0;
  const neto = (iva * 100) / porcentaje;
  return redondear(neto);
}

export function calcularIVADesdeBruto(precioUnitario, porcentaje) {
  const iva = precioUnitario - (precioUnitario / (1 + porcentaje / 100));
  return redondear(iva);
}

export function calcularBrutoDesdeNeto(neto, porcentaje) {
  const bruto = neto * (1 + porcentaje / 100);
  return redondear(bruto);
}
