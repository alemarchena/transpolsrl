import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api"
import Loader from "../components/Loader"
import { formatearFechaHoraSQL } from "../utils/formatoFechas"
import ExcelJS from "exceljs"

export default function MonitorServicios() {
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("Todos")

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Monitor de Servicios')
  }

  const obtenerDatos = async () => {
    setLoading(true)
    const res = await fetch(API_URLS.monitorservicios, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get", busqueda }),
    })
    const data = await res.json()
    setDatos(Array.isArray(data.data) ? data.data : [])
    setLoading(false)
  }

  const datosFiltrados = datos.filter((d) => {
    if (filtroEstado === "Todos") return true
    return d.estado === filtroEstado
  })

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Monitor de Servicios")

    sheet.columns = [
      { header: "Vehículo", key: "vehiculo", width: 35 },
      { header: "KM Actual", key: "kmActual", width: 12 },
      { header: "Servicio Monitoreable", key: "servicioMonitoreable", width: 25 },
      { header: "Artículo", key: "articulo", width: 20 },
      { header: "Acumulable", key: "acumulable", width: 12 },
      { header: "Último Servicio KM", key: "ultimoKm", width: 18 },
      { header: "Fecha Último Servicio", key: "fechaUltimo", width: 20 },
      { header: "KM Acumulados", key: "kmAcumulados", width: 15 },
      { header: "Próximo Servicio KM", key: "proximoKm", width: 18 },
      { header: "KM Faltantes", key: "kmFaltantes", width: 15 },
      { header: "Días Estimados", key: "diasFaltantes", width: 15 },
      { header: "Estado", key: "estado", width: 12 },
    ]

    datosFiltrados.forEach((d) => {
      sheet.addRow({
        vehiculo: `${d.numerointerno ? `[${d.numerointerno}] ` : ""}${d.patente} - ${d.marca} ${d.modelo}`,
        kmActual: d.kmActual,
        servicioMonitoreable: d.nombreServicioMonitoreable || "N/A",
        articulo: d.nombreArticulo,
        acumulable: d.esAcumulable == 1 ? "Sí" : "No",
        ultimoKm: d.ultimoKmServicio,
        fechaUltimo: d.fechaUltimoServicio ? formatearFechaHoraSQL(d.fechaUltimoServicio) : "Sin registro",
        kmAcumulados: d.esAcumulable == 1 && d.kmAcumulados !== null ? d.kmAcumulados : "N/A",
        proximoKm: d.esAcumulable != 1 && d.kmProximoServicio !== null ? d.kmProximoServicio : "N/A",
        kmFaltantes: d.esAcumulable != 1 && d.kmFaltantes !== null ? d.kmFaltantes : "N/A",
        diasFaltantes: d.esAcumulable != 1 && d.diasFaltantes !== null ? d.diasFaltantes : "N/A",
        estado: d.estado,
      })
    })

    const blob = await workbook.xlsx.writeBuffer()
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([blob]))
    a.download = "monitor_servicios.xlsx"
    a.click()
  }

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case "Vencido":
        return "bg-red-500 text-white"
      case "Urgente":
        return "bg-orange-500 text-white"
      case "Próximo":
        return "bg-yellow-500 text-black"
      case "Al día":
        return "bg-green-500 text-white"
      case "Sin datos":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  useEffect(() => {
    obtenerDatos()
    registrarse()
  }, [])

  const resumenEstados = {
    Vencido: datos.filter((d) => d.estado === "Vencido").length,
    Urgente: datos.filter((d) => d.estado === "Urgente").length,
    Próximo: datos.filter((d) => d.estado === "Próximo").length,
    "Al día": datos.filter((d) => d.estado === "Al día").length,
    "Sin datos": datos.filter((d) => d.estado === "Sin datos").length,
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Monitor de Servicios</h2>

      {/* Resumen de estados */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <div className="text-red-700 font-bold text-2xl">{resumenEstados.Vencido}</div>
          <div className="text-red-600 text-sm">Vencidos</div>
        </div>
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4 rounded">
          <div className="text-orange-700 font-bold text-2xl">{resumenEstados.Urgente}</div>
          <div className="text-orange-600 text-sm">Urgentes (≤7 días)</div>
        </div>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
          <div className="text-yellow-700 font-bold text-2xl">{resumenEstados.Próximo}</div>
          <div className="text-yellow-600 text-sm">Próximos (≤30 días)</div>
        </div>
        <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
          <div className="text-green-700 font-bold text-2xl">{resumenEstados["Al día"]}</div>
          <div className="text-green-600 text-sm">Al día</div>
        </div>
        <div className="bg-gray-100 border-l-4 border-gray-500 p-4 rounded">
          <div className="text-gray-700 font-bold text-2xl">{resumenEstados["Sin datos"]}</div>
          <div className="text-gray-600 text-sm">Sin datos</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          className="border p-2 bg-lime-100 border-blue-500 rounded flex-1"
          placeholder="Ej: [18] AE893IL - Buscar por número interno, patente, marca..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="border p-2 bg-lime-100 border-blue-500 rounded"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="Todos">Todos los estados</option>
          <option value="Vencido">Vencido</option>
          <option value="Urgente">Urgente</option>
          <option value="Próximo">Próximo</option>
          <option value="Al día">Al día</option>
          <option value="Sin datos">Sin datos</option>
        </select>
        <button onClick={obtenerDatos} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Buscar
        </button>
        <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Excel
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <Loader mensaje="Cargando monitor de servicios..." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Vehículo</th>
                <th className="p-2 border">KM Actual</th>
                <th className="p-2 border">Servicio Monitoreable</th>
                <th className="p-2 border">Artículo</th>
                <th className="p-2 border">Último Servicio</th>
                <th className="p-2 border bg-purple-100">KM Acumulados</th>
                <th className="p-2 border bg-blue-100">Próximo en KM</th>
                <th className="p-2 border bg-blue-100">KM Faltantes</th>
                <th className="p-2 border bg-blue-100">Días Estimados</th>
                <th className="p-2 border">Estado</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map((d, i) => (
                <tr key={i} className="text-center border-t hover:bg-gray-50">
                  <td className="p-2 border">
                    <div className="font-semibold">
                      {`${d.numerointerno ? `[${d.numerointerno}] ` : ""}${d.patente} - ${d.marca} ${d.modelo}`}
                    </div>
                    <div className="text-xs text-gray-600">Año: {d.anio}</div>
                  </td>
                  <td className="p-2 border font-semibold">
                    {d.kmActual !== null && d.kmActual !== undefined ? d.kmActual.toLocaleString() : "-"}
                  </td>
                  <td className="p-2 border">
                    <span
                      className={`${d.esAcumulable == 1 ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"} px-2 py-1 rounded text-xs font-semibold`}
                    >
                      {d.nombreServicioMonitoreable || "N/A"}
                    </span>
                  </td>
                  <td className="p-2 border">{d.nombreArticulo}</td>
                  <td className="p-2 border">
                    <div>{d.ultimoKmServicio !== null ? `${d.ultimoKmServicio.toLocaleString()} km` : "-"}</div>
                    <div className="text-xs text-gray-600">
                      {d.fechaUltimoServicio ? formatearFechaHoraSQL(d.fechaUltimoServicio) : "Sin registro"}
                    </div>
                  </td>
                  <td className="p-2 border bg-purple-50">
                    {d.esAcumulable == 1 ? (
                      <span className="font-bold text-purple-700">
                        {d.kmAcumulados !== null && d.kmAcumulados !== undefined
                          ? d.kmAcumulados.toLocaleString()
                          : "-"}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-2 border bg-blue-50 font-semibold">
                    {d.esAcumulable != 1 ? (
                      d.kmProximoServicio !== null ? (
                        d.kmProximoServicio.toLocaleString()
                      ) : (
                        <span className="line-through text-red-600">-</span>
                      )
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-2 border bg-blue-50">
                    {d.esAcumulable != 1 ? (
                      d.kmFaltantes !== null ? (
                        <span className={d.kmFaltantes <= 0 ? "text-red-600 font-bold" : ""}>
                          {d.kmFaltantes.toLocaleString()}
                        </span>
                      ) : (
                        <span className="line-through text-red-600">-</span>
                      )
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-2 border bg-blue-50">
                    {d.esAcumulable != 1 ? (
                      d.diasFaltantes !== null ? (
                        <>
                          <span className={d.diasFaltantes <= 7 ? "font-bold" : ""}>
                            {d.diasFaltantes > 0 ? `${d.diasFaltantes} días` : "-"}
                          </span>
                          {d.promedioKmPorDia !== null && d.promedioKmPorDia !== undefined && (
                            <div className="text-xs text-gray-600">({d.promedioKmPorDia} km/día)</div>
                          )}
                        </>
                      ) : (
                        <span className="line-through text-red-600">-</span>
                      )
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getEstadoBadgeColor(d.estado)}`}>
                      {d.estado}
                    </span>
                  </td>
                </tr>
              ))}
              {datosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    No hay datos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
