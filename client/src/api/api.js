import ImportarArticulos from "../pages/ImportarArticulos";

const isLocalhost = window.location.hostname === "localhost";

const BASE_URL = isLocalhost
  ? "/api"
  : "https://templaystudios.com/transpolsrlv1/server/api";

export const API_URLS = {
  articulos:      `${BASE_URL}/articulos.php`,
  categorias:     `${BASE_URL}/categorias.php`,
  vehiculos:      `${BASE_URL}/vehiculos.php`,
  roles:          `${BASE_URL}/roles.php`,
  personas:       `${BASE_URL}/personas.php`,
  personasexternas:`${BASE_URL}/personasexternas.php`,
  rrhh:           `${BASE_URL}/rrhh.php`,
  obligacionesrol:`${BASE_URL}/obligacionesrol.php`,
  vencimientosrol:`${BASE_URL}/vencimientosrol.php`,
  monitoreorol:   `${BASE_URL}/monitoreorol.php`,
  obligacionesvehiculo: `${BASE_URL}/obligacionesvehiculo.php`,
  asignacionobligacionesvehiculo: `${BASE_URL}/asignacionobligacionesvehiculo.php`,
  vencimientosvehiculo: `${BASE_URL}/vencimientosvehiculo.php`,
  monitoreovehiculo: `${BASE_URL}/monitoreovehiculo.php`,
  usovehiculo:    `${BASE_URL}/usovehiculo.php`,
  proveedores:    `${BASE_URL}/proveedores.php`,
  compras:        `${BASE_URL}/compras.php`,
  usuarios:       `${BASE_URL}/usuarios.php`,
  ajustes:        `${BASE_URL}/ajustes.php`,
  serviciosvehiculo:      `${BASE_URL}/serviciosvehiculo.php`,
  stock:                  `${BASE_URL}/stock.php`,
  permisosextrausuario:   `${BASE_URL}/permisosextra.php`,
  grupodepermisos:        `${BASE_URL}/permisosextra.php`,
  permisospormodulo:      `${BASE_URL}/permisospormodulo.php`,
  verbonos:               `${BASE_URL}/personasbonos.php`,
  verbonosensistema:      `${BASE_URL}/personasbonos.php`,
  bonosadmin:             `${BASE_URL}/personasbonos.php`,
  personasbonos:          `${BASE_URL}/personasbonos.php`,
  monitorbonos:           `${BASE_URL}/monitorbonos.php`,
  documentosvehiculo:     `${BASE_URL}/documentosvehiculo.php`,
  empresas          :     `${BASE_URL}/empresas.php`,
  monitorservicios  :     `${BASE_URL}/monitorservicios.php`,
  centroscarga      :     `${BASE_URL}/centroscarga.php`,
  tiposcombustible  :     `${BASE_URL}/tiposcombustible.php`,
  serviciosmonitoreables: `${BASE_URL}/serviciosmonitoreables.php`,
  monitorcombustible:     `${BASE_URL}/monitorcombustible.php`,
  importararticulos :     `${BASE_URL}/importararticulos.php`,
  documentospersona :     `${BASE_URL}/documentospersona.php`,
  accesoExternoVehiculos: `${BASE_URL}/acceso-externo-vehiculos.php`,
  baseURL: `${BASE_URL}`,

};
