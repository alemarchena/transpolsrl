import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api";
import { toast } from "react-toastify";

export default function EditarPermisoUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [idPermisos, setIdPermisos] = useState(0);

  useEffect(() => {
    obtenerUsuarios();
    obtenerPermisos();
    registrarse()
  }, []);

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Permisos Extra por Modulos')
  }

  const obtenerUsuarios = async () => {
    const res = await fetch(API_URLS.permisospormodulo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getUsuarios" }),
    });
    const data = await res.json();
    setUsuarios(data);
  };

  const obtenerPermisos = async () => {
    const res = await fetch(API_URLS.permisospormodulo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getPermisos" }),
    });
    const data = await res.json();
    setPermisos(data);
  };

  const seleccionarUsuario = (emailSeleccionado) => {
    const usuario = usuarios.find((u) => u.email === emailSeleccionado);
    if (usuario) {
      setEmail(usuario.email);
      setNombre(usuario.nombre || "");
      setIdPermisos(usuario.idPermisos || 0);
    }
  };

  const guardarCambios = async () => {
    const res = await fetch(API_URLS.permisospormodulo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "actualizar",
        email,
        nombre,
        idPermisos,
      }),
    });
    const result = await res.json();
    if (result.success) toast.success("Datos actualizados");
    else toast.error("Error: " + result.error);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Configuración de Permisos por módulo</h1>

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

      {email && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 font-semibold">Nombre</label>
            <input
              className="border p-2 w-full rounded"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Grupo de Permisos</label>
            <select
              className="border p-2 w-full rounded"
              value={idPermisos}
              onChange={(e) => setIdPermisos(Number(e.target.value))}
            >
              <option value={0}>Solo permisos extra (ID 0)</option>
              {permisos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <button
              onClick={guardarCambios}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
