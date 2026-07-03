import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api"
import Loader from "../components/Loader"
import ExcelJS from "exceljs"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export default function MonitorCombustible() {
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const tablaRef = useRef()

  const [vehiculos, setVehiculos] = useState([])
  const [busquedaVehiculo, setBusquedaVehiculo] = useState("")
  const [mostrarListaVehiculo, setMostrarListaVehiculo] = useState(false)
  const [indiceVehiculo, setIndiceVehiculo] = useState(-1)

  const vehiculosFiltrados = vehiculos.filter((v) =>
    `${v.numerointerno || ""} ${v.patente} ${v.marca} ${v.modelo}`
      .toLowerCase()
      .includes(busquedaVehiculo.toLowerCase()),
  )

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Monitor Combustible')
  }

  const obtenerVehiculos = async () => {
    const res = await fetch(API_URLS.vehiculos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    })
    const data = await res.json()
    setVehiculos(data)
  }

  const obtenerDatos = async () => {
    setLoading(true)
    const res = await fetch(API_URLS.monitorcombustible, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "get",
        busqueda,
        fechaDesde,
        fechaHasta,
      }),
    })
    const data = await res.json()
    console.log(data)
    setDatos(Array.isArray(data.data) ? data.data : [])
    setLoading(false)
  }

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Monitor de Combustible")

    sheet.columns = [
      { header: "Vehículo", key: "vehiculo", width: 35 },
      { header: "Total KM Recorridos", key: "kmRecorridos", width: 18 },
      { header: "Total Litros", key: "litros", width: 15 },
      { header: "Promedio l/100km", key: "consumo", width: 18 },
      { header: "Cantidad Cargas", key: "cantidadCargas", width: 15 },
    ]

    datos.forEach((d) => {
     sheet.addRow({
        vehiculo: `${d.numerointerno ? `[${d.numerointerno}] ` : ""}${d.patente} - ${d.marca} ${d.modelo}`,
        kmRecorridos: d.totalKmRecorridos,
        litros: d.totalLitros,
        consumo: d.promedioConsumo !== null ? Number.parseFloat(d.promedioConsumo) : null,
        cantidadCargas: d.cantidadCargas,
      })
    })

    sheet.getColumn("consumo").numFmt = '#,##0.00 "l/100km";-'

    const blob = await workbook.xlsx.writeBuffer()
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([blob]))
    a.download = "monitor_combustible.xlsx"
    a.click()
  }

  const exportarPDF = async () => {
    const tabla = tablaRef.current
    const canvas = await html2canvas(tabla, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const imgWidth = pdf.internal.pageSize.getWidth() - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    pdf.text("Monitor de Combustible", 14, 15)
    pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight)
    pdf.save("monitor_combustible.pdf")
  }

  useEffect(() => {
    obtenerVehiculos()
    obtenerDatos()
    registrarse()
  }, [])

 const totalKmRecorridos = datos.reduce((sum, d) => sum + (Number(d.totalKmRecorridos) || 0), 0)
  const totalLitros = datos.reduce((sum, d) => sum + (Number(d.totalLitros) || 0), 0)

  const promedioGeneral =
    totalKmRecorridos > 0 && totalLitros > 0
      ? ((totalLitros / totalKmRecorridos) * 100).toFixed(2)
      : "-"

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1800px]">
      <h2 className="text-2xl font-bold mb-4">Monitor de Combustible</h2>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
          <div className="text-blue-700 font-bold text-2xl">{datos.length}</div>
          <div className="text-blue-600 text-sm">Vehículos</div>
        </div>
        <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
          <div className="text-green-700 font-bold text-2xl">{totalKmRecorridos.toLocaleString()}</div>
          <div className="text-green-600 text-sm">Total KM Recorridos</div>
        </div>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
          <div className="text-yellow-700 font-bold text-2xl">{totalLitros.toLocaleString()}</div>
          <div className="text-yellow-600 text-sm">Total Litros</div>
        </div>
        <div className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded">
          <div className="text-purple-700 font-bold text-2xl">{promedioGeneral}</div>
          <div className="text-purple-600 text-sm">Promedio General l/100km</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            className="border p-2 bg-lime-100 border-blue-500 rounded w-full"
            placeholder="Ej: [18] AE893IL - Buscar por número interno, patente, marca..."
            value={busquedaVehiculo}
            onChange={(e) => {
              setBusquedaVehiculo(e.target.value)
              setMostrarListaVehiculo(true)
              setIndiceVehiculo(-1)
            }}
            onFocus={() => setMostrarListaVehiculo(true)}
            onKeyDown={(e) => {
              if (!mostrarListaVehiculo || vehiculosFiltrados.length === 0) return

              if (e.key === "ArrowDown") {
                e.preventDefault()
                setIndiceVehiculo((prev) => (prev < vehiculosFiltrados.length - 1 ? prev + 1 : 0))
              }
              if (e.key === "ArrowUp") {
                e.preventDefault()
                setIndiceVehiculo((prev) => (prev > 0 ? prev - 1 : vehiculosFiltrados.length - 1))
              }
              if (e.key === "Enter") {
                e.preventDefault()
                if (indiceVehiculo >= 0) {
                  const v = vehiculosFiltrados[indiceVehiculo]
                  setBusquedaVehiculo(`[${v.numerointerno || ""}] ${v.patente} - ${v.marca} ${v.modelo}`)
                  setBusqueda(v.patente)
                  setMostrarListaVehiculo(false)
                }
              }
              if (e.key === "Escape") setMostrarListaVehiculo(false)
            }}
          />
          {mostrarListaVehiculo && busquedaVehiculo && vehiculosFiltrados.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto rounded shadow">
              {vehiculosFiltrados.map((v, index) => (
                <li
                  key={v.id}
                  onClick={() => {
                    setBusquedaVehiculo(`[${v.numerointerno || ""}] ${v.patente} - ${v.marca} ${v.modelo}`)
                    setBusqueda(v.patente)
                    setMostrarListaVehiculo(false)
                  }}
                  className={`p-2 cursor-pointer text-sm ${index === indiceVehiculo ? "bg-blue-200" : "hover:bg-blue-100"}`}
                >
                  {v.numerointerno ? `[${v.numerointerno}] ` : ""}
                  {v.patente} - {v.marca} {v.modelo}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          type="date"
          className="border p-2 bg-lime-100 border-blue-500 rounded"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 bg-lime-100 border-blue-500 rounded"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
        />
        
        <button onClick={obtenerDatos} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Buscar
        </button>
        <button onClick={exportarPDF} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
          PDF
        </button>
        <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Excel
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <Loader mensaje="Cargando monitor de combustible..." />
      ) : (
        <div className="overflow-x-auto" ref={tablaRef}>
          <table className="min-w-full bg-white border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Vehículo</th>
                <th className="p-2 border">Total KM Recorridos</th>
                <th className="p-2 border">Total Litros</th>
                <th className="p-2 border">Promedio l/100km</th>
                <th className="p-2 border">Cantidad Cargas</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((d, i) => {
                const consumoNum = d.promedioConsumo !== null ? Number.parseFloat(d.promedioConsumo) : null

                return (
                  <tr key={i} className="text-center border-t hover:bg-gray-50">
                    <td className="p-2 border text-left">
                      <div className="font-semibold">
                        {`${d.numerointerno ? `[${d.numerointerno}] ` : ""}${d.patente} - ${d.marca} ${d.modelo}`}
                      </div>
                      <div className="text-xs text-gray-600">Año: {d.anio}</div>
                    </td>

                    <td className="p-2 border font-semibold">
                      {d.totalKmRecorridos !== null ? d.totalKmRecorridos.toLocaleString() : "-"}
                    </td>

                    <td className="p-2 border">
                      {d.totalLitros !== null ? d.totalLitros.toLocaleString() : "-"}
                    </td>

                    <td className="p-2 border">
                      <span
                        className={`px-3 py-1 rounded font-bold ${
                          consumoNum === null
                            ? "bg-gray-100 text-gray-500"
                            : consumoNum > 15
                              ? "bg-red-100 text-red-700"
                              : consumoNum > 10
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                        }`}
                      >
                        {consumoNum !== null
                          ? `${consumoNum.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} l/100km`
                          : "-"}
                      </span>
                    </td>

                    <td className="p-2 border text-gray-600">{d.cantidadCargas}</td>
                  </tr>
                )
              })}

              {datos.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
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
