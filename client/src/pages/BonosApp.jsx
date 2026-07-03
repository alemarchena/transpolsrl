import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api";
import { toast } from "react-toastify";
import BonosListado from "./BonosListado";
import BonosSetClave from "./BonosSetClave";

export default function BonosApp() {
  const [dni, setDni] = useState("");
  const [clave, setClave] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modoSetClave, setModoSetClave] = useState(false);

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Bonos App')

  }

  // Cargar lista de personas
  const obtenerPersonas = async () => {
    try {
      const res = await fetch(API_URLS.personas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get" }),
      });
      const data = await res.json();
      if (Array.isArray(data)) setPersonas(data);
    } catch (err) {
      toast.error("Error cargando personas");
    }
  };

  useEffect(() => {
    obtenerPersonas();
    registrarse()
  }, []);

  const login = async () => {
    if (!dni || !clave) {
      toast.error("Seleccione persona y clave");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_URLS.personasbonos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", dni, clave }),
      });

      const data = await res.json();
      if (data.success) {
        setUsuario(data.data);
      } else {
        if (data.error === "Debe crear su clave") {
          toast.info("Su clave fue reseteada o no existe. Cree una nueva.");
          setModoSetClave(true);
        } else {
          toast.error(data.error || "Error en el login");
        }
      }
    } catch (err) {
      toast.error("Error de conexión con el servidor");
    }
    setLoading(false);
  };

  if (modoSetClave) {
    return <BonosSetClave dniInicial={dni} onVolver={() => setModoSetClave(false)} />;
  }

  if (usuario) {
    return <BonosListado usuario={usuario} onLogout={() => setUsuario(null)} />;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center pb-2">Transpol S.R.L</h1>

      <h2 className="text-2xl font-bold text-center mb-6">
        Acceso a Bonos de Sueldo
      </h2>

      <select
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      >
        <option value="">Seleccione su nombre</option>
        {personas.map((p) => (
          <option key={p.id} value={p.dni}>
            {p.apellido}, {p.nombre}
          </option>
        ))}
      </select>

      <input
        type="password"
        placeholder="Clave"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <button
        onClick={login}
        disabled={loading}
        className={`w-full font-semibold p-2 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>

      <p className="text-center mt-4 text-sm">
        ¿Primera vez o quiere cambiar su clave?{" "}
        <button
          className="text-blue-600 underline"
          onClick={() => setModoSetClave(true)}
        >
          Crear/Modificar clave
        </button>
      </p>
    </div>
  );
}
