import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api";
import Loader from "../components/Loader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { formatearFechaDDMMYYYY } from "../utils/formatoFechas";
import {formatearHora} from '../utils/formatearHora';
import { FaSyncAlt } from "react-icons/fa"; // Asegúrate de tener esta librería instalada

export default function MonitorObligacionesRol() {
  const [datos, setDatos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [filtro, setFiltro] = useState("todos");

    const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Monitor de Obligaciones Rol')
  }

  const obtenerDatos = async () => {
    setLoading(true);
    const res = await fetch(API_URLS.monitoreorol, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "get",
        page: paginaActual,
        busqueda,
        filtro
      }),
    });

    const response = await res.json();
    setDatos(Array.isArray(response.data) ? response.data : []);
    setTotalPaginas(Math.ceil((response.total || 0) / 20));
    setUltimaActualizacion(new Date());
    setLoading(false);
  };

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Monitoreo");

    sheet.columns = [
      { header: "Persona", key: "persona" },
      { header: "Rol", key: "rol" },
      { header: "Obligación", key: "obligacion" },
      { header: "Fecha", key: "fecha" },
      { header: "Cumple obligación", key: "lotiene" },
      { header: "Estado", key: "estado" },
    ];

    datos.forEach((d) => {
      sheet.addRow({
        persona: d.persona,
        rol: d.rol,
        obligacion: d.obligacion,
        fecha: formatearFechaDDMMYYYY(d.fechaVencimiento),
        lotiene: d.lotiene === "1" ? "Sí" : "No",
        estado: d.estado,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "monitoreo-obligaciones.xlsx");
  };

  const exportarPDF = () => {
    const input = document.getElementById("tabla-mensaje");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("monitoreo-obligaciones.pdf");
    });
  };

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (document.visibilityState === "visible") obtenerDatos();
    }, 300000);
    return () => clearInterval(intervalo);
  }, [paginaActual, busqueda, filtro]);

  useEffect(() => {
    obtenerDatos();
  }, [paginaActual, busqueda, filtro]);

  useEffect(() => {
      registrarse();
    }, []);
    
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">Monitor de Obligaciones de Rol</h2>
      {ultimaActualizacion && (
        <p className="text-sm text-gray-500 mb-2">
          Última actualización: {formatearHora(ultimaActualizacion)}
        </p>
      )}

      <div className="flex flex-wrap gap-4 mb-4 items-center justify-center">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
          className="border bg-lime-100 border-blue-500 px-3 py-2 rounded w-full md:w-1/3"
        />
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="todos">Todos</option>
          <option value="vencidos">Vencidos</option>
          <option value="proximos">Próximos a vencer (30 días)</option>
        </select>
        <button
          onClick={obtenerDatos}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <FaSyncAlt />
          Actualizar
        </button>
        <button
          onClick={exportarPDF}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          PDF
        </button>
        <button
          onClick={exportarExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Excel
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div id="tabla-mensaje" className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Persona</th>
                <th className="border p-2">Obligación</th>
                <th className="border p-2">Cumple Obligación</th>
                <th className="border p-2">Estado</th>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Rol</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((d, index) => (
                <tr key={index}>
                  <td className="border p-2">{d.persona}</td>
                  <td className="border p-2">{d.obligacion}</td>
                   <td className="border p-2 text-center">
                    {d.lotiene === "0" ? "No" : "Sí"}
                  </td>
                  <td
                    className={`border p-2 text-white text-center ${
                      d.color === "red"
                        ? "bg-red-600 font-bold"
                        : d.color === "blue"
                        ? "bg-blue-700"
                        : d.color === "green"
                        ? "bg-green-700"
                        : "bg-black"
                    }`}
                  >
                    {d.estado}
                  </td>
                  <td className="border p-2">
                    {formatearFechaDDMMYYYY(d.fechaVencimiento)}
                  </td>
                  <td className="border p-2">{d.rol}</td>
                 
                  
                </tr>
              ))}
              {datos.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No hay datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="mt-4 flex justify-center gap-2 flex-wrap">
          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPaginaActual(i + 1)}
              className={`px-3 py-1 rounded ${
                paginaActual === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
