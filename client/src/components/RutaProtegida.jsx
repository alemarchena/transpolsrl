import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaProtegida() {
  const { usuario, permisos, cargando } = useAuth();
  const location = useLocation();

  if (cargando) return null;

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  const rutaActual = location.pathname;
  
  if (!permisos.includes(rutaActual)) {
    return (
      <div className="text-center mt-20 text-red-600 text-lg font-bold">
        Acceso denegado
      </div>
    );
  }

  return <Outlet />;
}
