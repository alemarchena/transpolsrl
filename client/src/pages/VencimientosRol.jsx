import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api";
import Loader from "../components/Loader";
import { toast } from 'react-toastify';
import { FaSyncAlt, FaTrash } from "react-icons/fa";
import { nombreCompleto } from "../utils/capitalizarTexto";

export default function VencimientosRol() {
  const [personas, setPersonas] = useState([]);
  const [obligaciones, setObligaciones] = useState([]);
  const [personaSeleccionada, setPersonaSeleccionada] = useState("");
  const [loading, setLoading] = useState(false);
  const [fechas, setFechas] = useState({});

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Vencimiento del Rol')
  }

  const obtenerPersonas = async () => {
    setLoading(true);
    const res = await fetch(API_URLS.personas, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    });
    const data = await res.json();
    setPersonas(data);
    setLoading(false);
  };

  const obtenerObligaciones = async (idPersona) => {
    if (!idPersona) return;
    setLoading(true);
    const res = await fetch(API_URLS.vencimientosrol, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", idPersona }),
    });
    const data = await res.json();

    // Convertir loTiene a booleano y setear fechas
    const fechasIniciales = {};
    const obligacionesConvertidas = data.map((o) => {
    fechasIniciales[o.idObligacionRol] = o.fecha || "";
        return {
            ...o,
            loTiene: Number(o.loTiene) === 1, // ✅ siempre compara numéricamente
        };
    });


    setObligaciones(obligacionesConvertidas);
    setFechas(fechasIniciales);
    setLoading(false);
    };


  const handlePersonaChange = (e) => {
    const id = e.target.value;
    setPersonaSeleccionada(id);
    obtenerObligaciones(id);
  };

  const handleFechaChange = (idObligacionRol, nuevaFecha) => {
    setFechas((prev) => ({ ...prev, [idObligacionRol]: nuevaFecha }));
  };

  const guardarVencimiento = async (item) => {
    const fecha = fechas[item.idObligacionRol];

    if(fecha != ""){
      if ( !fecha) {
        toast.error("Seleccioná una fecha válida con año actual o posterior.");
        return;
      }
    }
   
    setLoading(true);
    const res = await fetch(API_URLS.vencimientosrol, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: item.idVencimiento ? "update" : "insert",
        id: item.idVencimiento,
        idPersona: personaSeleccionada,
        idObligacionRol: item.idObligacionRol,
        fecha,
        loTiene: Number(item.loTiene), 
      }),
    });

    const data = await res.json();
    if (data.success) {
      item.idVencimiento ? toast.success("Actualizado correctamente.") : toast.success("Registrado correctamente.");
      obtenerObligaciones(personaSeleccionada); // Recargar lista
    } else {
      toast.success("Error al guardar");
    }
    setLoading(false);
  };

  const eliminarVencimiento = async (id) => {
    if (!id) return;
    setLoading(true);
    const res = await fetch(API_URLS.vencimientosrol, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Eliminado");
      obtenerObligaciones(personaSeleccionada);
    } else {
      toast.error("Error al eliminar");
    }
    setLoading(false);
  };

  useEffect(() => {
    obtenerPersonas();
    registrarse()
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Vencimientos por Rol</h2>
      {loading && <Loader />}

      <div className="mb-4 flex flex-col items-center justify-center gap-4 ">
        <label className="block font-semibold mb-1">Seleccionar Persona</label>
        <select
          value={personaSeleccionada}
          onChange={handlePersonaChange}
          className="w-full md:w-1/2 border rounded px-3 py-2"
        >
          <option value="">Seleccione una persona...</option>
          {personas.map((p, index) => (
            <option key={`${p.id}-${p.dni}-${index}`} value={p.id}>
              {nombreCompleto(p.apellido, p.nombre)} - DNI: {p.dni}
            </option>
          ))}
        </select>
      </div>

      {personaSeleccionada && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Obligación</th>
                <th className="p-2 border">Vencimiento</th>
                <th className="p-2 border text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
  {obligaciones.length > 0 ? (
    obligaciones.map((item, index) => (
      <tr key={`ob-${item.idObligacionRol}-${item.idVencimiento || index}`}>
        <td className="border p-2 flex flex-col gap-1">
          {item.nombre}
          <label className="flex items-center gap-2 text-sm">
            <input
                type="checkbox"
                checked={Boolean(item.loTiene)}
                onChange={(e) =>
                    setObligaciones((prev) =>
                    prev.map((o) =>
                        o.idObligacionRol === item.idObligacionRol
                        ? { ...o, loTiene: e.target.checked }
                        : o
                    )
                    )
                }
            />

            Lo Tiene
          </label>
        </td>

        <td className="border p-2">
          <input
            type="date"
            value={fechas[item.idObligacionRol] || ""}
            onChange={(e) =>
              handleFechaChange(item.idObligacionRol, e.target.value)
            }
            className="border px-2 py-1 rounded w-full"
          />
        </td>

        <td className="border p-2 text-center flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => guardarVencimiento(item)}
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            {item.idVencimiento ? "Actualizar" : "Guardar"}
          </button>
          {item.idVencimiento && (
            <button
              onClick={() => eliminarVencimiento(item.idVencimiento)}
              className="bg-red-600 text-white px-2 py-2 rounded hover:bg-red-700"
            >
                <FaTrash />
            </button>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="text-center p-4 text-gray-500">
        No hay obligaciones con vencimiento para este rol
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
}
