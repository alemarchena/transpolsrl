import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api";
import { toast } from "react-toastify";
import SignatureCanvas from "react-signature-canvas";

export default function BonosListado({ usuario, onLogout }) {
  const [bonos, setBonos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [pdfSeleccionado, setPdfSeleccionado] = useState(null);
  const [mostrarFirma, setMostrarFirma] = useState(false);
  const sigCanvasRef = useRef(null);

  const normalizarUrl = (url) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // Si es relativa le anteponemos el host
  return `${window.location.origin}${url}`;
};

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Bonos listado')

  }

  const cargarBonos = async () => {
    setCargando(true);
    try {
      const res = await fetch(API_URLS.personasbonos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getByPersona", idPersona: usuario.id }),
      });

      const data = await res.json();
      if (data.success) {
        const bonosConUrl = data.data.map((b) => ({
          ...b,
          archivo_url: normalizarUrl(b.archivo_url),
        }));
        setBonos(bonosConUrl);
      } else {
        setBonos([]);
        toast.error(data.error || "No se pudieron cargar los bonos");
      }
    } catch (err) {
      setBonos([]);
      toast.error("Error cargando bonos");
    }
    setCargando(false);
  };

  const firmarPdf = async () => {
    if (!pdfSeleccionado) {
      toast.error("Seleccione un PDF para firmar");
      return;
    }

    const firmaBase64 = sigCanvasRef.current.toDataURL();
    if (!firmaBase64) {
      toast.error("Debe dibujar la firma");
      return;
    }

    setCargando(true);
    try {
      const res = await fetch(API_URLS.personasbonos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "firmarPdf",
          archivo_url: new URL(pdfSeleccionado).pathname, // solo el path
          firma: firmaBase64,
          usuario: `${usuario.nombre} ${usuario.apellido}`,
        }),
      });

      const text = await res.text(); // leemos texto crudo
      console.log("Respuesta cruda:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        toast.error("Respuesta no válida del servidor");
        return;
      }

      if (data.success) {
        toast.success("PDF firmado correctamente");

        // 👇 Normalizamos la URL para que sea absoluta
        setPdfSeleccionado(normalizarUrl(data.nuevoPdf));

        setMostrarFirma(false);
        cargarBonos();
      } else {
        toast.error(data.error || "Error al firmar");
      }
    } catch (err) {
      console.error("Error fetch:", err);
      toast.error("Error de conexión al firmar");
    }

    setCargando(false);
  };

  useEffect(() => {
    cargarBonos();
    registrarse()
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">
        Bienvenido {usuario.nombre} {usuario.apellido}
      </h2>
      <button
        className="text-red-600 underline mb-4"
        onClick={() => {
          setPdfSeleccionado(null);
          onLogout();
        }}
      >
        Cerrar sesión
      </button>

      {cargando ? (
        <p className="text-center">Cargando bonos...</p>
      ) : bonos.length === 0 ? (
        <p className="text-center text-gray-600">No hay bonos cargados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full border text-sm md:text-base">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Mes</th>
                  <th className="p-2 border">Año</th>
                  <th className="p-2 border">Estado</th>
                  <th className="p-2 border">Ver</th>
                </tr>
              </thead>
              <tbody>
                {bonos.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="border p-2">{b.mes}</td>
                    <td className="border p-2">{b.anio}</td>
                    <td className="border p-2 text-center">
                      {b.firmado_por ? (
                        <span className="text-green-600 text-xs">
                          Firmado por {b.firmado_por}
                          <br />
                          {b.firmado_fecha}
                        </span>
                      ) : (
                        <span className="text-red-600 text-xs">Pendiente</span>
                      )}
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => setPdfSeleccionado(b.archivo_url)}
                        className={`${
                          pdfSeleccionado === b.archivo_url
                            ? "bg-green-700"
                            : "bg-green-600 hover:bg-green-700"
                        } text-white px-3 py-1 rounded`}
                      >
                        Ver PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visor de PDF */}
          <div className="border rounded p-2 flex flex-col">
            {pdfSeleccionado ? (
              <>
                <div className="flex justify-between mb-2">
                  <a
                    href={pdfSeleccionado}
                    download
                    target="_blank" // 👈 abre en nueva pestaña (opcional)
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Descargar PDF
                  </a>
                  <button
                    onClick={() => setMostrarFirma(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Firmar
                  </button>
                </div>

                {/* 👇 Ahora React Router no intercepta la URL absoluta */}
                <iframe
                  key={pdfSeleccionado}
                  src={pdfSeleccionado}
                  title="Bono PDF"
                  width="100%"
                  height="500px"
                  className="border"
                ></iframe>
              </>
            ) : (
              <p className="text-gray-500 text-center mt-20">
                Seleccione un bono para ver el PDF
              </p>
            )}
          </div>

        </div>
      )}

      {/* Modal de firma */}
      {mostrarFirma && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Firme el documento</h3>
            <SignatureCanvas
              ref={sigCanvasRef}
              penColor="black"
              canvasProps={{ width: 400, height: 150, className: "border" }}
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={() => sigCanvasRef.current.clear()}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                Borrar
              </button>
              <button
                onClick={firmarPdf}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Confirmar firma
              </button>
              <button
                onClick={() => setMostrarFirma(false)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
