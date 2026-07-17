import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api"
import { FaSyncAlt, FaDownload } from "react-icons/fa"
import Loader from "../components/Loader"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import ExcelJS from "exceljs"
import { formatearFechaHora } from "../utils/formatoFechas"
import { capitalizarTexto } from "../utils/capitalizarTexto";
import { toast } from "react-toastify"
import autoTable from "jspdf-autotable"

export default function MonitorBonos() {
  const [datos, setDatos] = useState([])
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [mesInicio, setMesInicio] = useState(() => {
    const mesActual = new Date().getMonth() // 0-11
    return mesActual === 0 ? 12 : mesActual // Si enero, usar diciembre, sino mes anterior
  })
  const [mesFin, setMesFin] = useState(new Date().getMonth() + 1)
  const [pagina, setPagina] = useState(1)
  const [total, setTotal] = useState(0)
  const [estadisticas, setEstadisticas] = useState({
    firmados: 0,
    pendientes: 0,
    total: 0,
  })
  const [limite] = useState(20)
  const [loading, setLoading] = useState(false)

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
    if(yaregistrado.current) return
    yaregistrado.current = true
    const emaillocal = getEmailFromLocalStorage()
    if(!emaillocal) return
    registrarIngreso(API_URLS.usuarios,emaillocal,'Monitor de bonos')
  }

  const obtenerDatos = async () => {
    // Validaciones: si no hay año o el mesInicio > mesFin no hacemos nada
    if (!anio || mesInicio > mesFin) {
      setDatos([])
      setTotal(0)
      setEstadisticas({ firmados: 0, pendientes: 0, total: 0 })
      return
    }

    setLoading(true)
    try {
      const timestamp = Date.now()
      const res = await fetch(`${API_URLS.monitorbonos}?t=${timestamp}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        body: JSON.stringify({
          action: "get",
          anio: Number.parseInt(anio),
          mesInicio,
          mesFin,
          pagina,
          limite,
        }),
      })
      const data = await res.json()

      const resEstadisticas = await fetch(`${API_URLS.monitorbonos}?t=${timestamp + 1}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        body: JSON.stringify({
          action: "getEstadisticas",
          anio: Number.parseInt(anio),
          mesInicio,
          mesFin,
        }),
      })
      const dataEstadisticas = await resEstadisticas.json()

      // Capitalizar nombres en los datos paginados
      if (data.success && Array.isArray(data.data)) {
        data.data.forEach(item => {
          if (item.persona) {
            const partes = item.persona.split(', ')
            if (partes.length === 2) {
              const apellidoCapitalizado = capitalizarTexto(partes[0])
              const nombreCapitalizado = capitalizarTexto(partes[1])
              item.persona = `${apellidoCapitalizado}, ${nombreCapitalizado}`
            } else {
              item.persona = capitalizarTexto(item.persona)
            }
          }
        })
      }

      if (data.success && Array.isArray(data.data)) {
        setDatos(data.data)
        setTotal(data.total || 0)

        if (dataEstadisticas.success) {
          const nuevasEstadisticas = {
            firmados: dataEstadisticas.estadisticas?.firmados || 0,
            pendientes: dataEstadisticas.estadisticas?.pendientes || 0,
            total: dataEstadisticas.estadisticas?.total || 0,
          }
          setEstadisticas(nuevasEstadisticas)
        } else {
          setEstadisticas({
            firmados: 0,
            pendientes: 0,
            total: data.total || 0,
          })
        }
      } else {
        setDatos([])
        setTotal(0)
        setEstadisticas({ firmados: 0, pendientes: 0, total: 0 })
      }
    } catch (error) {
      console.error("[v0] Error cargando datos:", error)
      setDatos([])
      setTotal(0)
      setEstadisticas({ firmados: 0, pendientes: 0, total: 0 })
    }
    setLoading(false)
  }

  // Función para obtener TODOS los datos sin paginación
  const obtenerTodosLosDatos = async () => {
    try {
      const timestamp = Date.now()
      const res = await fetch(`${API_URLS.monitorbonos}?t=${timestamp}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        body: JSON.stringify({
          action: "get",
          anio: Number.parseInt(anio),
          mesInicio,
          mesFin,
          pagina: 1,
          limite: 999999,
        }),
      })
      const data = await res.json()
      
      if (data.success && Array.isArray(data.data)) {
        data.data.forEach(item => {
          if (item.persona) {
            const partes = item.persona.split(', ')
            if (partes.length === 2) {
              const apellidoCapitalizado = capitalizarTexto(partes[0])
              const nombreCapitalizado = capitalizarTexto(partes[1])
              item.persona = `${apellidoCapitalizado}, ${nombreCapitalizado}`
            } else {
              item.persona = capitalizarTexto(item.persona)
            }
          }
        })
      }
      
      return data.success && Array.isArray(data.data) ? data.data : []
    } catch (error) {
      console.error("Error obteniendo todos los datos:", error)
      return []
    }
  }

  const exportarPDF = async () => {
    const todosLosDatos = await obtenerTodosLosDatos()
    if (todosLosDatos.length === 0) {
      toast.warning("No hay datos para exportar")
      return
    }

    setLoading(true)
    try {
      // Crear PDF en orientación landscape
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      
      // Título
      pdf.setFontSize(18)
      pdf.setTextColor(31, 41, 55)
      pdf.text("Monitoreo de Bonos", 14, 15)
      
      // Subtítulo con período
      pdf.setFontSize(12)
      pdf.setTextColor(55, 65, 81)
      pdf.text(`Período: ${meses[mesInicio - 1]} - ${meses[mesFin - 1]} de ${anio}`, 14, 25)
      
      // Preparar datos para la tabla
      const tableData = todosLosDatos.map(d => [
        d.persona,
        d.mes || '-',
        d.anio || '-',
        d.firmado_por ? 'Firmado' : 'Pendiente',
        d.firmado_fecha ? formatearFechaHora(d.firmado_fecha) : '-'
      ])
      
      // Crear tabla automática
      autoTable(pdf, {
        startY: 32,
        head: [['Persona', 'Mes', 'Año', 'Estado', 'Fecha Firma']],
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [243, 244, 246],
          textColor: [31, 41, 55],
          fontStyle: 'bold',
          halign: 'center',
        },
        bodyStyles: {
          valign: 'middle',
        },
        columnStyles: {
          0: { cellWidth: 70 }, // Persona
          1: { cellWidth: 30 }, // Mes
          2: { cellWidth: 25 }, // Año
          3: { cellWidth: 35 }, // Estado
          4: { cellWidth: 50 }, // Fecha Firma
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        margin: { top: 32, right: 14, bottom: 20, left: 14 },
        didDrawPage: function(data) {
          // Resumen al final de cada página
          const finalY = pdf.internal.pageSize.height - 15
          pdf.setFontSize(8)
          pdf.setTextColor(107, 114, 128)
          
          if (data.pageNumber === Math.ceil(tableData.length / 40)) {
            // Última página - mostrar resumen completo
            const firmados = todosLosDatos.filter(d => d.firmado_por).length
            const pendientes = todosLosDatos.filter(d => !d.firmado_por).length
            const porcentaje = Math.round((firmados / todosLosDatos.length) * 100)
            
            pdf.text(`Total registros: ${todosLosDatos.length} | Firmados: ${firmados} | Pendientes: ${pendientes} | % Cumplimiento: ${porcentaje}%`, 14, finalY)
            pdf.text(`Generado: ${new Date().toLocaleString('es-AR')}`, 14, finalY + 5)
          } else {
            pdf.text(`Página ${data.pageNumber}`, pdf.internal.pageSize.width - 30, finalY)
          }
        }
      })
      
      pdf.save(`monitoreo_bonos_${anio}_${mesInicio}_${mesFin}.pdf`)
      toast.success("PDF generado correctamente")
    } catch (error) {
      console.error("Error generando PDF:", error)
      toast.error("Error al generar el PDF")
    }
    setLoading(false)
  }

  const exportarExcel = async () => {
    const todosLosDatos = await obtenerTodosLosDatos()
    if (todosLosDatos.length === 0) {
      toast.warning("No hay datos para exportar")
      return
    }

    setLoading(true)
    try {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet("Monitoreo Bonos")
      
      worksheet.mergeCells('A1:F1')
      worksheet.getCell('A1').value = `Monitoreo de Bonos - ${meses[mesInicio - 1]} a ${meses[mesFin - 1]} de ${anio}`
      worksheet.getCell('A1').font = { size: 14, bold: true }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }
      
      worksheet.addRow(["Persona", "Mes", "Año", "Estado", "Fecha Firma", "Archivo"])
      
      const headerRow = worksheet.getRow(3)
      headerRow.font = { bold: true }
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      }
      
      todosLosDatos.forEach((item) => {
        worksheet.addRow([
          item.persona || "-",
          item.mes || "-",
          item.anio || "-",
          item.firmado_por ? "Firmado" : "Pendiente",
          item.firmado_fecha ? formatearFechaHora(item.firmado_fecha) : "-",
          item.archivo_url || "-",
        ])
      })
      
      const firmados = todosLosDatos.filter(d => d.firmado_por).length
      const pendientes = todosLosDatos.filter(d => !d.firmado_por).length
      
      worksheet.addRow([])
      worksheet.addRow(["RESUMEN", "", "", "", "", ""])
      worksheet.addRow([`Total Registros: ${todosLosDatos.length}`, "", "", "", "", ""])
      worksheet.addRow([`Bonos Firmados: ${firmados}`, "", "", "", "", ""])
      worksheet.addRow([`Bonos Pendientes: ${pendientes}`, "", "", "", "", ""])
      worksheet.addRow([`% Cumplimiento: ${Math.round((firmados / todosLosDatos.length) * 100)}%`, "", "", "", "", ""])
      worksheet.addRow([`Generado: ${new Date().toLocaleString('es-AR')}`, "", "", "", "", ""])
      
      worksheet.columns.forEach(column => {
        column.width = 25
      })
      
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `monitoreo_bonos_${anio}_${mesInicio}_${mesFin}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success("Excel generado correctamente")
    } catch (error) {
      console.error("Error generando Excel:", error)
      toast.error("Error al generar el Excel")
    }
    setLoading(false)
  }

  const descargarPDFsFirmados = async () => {
    if (estadisticas.firmados === 0) {
      toast.warning("No hay bonos firmados para descargar")
      return
    }

    setLoading(true)
    try {
      const timestamp = Date.now()
      const res = await fetch(`${API_URLS.monitorbonos}?t=${timestamp}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        body: JSON.stringify({
          action: "descargarPDFsFirmados",
          anio: Number.parseInt(anio),
          mesInicio,
          mesFin,
        }),
      })

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `bonos_firmados_${anio}_${mesInicio}_${mesFin}.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success("Archivos descargados correctamente")
      } else {
        const error = await res.json()
        toast.error(error.error || "Error al descargar los archivos")
      }
    } catch (error) {
      console.error("[v0] Error descargando PDFs:", error)
      toast.error("Error al descargar los archivos")
    }
    setLoading(false)
  }

  // 🔴 IMPORTANTE: useEffect para recargar cuando cambian los filtros o la página
  useEffect(() => {
    obtenerDatos()
  }, [anio, mesInicio, mesFin, pagina]) // Agregadas las dependencias faltantes

  useEffect(() => {
    registrarse()
  }, [])

  // 🔴 NUEVO: Resetear página a 1 cuando cambian los filtros
  useEffect(() => {
    setPagina(1)
  }, [anio, mesInicio, mesFin])

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Monitoreo de Bonos</h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={mesInicio}
          onChange={(e) => setMesInicio(Number.parseInt(e.target.value))}
          className="border p-2 rounded"
        >
          {meses.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <span className="p-2">a</span>
        <select 
          value={mesFin} 
          onChange={(e) => setMesFin(Number.parseInt(e.target.value))} 
          className="border p-2 rounded"
        >
          {meses.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Año"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          className="border p-2 rounded w-32"
        />

        <button
          onClick={() => {
            setPagina(1)
            obtenerDatos()
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <FaSyncAlt /> Buscar
        </button>
        <button
          onClick={exportarPDF}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
          disabled={datos.length === 0 || loading}
        >
          PDF
        </button>
        <button
          onClick={exportarExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={datos.length === 0 || loading}
        >
          Excel
        </button>
        <button
          onClick={descargarPDFsFirmados}
          className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700 disabled:opacity-50"
          disabled={estadisticas.firmados === 0 || loading}
        >
          <FaDownload /> Descargar PDFs Firmados
        </button>
      </div>

      {estadisticas.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-800 text-sm font-medium">Bonos Firmados</div>
            <div className="text-green-900 text-2xl font-bold">{estadisticas.firmados}</div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800 text-sm font-medium">Bonos Pendientes</div>
            <div className="text-red-900 text-2xl font-bold">{estadisticas.pendientes}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-800 text-sm font-medium">Total de Bonos</div>
            <div className="text-blue-900 text-2xl font-bold">{estadisticas.total}</div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-purple-800 text-sm font-medium">% Participación</div>
            <div className="text-purple-900 text-2xl font-bold">
              {estadisticas.total > 0 ? Math.round((estadisticas.firmados / estadisticas.total) * 100) : 0}%
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <Loader mensaje="Cargando..." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Persona</th>
                <th className="p-2 border">Mes</th>
                <th className="p-2 border">Año</th>
                <th className="p-2 border">Estado</th>
                <th className="p-2 border">Fecha Firma</th>
                <th className="p-2 border">Archivo</th>
              </tr>
            </thead>
            <tbody>
              {datos.length > 0 ? (
                datos.map((d, idx) => (
                  <tr key={`${d.idPersona}-${idx}`} className="text-center border-t">
                    <td className="p-2 border">
                      {d.persona}
                    </td>
                    <td className="p-2 border">{d.mes || "-"}</td>
                    <td className="p-2 border">{d.anio || "-"}</td>
                    <td className="p-2 border">
                      {d.firmado_por ? (
                        <span className="text-green-600 font-semibold">Firmado</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Pendiente</span>
                      )}
                    </td>
                    <td className="p-2 border">{d.firmado_fecha ? formatearFechaHora(d.firmado_fecha) : "-"}</td>
                    <td className="p-2 border">
                      {d.archivo_url ? (
                        <a
                          href={d.archivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Ver PDF
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No hay bonos en este período
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          {total > limite && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">
                Página {pagina} de {Math.ceil(total / limite)} ({total} registros)
              </p>
              <div className="flex gap-2">
                <button
                  disabled={pagina === 1}
                  onClick={() => setPagina((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                  Anterior
                </button>
                <button
                  disabled={pagina >= Math.ceil(total / limite)}
                  onClick={() => setPagina((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}