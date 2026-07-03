import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

export default function PermisosExtraUsuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [datos, setDatos] = useState([]);
    const [rutasDisponibles, setRutasDisponibles] = useState([]);
    const [email, setEmail] = useState("");
    const [ruta, setRuta] = useState("");

    const [nombre, setNombre] = useState("");
    const [idPermisos, setIdPermisos] = useState(0);

    const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Permisos Extra Usuarios')
  }


  const obtenerDatos = async () => {
    const res = await fetch(API_URLS.permisosextrausuario, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" })
    });
    const data = await res.json();
    setDatos(data);
  };

    const obtenerUsuarios = async () => {
      const res = await fetch(API_URLS.permisospormodulo, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getUsuarios" }),
      });
      const data = await res.json();
      setUsuarios(data);
    };
  
  const obtenerRutasDisponibles = async () => {
    const res = await fetch(API_URLS.permisosextrausuario, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getRutasDisponibles" })
    });
    const data = await res.json();
    setRutasDisponibles(data.map(d => d.ruta));
  };

  useEffect(() => {
    obtenerDatos();
    obtenerUsuarios();
    obtenerRutasDisponibles();
    registrarse()
  }, []);

  const agregarPermiso = async () => {
    if (!email || !ruta) {
      toast.error("Debe completar ambos campos.");
      return;
    }
    const res = await fetch(API_URLS.permisosextrausuario, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", email, ruta })
    });
    const result = await res.json();
    if (result.success) {
      toast.success("Permiso agregado");
      setEmail("");
      setRuta("");
      obtenerDatos();
    } else {
      toast.error("Error: " + result.error);
    }
  };

  const eliminarPermiso = async (id) => {
    const res = await fetch(API_URLS.permisosextrausuario, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id })
    });
    const result = await res.json();
    if (result.success) {
      toast.success("Permiso eliminado");
      obtenerDatos();
    } else {
      toast.error("Error: " + result.error);
    }
  };

    const seleccionarUsuario = (emailSeleccionado) => {
        const usuario = usuarios.find((u) => u.email === emailSeleccionado);
        if (usuario) {
        setEmail(usuario.email);
        setNombre(usuario.nombre || "");
        setIdPermisos(usuario.idPermisos || 0);
        }
    };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Permisos Extra por Usuario</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <select
            className="w-full p-2 mb-3 border border-gray-300 rounded"
            value={email}
            onChange={(e) => seleccionarUsuario(e.target.value)}
        >
            <option value="">Seleccionar usuario</option>
            {usuarios.map((u) => (
            <option key={u.email} value={u.email}>
                {u.email}
            </option>
            ))}
        </select>

        <select
          value={ruta}
          onChange={(e) => setRuta(e.target.value)}
          className="border p-2"
        >
          <option value="">Seleccionar ruta</option>
          {rutasDisponibles.map((ruta, index) => (
            <option key={index} value={ruta}>{ruta}</option>
          ))}
        </select>
      </div>
      <button onClick={agregarPermiso} className="bg-blue-600 text-white px-4 py-2 rounded">Agregar Permiso</button>

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Lista de permisos extra</h3>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Ruta</th>
              <th className="border px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.email}</td>
                <td className="border px-2 py-1">{item.ruta}</td>
                <td className="border px-2 py-1">
                  <button onClick={() => eliminarPermiso(item.id)} className="text-red-600"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}