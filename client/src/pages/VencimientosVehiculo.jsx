import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api";
import Loader from "../components/Loader";
import { toast } from 'react-toastify';
import { FaSyncAlt, FaTrash } from "react-icons/fa";

export default function VencimientosVehiculo() {
  const [vehiculos, setVehiculos] = useState([]);
  const [obligaciones, setObligaciones] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState("");
  const [loading, setLoading] = useState(false);
  const [fechas, setFechas] = useState({});

  const [vehiculosSeleccionados, setVehiculosSeleccionados] = useState([]);

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Vencimiento de Vehiculos')
  }

  const obtenerVehiculos = async () => {
    setLoading(true);
    const res = await fetch(API_URLS.vehiculos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    });
    const data = await res.json();
    setVehiculos(data);
    setLoading(false);
  };

  const obtenerObligaciones = async (idVehiculo) => {
    if (!idVehiculo) return;
    setLoading(true);
    const res = await fetch(API_URLS.vencimientosvehiculo, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", idVehiculo }),
    });
    const data = await res.json();

    const fechasIniciales = {};
    const obligacionesConvertidas = data.map((o) => {
      fechasIniciales[o.idObligacionVehiculo] = o.fecha || "";
      return {
        ...o,
        loTiene: Number(o.loTiene) === 1,
      };
    });

    setObligaciones(obligacionesConvertidas);
    setFechas(fechasIniciales);
    setLoading(false);
  };

  const handleVehiculoChange = (e) => {
    const id = e.target.value;
    setVehiculoSeleccionado(id);
    obtenerObligaciones(id);
  };

  const handleFechaChange = (idObligacionVehiculo, nuevaFecha) => {
    setFechas((prev) => ({ ...prev, [idObligacionVehiculo]: nuevaFecha }));
  };

  const guardarVencimiento = async (item) => {
    const fecha = fechas[item.idObligacionVehiculo];

    if (fecha !== "") {
      if (!fecha) {
        toast.error("Seleccioná una fecha válida.");
        return;
      }
    }

    setLoading(true);
    const res = await fetch(API_URLS.vencimientosvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: item.idVencimiento ? "update" : "insert",
        id: item.idVencimiento,
        idVehiculo: vehiculoSeleccionado,
        idObligacionVehiculo: item.idObligacionVehiculo,
        fecha,
        loTiene: Number(item.loTiene),
      }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success(item.idVencimiento ? "Actualizado correctamente." : "Registrado correctamente.");
      obtenerObligaciones(vehiculoSeleccionado);
    } else {
      toast.error("Error al guardar");
    }
    setLoading(false);
  };

  const eliminarVencimiento = async (id) => {
    if (!id) return;
    setLoading(true);
    const res = await fetch(API_URLS.vencimientosvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Eliminado");
      obtenerObligaciones(vehiculoSeleccionado);
    } else {
      toast.error("Error al eliminar");
    }
    setLoading(false);
  };

  useEffect(() => {
    obtenerVehiculos();
    registrarse()
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Vencimientos por Vehículo</h2>
      {loading && <Loader />}

      <div className="mb-4 flex flex-col items-center justify-center gap-4">
        <label className="block font-semibold mb-1">Seleccionar Vehículo</label>
        <select
          value={vehiculoSeleccionado}
          onChange={handleVehiculoChange}
          className="w-full md:w-1/2 border rounded px-3 py-2"
        >
          <option value="">Seleccione un vehículo...</option>
          {vehiculos.map((v, index) => (
            <option key={`${v.id}-${index}`} value={v.id}>
              {v.numerointerno + " - " +v.patente + " - " + v.marca}
            </option>
          ))}
        </select>
      </div>

      {vehiculoSeleccionado && (
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
                  <tr key={`ob-${item.idObligacionVehiculo}-${item.idVencimiento || index}`}>
                    <td className="border p-2 flex flex-col gap-1">
                      {item.nombre}
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={Boolean(item.loTiene)}
                          onChange={(e) =>
                            setObligaciones((prev) =>
                              prev.map((o) =>
                                o.idObligacionVehiculo === item.idObligacionVehiculo
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
                        value={fechas[item.idObligacionVehiculo] || ""}
                        onChange={(e) =>
                          handleFechaChange(item.idObligacionVehiculo, e.target.value)
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
                    No hay obligaciones con vencimiento para este vehículo
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
