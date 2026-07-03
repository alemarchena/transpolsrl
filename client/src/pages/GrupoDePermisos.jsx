import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"

import { API_URLS } from "../api/api";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

export default function GrupoDePermisos() {
  const [grupos, setGrupos] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [ruta, setRuta] = useState("");
  const [idPermiso, setIdPermiso] = useState(0);

  const obtenerGrupos = async () => {
    const res = await fetch(API_URLS.grupodepermisos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getPermisosGenerales" })
    });
    const data = await res.json();
    setGrupos(data);
  };

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Grupo de permisos')
  }

  const obtenerRutasPorGrupo = async (id) => {
    setIdPermiso(id);
    const res = await fetch(API_URLS.grupodepermisos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getRutasPorPermiso", idPermiso: id })
    });
    const data = await res.json();
    setRutas(data);
  };

  const agregarRuta = async () => {
    if (!idPermiso || !ruta) {
      toast.error("Debe seleccionar un grupo y una ruta");
      return;
    }
    const res = await fetch(API_URLS.grupodepermisos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addRutaAGrupo", idPermiso, ruta })
    });
    const result = await res.json();
    if (result.success) {
      toast.success("Ruta agregada");
      setRuta("");
      obtenerRutasPorGrupo(idPermiso);
    } else {
      toast.error("Error: " + result.error);
    }
  };

  const eliminarRuta = async (id) => {
    const res = await fetch(API_URLS.grupodepermisos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "eliminarRutaDeGrupo", id })
    });
    const result = await res.json();
    if (result.success) {
      toast.success("Ruta eliminada");
      obtenerRutasPorGrupo(idPermiso);
    } else {
      toast.error("Error: " + result.error);
    }
  };

  useEffect(() => {
    obtenerGrupos();
    registrarse()
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Configuración de Permisos por Grupo</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <select
          value={idPermiso}
          onChange={(e) => obtenerRutasPorGrupo(Number(e.target.value))}
          className="border p-2"
        >
          <option value={0}>Seleccionar grupo</option>
          {grupos.map((grupo) => (
            <option key={grupo.id} value={grupo.id}>{grupo.nombre}</option>
          ))}
        </select>
        <input
          type="text"
          value={ruta}
          onChange={(e) => setRuta(e.target.value)}
          className="border p-2"
          placeholder="Nueva ruta"
        />
      </div>
      <button onClick={agregarRuta} className="bg-blue-600 text-white px-4 py-2 rounded">Agregar Ruta</button>

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Rutas asignadas</h3>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Ruta</th>
              <th className="border px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rutas.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.ruta}</td>
                <td className="border px-2 py-1">
                  <button onClick={() => eliminarRuta(item.id)} className="text-red-600"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
