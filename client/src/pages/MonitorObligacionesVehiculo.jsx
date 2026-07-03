import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api"
import Loader from "../components/Loader"
import { formatearFechaDDMMYYYY } from "../utils/formatoFechas"
import { formatearHora } from "../utils/formatearHora"
import { FaSyncAlt } from "react-icons/fa"
import ExcelJS from "exceljs"
import jsPDF from "jspdf"

export default function MonitorObligacionesVehiculo() {
  const [datos, setDatos] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [busqueda, setBusqueda] = useState("")
  const [loading, setLoading] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null)
  const [filtro, setFiltro] = useState("todos")
  const [ordenCampo, setOrdenCampo] = useState("")
  const [ordenAsc, setOrdenAsc] = useState(true)
  const tablaRef = useRef()

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Monitor Obligaciones Vehículo')
  }

  const obtenerDatos = async () => {
    setLoading(true)
    const res = await fetch(API_URLS.monitoreovehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "get",
        page: paginaActual,
        busqueda,
        filtro,
        ordenCampo,
        ordenAsc,
      }),
    })

    const response = await res.json()
    setDatos(Array.isArray(response.data) ? response.data : [])
    setTotalPaginas(Math.ceil((response.total || 0) / 20))
    setUltimaActualizacion(new Date())
    setLoading(false)
  }

  const obtenerTodosDatos = async () => {
    const res = await fetch(API_URLS.monitoreovehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getAllForExport",
        busqueda,
        filtro,
        ordenCampo,
        ordenAsc,
      }),
    })

    const response = await res.json()
    return Array.isArray(response.data) ? response.data : []
  }

  const exportarExcel = async () => {
    setExportando(true)
    try {
      const todosLosDatos = await obtenerTodosDatos()

      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet("Obligaciones Vehículos")

      sheet.columns = [
        { header: "Nº Interno", key: "numerointerno", width: 12 },
        { header: "Patente", key: "patente", width: 12 },
        { header: "Marca", key: "marca", width: 15 },
        { header: "Modelo", key: "modelo", width: 20 },
        { header: "Año", key: "anio", width: 8 },
        { header: "Obligación", key: "obligacion", width: 30 },
        { header: "Cumple", key: "cumple", width: 10 },
        { header: "Estado", key: "estado", width: 20 },
        { header: "Fecha Vencimiento", key: "fechaVencimiento", width: 18 },
      ]

      todosLosDatos.forEach((d) => {
        sheet.addRow({
          numerointerno: d.numerointerno,
          patente: d.patente,
          marca: d.marca,
          modelo: d.modelo,
          anio: d.anio,
          obligacion: d.obligacion,
          cumple: d.lotiene === "0" ? "No" : "Sí",
          estado: d.estado,
          fechaVencimiento: formatearFechaDDMMYYYY(d.fechaVencimiento),
        })
      })

      const blob = await workbook.xlsx.writeBuffer()
      const a = document.createElement("a")
      a.href = URL.createObjectURL(new Blob([blob]))
      a.download = "obligaciones_vehiculos.xlsx"
      a.click()
    } catch (error) {
      console.error("Error al exportar Excel:", error)
      alert("Error al exportar a Excel")
    } finally {
      setExportando(false)
    }
  }

  const exportarPDF = async () => {
    setExportando(true)
    try {
      const todosLosDatos = await obtenerTodosDatos()

      const pdf = new jsPDF("l", "mm", "a4")

      // Título
      pdf.setFontSize(16)
      pdf.text("Monitor de Obligaciones de Vehículos", 14, 15)

      // Preparar datos para la tabla
      const columnas = [
        "Nº Interno",
        "Patente",
        "Marca",
        "Modelo",
        "Año",
        "Obligación",
        "Cumple",
        "Estado",
        "Fecha Venc.",
      ]

      const filas = todosLosDatos.map((d) => [
        d.numerointerno,
        d.patente,
        d.marca,
        d.modelo,
        d.anio,
        d.obligacion,
        d.lotiene === "0" ? "No" : "Sí",
        d.estado,
        formatearFechaDDMMYYYY(d.fechaVencimiento),
      ])

      let yPos = 25
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margins = 10

      const colWidths = [18, 20, 30, 35, 12, 50, 15, 40, 25] // Total: 245mm

      pdf.setFillColor(255, 255, 255)
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(8)
      pdf.setFont(undefined, "bold")

      let xPos = margins
      columnas.forEach((col, i) => {
        pdf.rect(xPos, yPos, colWidths[i], 8, "S") // Solo borde, sin relleno
        pdf.text(col, xPos + 2, yPos + 5)
        xPos += colWidths[i]
      })

      yPos += 8
      pdf.setFont(undefined, "normal")

      // Dibujar filas
      filas.forEach((fila, rowIndex) => {
        // Verificar si necesitamos nueva página
        if (yPos > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage()
          yPos = 20

          pdf.setFont(undefined, "bold")
          pdf.setTextColor(0, 0, 0)
          xPos = margins
          columnas.forEach((col, i) => {
            pdf.rect(xPos, yPos, colWidths[i], 8, "S")
            pdf.text(col, xPos + 2, yPos + 5)
            xPos += colWidths[i]
          })
          yPos += 8
          pdf.setFont(undefined, "normal")
        }

        xPos = margins

        fila.forEach((celda, i) => {
          pdf.rect(xPos, yPos, colWidths[i], 7, "S")
          pdf.setTextColor(0, 0, 0)
          const texto = String(celda)
          const maxWidth = colWidths[i] - 4
          pdf.text(texto, xPos + 2, yPos + 5, { maxWidth })
          xPos += colWidths[i]
        })

        yPos += 7
      })

      pdf.save("obligaciones_vehiculos.pdf")
    } catch (error) {
      console.error("Error al exportar PDF:", error)
      alert("Error al exportar a PDF")
    } finally {
      setExportando(false)
    }
  }

  const cambiarOrden = (campo) => {
    if (ordenCampo === campo) {
      setOrdenAsc(!ordenAsc)
    } else {
      setOrdenCampo(campo)
      setOrdenAsc(true)
    }
  }

  useEffect(() => {
    obtenerDatos()
  }, [paginaActual, busqueda, filtro, ordenCampo, ordenAsc])


  
  useEffect(() => {
    registrarse()
  }, [])

  
  const iconoOrden = (campo) => {
    if (ordenCampo !== campo) return ""
    return ordenAsc ? " ▲" : " ▼"
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">Monitor de Obligaciones de Vehículos</h2>
      {ultimaActualizacion && (
        <p className="text-sm text-gray-500 mb-2">Última actualización: {formatearHora(ultimaActualizacion)}</p>
      )}

      <div className="flex flex-wrap gap-4 mb-4 items-center justify-center">
        <input
          type="text"
          placeholder="Buscar por nº de interno, patente, marca, modelo, año u obligación"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value)
            setPaginaActual(1)
          }}
          className="border bg-lime-100 border-blue-500 px-3 py-2 rounded w-full md:w-1/3"
        />
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="border px-3 py-2 rounded text-sm">
          <option value="todos">Todos</option>
          <option value="vencidos">Vencidos</option>
          <option value="proximos">Próximos a vencer (30 días)</option>
        </select>
        <button
          onClick={obtenerDatos}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <FaSyncAlt /> Actualizar
        </button>
        <button
          onClick={exportarPDF}
          disabled={exportando}
          className={`px-4 py-2 rounded text-white ${
            exportando ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
          }`}
        >
          {exportando ? "Exportando..." : "PDF"}
        </button>
        <button
          onClick={exportarExcel}
          disabled={exportando}
          className={`px-4 py-2 rounded text-white ${
            exportando ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {exportando ? "Exportando..." : "Excel"}
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div id="tabla-mensaje" className="overflow-x-auto" ref={tablaRef}>
          <table className="min-w-full text-sm border border-gray-300 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 cursor-pointer" onClick={() => cambiarOrden("numerointerno")}>
                  Nº Interno{iconoOrden("numerointerno")}
                </th>
                <th className="border p-2 cursor-pointer" onClick={() => cambiarOrden("patente")}>
                  Patente{iconoOrden("patente")}
                </th>
                <th className="border p-2 cursor-pointer" onClick={() => cambiarOrden("marca")}>
                  Marca{iconoOrden("marca")}
                </th>
                <th className="border p-2 cursor-pointer" onClick={() => cambiarOrden("modelo")}>
                  Modelo{iconoOrden("modelo")}
                </th>
                <th className="border p-2 cursor-pointer" onClick={() => cambiarOrden("anio")}>
                  Año{iconoOrden("anio")}
                </th>
                <th className="border p-2 cursor-pointer" onClick={() => cambiarOrden("obligacion")}>
                  Obligación{iconoOrden("obligacion")}
                </th>
                <th className="border p-2 cursor-pointer" onClick={() => cambiarOrden("lotiene")}>
                  Cumple{iconoOrden("lotiene")}
                </th>
                <th className="border p-2 cursor-pointer" onClick={() => cambiarOrden("estado")}>
                  Estado{iconoOrden("estado")}
                </th>
                <th className="border p-2 cursor-pointer" onClick={() => cambiarOrden("fechaVencimiento")}>
                  Fecha{iconoOrden("fechaVencimiento")}
                </th>
              </tr>
            </thead>
            <tbody>
              {datos.map((d, index) => (
                <tr key={index}>
                  <td className="border p-2">{d.numerointerno}</td>
                  <td className="border p-2">{d.patente}</td>
                  <td className="border p-2">{d.marca}</td>
                  <td className="border p-2">{d.modelo}</td>
                  <td className="border p-2">{d.anio}</td>
                  <td className="border p-2">{d.obligacion}</td>
                  <td className="border p-2 text-center">{d.lotiene === "0" ? "No" : "Sí"}</td>
                  <td
                    className={`border p-2 text-white text-center ${
                      d.color === "red"
                        ? "bg-red-900 font-bold"
                        : d.color === "blue"
                          ? "bg-blue-700"
                          : d.color === "orange"
                            ? "bg-orange-500"
                            : d.color === "yellow"
                              ? "bg-yellow-600"
                              : d.color === "green"
                                ? "bg-green-700"
                                : "bg-black"
                    }`}
                  >
                    {d.estado}
                  </td>
                  <td className="border p-2">{formatearFechaDDMMYYYY(d.fechaVencimiento)}</td>
                </tr>
              ))}
              {datos.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center p-4 text-gray-500">
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
              className={`px-3 py-1 rounded ${paginaActual === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
