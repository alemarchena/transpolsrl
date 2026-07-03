import { useState } from "react";
import { API_URLS } from "../api/api";
import { toast } from "react-toastify";

export default function BonosSetClave({ onVolver }) {
  const [dni, setDni] = useState("");
  const [claveActual, setClaveActual] = useState(""); // clave actual opcional
  const [claveNueva, setClaveNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [cargando, setCargando] = useState(false);

  const guardarClave = async () => {
    if (!dni || !claveNueva || !confirmar) {
      toast.error("Complete todos los campos");
      return;
    }
    if (claveNueva !== confirmar) {
      toast.error("Las claves no coinciden");
      return;
    }

    setCargando(true);
    try {
      const res = await fetch(API_URLS.personasbonos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setClave",
          dni,
          claveActual,     // se envía aunque esté vacío (si es primera vez)
          claveNueva,      // nueva clave
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Clave guardada con éxito");
        onVolver();
      } else {
        toast.error(data.error || "Error al guardar clave");
      }
    } catch (err) {
      toast.error("Error de conexión");
    }
    setCargando(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-center mb-6">
        Crear / Modificar Clave
      </h2>

      <input
        type="text"
        placeholder="DNI"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        autoComplete="new-dni"
        className="w-full p-2 border rounded mb-3"
      />

      <input
        type="password"
        placeholder="Clave actual (si ya tiene sino en blanco)"
        value={claveActual}
        onChange={(e) => setClaveActual(e.target.value)}
        autoComplete="new-password"
        className="w-full p-2 border rounded mb-3"
      />

      <input
        type="password"
        placeholder="Nueva clave"
        value={claveNueva}
        onChange={(e) => setClaveNueva(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />
      <input
        type="password"
        placeholder="Confirmar clave"
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <button
        onClick={guardarClave}
        disabled={cargando}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-2 rounded"
      >
        {cargando ? "Guardando..." : "Guardar"}
      </button>

      <p className="text-center mt-4 text-sm">
        <button className="text-blue-600 underline" onClick={onVolver}>
          Volver al login
        </button>
      </p>
    </div>
  );
}
