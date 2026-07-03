import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import RutaProtegida from "./components/RutaProtegida";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import Categorias from "./pages/Categorias";
import Articulos from "./pages/Articulos";
import Vehiculos from "./pages/Vehiculos";
import Roles from "./pages/Roles";
import Personas from "./pages/Personas";
import PersonasExternas from "./pages/PersonasExternas";
import Rrhh from "./pages/Rrhh";
import ObligacionesRol from "./pages/ObligacionesRol";
import VencimientosRol from "./pages/VencimientosRol";
import MonitorObligacionesRol from "./pages/MonitorObligacionesRol";
import ObligacionesVehiculo from "./pages/ObligacionesVehiculo";
import AsignacionObligacionesVehiculo from "./pages/AsignacionObligacionesVehiculo";
import VencimientosVehiculo from "./pages/VencimientosVehiculo";
import MonitorObligacionesVehiculo from "./pages/MonitorObligacionesVehiculo";
import UsoVehiculo from "./pages/UsoVehiculo";
import Proveedores from "./pages/Proveedores";
import Compras from "./pages/Compras";
import Ajustes from "./pages/Ajustes";
import ServiciosVehiculo from "./pages/ServiciosVehiculo";
import Stock from "./pages/Stock";
import PermisosExtraUsuario from "./pages/PermisosExtraUsuario";
import GrupoDePermisos from "./pages/GrupoDePermisos";
import PermisosPorModulo from "./pages/PermisosPorModulo";
import BonosApp from "./pages/BonosApp";
import BonosAdmin from "./pages/BonosAdmin";
import MonitorBonos from "./pages/MonitorBonos";
import DocumentosVehiculo from './pages/DocumentosVehiculo'
import EmpresasAdmin from './pages/EmpresasAdmin'
import MonitorServicios from "./pages/MonitorServicios"
import CentrosCarga from "./pages/CentrosCarga"
import TiposCombustible from "./pages/TiposCombustible"
import ServiciosMonitoreables from "./pages/ServiciosMonitoreables"
import MonitorCombustible from "./pages/MonitorCombustible"
import ImportarArticulos from "./pages/ImportarArticulos"
import AccesoExternoVehiculos from "./pages/AccesoExternoVehiculos"

function LayoutConNavbar({ children }) {
  const { usuario } = useAuth();
  return (
    <>
      {usuario && <Navbar />}
      {children}
    </>
  );
}

export default function App() {
  return (
    // <AuthProvider>
      <BrowserRouter basename="/transpolsrlv1">
        <Routes>
          {/* Ruta pública para el login */}
          <Route path="/" element={<Login />} />

          {/* Ruta pública independiente para verbonos */}
          <Route path="/verbonos" element={<BonosApp />} />

          <Route path="/acceso-vehiculos" element={<AccesoExternoVehiculos />} />

          {/* Todas las demás rutas protegidas */}
          <Route element={<RutaProtegida />}>
            <Route
              path="/inicio"
              element={
                <LayoutConNavbar>
                  <Inicio />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/vehiculos"
              element={
                <LayoutConNavbar>
                  <Vehiculos />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/categorias"
              element={
                <LayoutConNavbar>
                  <Categorias />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/articulos"
              element={
                <LayoutConNavbar>
                  <Articulos />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/roles"
              element={
                <LayoutConNavbar>
                  <Roles />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/personas"
              element={
                <LayoutConNavbar>
                  <Personas />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/rrhh"
              element={
                <LayoutConNavbar>
                  <Rrhh />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/obligacionesrol"
              element={
                <LayoutConNavbar>
                  <ObligacionesRol />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/vencimientosrol"
              element={
                <LayoutConNavbar>
                  <VencimientosRol />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/monitoreorol"
              element={
                <LayoutConNavbar>
                  <MonitorObligacionesRol />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/obligacionesvehiculo"
              element={
                <LayoutConNavbar>
                  <ObligacionesVehiculo />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/asignacionobligacionesvehiculo"
              element={
                <LayoutConNavbar>
                  <AsignacionObligacionesVehiculo />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/vencimientosvehiculo"
              element={
                <LayoutConNavbar>
                  <VencimientosVehiculo />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/monitoreovehiculo"
              element={
                <LayoutConNavbar>
                  <MonitorObligacionesVehiculo />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/usovehiculo"
              element={
                <LayoutConNavbar>
                  <UsoVehiculo />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/proveedores"
              element={
                <LayoutConNavbar>
                  <Proveedores />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/compras"
              element={
                <LayoutConNavbar>
                  <Compras />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/ajustes"
              element={
                <LayoutConNavbar>
                  <Ajustes />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/serviciosvehiculo"
              element={
                <LayoutConNavbar>
                  <ServiciosVehiculo />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/stock"
              element={
                <LayoutConNavbar>
                  <Stock />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/permisosextrausuario"
              element={
                <LayoutConNavbar>
                  <PermisosExtraUsuario />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/grupodepermisos"
              element={
                <LayoutConNavbar>
                  <GrupoDePermisos />
                </LayoutConNavbar>
              }
            />
            <Route 
              path="/permisospormodulo" 
              element={
                <LayoutConNavbar>
                  <PermisosPorModulo />
                </LayoutConNavbar>
              } 
            />
            <Route 
              path="/verbonosensistema" 
              element={
                <LayoutConNavbar>
                  <BonosApp />
                </LayoutConNavbar>
              } 
            />
            <Route path="/bonosadmin" 
              element={
              <LayoutConNavbar>
                <BonosAdmin />
              </LayoutConNavbar>
              } 
            />

            <Route path="/empresas" 
              element={
              <LayoutConNavbar>
                <EmpresasAdmin />
              </LayoutConNavbar>
              } 
            />
            
            <Route path="/monitorbonos" 
              element={
              <LayoutConNavbar>
                <MonitorBonos />
              </LayoutConNavbar>
            } 
            />
            <Route path="/documentosvehiculo" 
              element={
              <LayoutConNavbar>
                <DocumentosVehiculo />
              </LayoutConNavbar>
            } 
            />

            <Route
              path="/monitorservicios"
              element={
                <LayoutConNavbar>
                  <MonitorServicios />
                </LayoutConNavbar>
              }
            />

            <Route
            path="/centroscarga"
              element={
                <LayoutConNavbar>
                  <CentrosCarga />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/tiposcombustible"
              element={
                <LayoutConNavbar>
                  <TiposCombustible />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/serviciosmonitoreables"
              element={
                <LayoutConNavbar>
                  <ServiciosMonitoreables />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/monitorcombustible"
              element={
                <LayoutConNavbar>
                  <MonitorCombustible />
                </LayoutConNavbar>
              }
            />
            <Route
              path="/importar-articulos"
              element={
                <LayoutConNavbar>
                  <ImportarArticulos />
                </LayoutConNavbar>
              }
            />
             <Route
              path="/personasexternas"
              element={
                <LayoutConNavbar>
                  <PersonasExternas />
                </LayoutConNavbar>
              }
            />
          </Route>

        </Routes>
      </BrowserRouter>
    // </AuthProvider>
  );
}
