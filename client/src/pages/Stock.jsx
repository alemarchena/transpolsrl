import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api"
import Loader from "../components/Loader"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import ExcelJS from "exceljs"
import { formatearFechaHora } from "../utils/formatoFechas"
import { FaSyncAlt } from "react-icons/fa"

export default function Stock() {
  const [articulos, setArticulos] = useState([])
  const [idArticulo, setIdArticulo] = useState("")
  const [busquedaArticulo, setBusquedaArticulo] = useState("")
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const [indiceResaltado, setIndiceResaltado] = useState(-1)
  const dropdownRef = useRef(null)
  const dropdownListRef = useRef(null)
  const [stock, setStock] = useState(null)
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(false)
  const [listadoStock, setListadoStock] = useState([])
  const [ordenCampo, setOrdenCampo] = useState("nombre")
  const [ordenAsc, setOrdenAsc] = useState(true)
  const [paginaActual, setPaginaActual] = useState(1)
  const [busqueda, setBusqueda] = useState("")
  const [filtroEsNuevo, setFiltroEsNuevo] = useState("")
  const itemsPorPagina = 20

  const tablaRef = useRef()
  const resumenRef = useRef()
  const [filtroStockMinimo, setFiltroStockMinimo] = useState("")

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Stock')
  }

  const obtenerArticulos = async () => {
    const res = await fetch(API_URLS.articulos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    })
    const data = await res.json()
    setArticulos(data)
  }

  const buscarStock = async () => {
    if (!idArticulo) return
    setLoading(true)
    const res = await fetch(API_URLS.stock, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "get",
        idArticulo,
        filtroEsNuevo: filtroEsNuevo !== "" ? Number.parseInt(filtroEsNuevo) : "",
      }),
    })
    const json = await res.json()
    setStock(json.stock)
    setMovimientos(json.movimientos || [])
    setLoading(false)
  }

  const obtenerListadoStock = async () => {
    setLoading(true)
    const res = await fetch(API_URLS.stock, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getAllStock",
        filtroEsNuevo: filtroEsNuevo !== "" ? Number.parseInt(filtroEsNuevo) : "",
      }),
    })
    const data = await res.json()
    setListadoStock(data)
    setLoading(false)
  }

  useEffect(() => {
    obtenerArticulos()
    obtenerListadoStock()
    registrarse()
  }, [])

  useEffect(() => {
    obtenerListadoStock()
  }, [filtroEsNuevo])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMostrarDropdown(false)
        setIndiceResaltado(-1)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const ordenarPor = (campo) => {
    const ordenado = [...listadoStock].sort((a, b) => {
      if (a[campo] < b[campo]) return ordenAsc ? -1 : 1
      if (a[campo] > b[campo]) return ordenAsc ? 1 : -1
      return 0
    })
    setListadoStock(ordenado)
    setOrdenCampo(campo)
    setOrdenAsc(!ordenAsc)
    setPaginaActual(1)
  }

  const exportarPDF = async () => {
    const tabla = tablaRef.current
    const canvas = await html2canvas(tabla, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF()
    pdf.text("Movimientos de Stock", 10, 10)
    pdf.addImage(imgData, "PNG", 10, 20, 190, 0)
    pdf.save("stock.pdf")
  }

  const exportarExcel = async () => {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet("Movimientos de Stock")
    ws.addRow(["Fecha", "Tipo", "Cantidad", "Estado", "Motivo / Descripción"])
    movimientos.forEach((m) => {
      const esNuevoNum = Number(m.esnuevo)
      ws.addRow([
        formatearFechaHora(m.fecha),
        m.tipo,
        typeof m.cantidad === "number" ? m.cantidad.toFixed(2) : m.cantidad,
        esNuevoNum === 1 ? "Nuevo" : esNuevoNum === 0 ? "Usado" : "-",
        m.motivo || m.detalle || "",
      ])
    })
    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer])
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "stock.xlsx"
    link.click()
  }

  const exportarResumenPDF = async () => {
    const tabla = resumenRef.current
    const canvas = await html2canvas(tabla, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF()
    pdf.text("Stock Actual por Artículo", 10, 10)
    pdf.addImage(imgData, "PNG", 10, 20, 190, 0)
    pdf.save("stock_general.pdf")
  }

  const exportarResumenExcel = async () => {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet("Stock General")
    ws.addRow(["Artículo","Categoría", "Descripción", "Stock Actual", "Stock Mínimo"])
    listadoStockFiltrado.forEach((a) => {
      ws.addRow([
        a.nombre,
        a.categoria || "-",
        a.descripcion || "",
        typeof a.stock === "number" ? a.stock.toFixed(2) : a.stock,
        typeof a.stockMinimo === "number" ? a.stockMinimo.toFixed(2) : a.stockMinimo,
      ])
    })
    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer])
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "stock_general.xlsx"
    link.click()
  }

  // const articulosFiltrados = articulos.filter((a) => a.nombre.toLowerCase().includes(busquedaArticulo.toLowerCase()))
  const articulosFiltrados = articulos.filter(a => {
    const texto = busqueda.toLowerCase()

    return (
      a.nombre?.toLowerCase().includes(texto) ||
      a.categoria?.toLowerCase().includes(texto) ||
      a.descripcion?.toLowerCase().includes(texto)
    )
  })

  // const listadoStockFiltrado = listadoStock.filter((a) => a.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    const listadoStockFiltrado = listadoStock.filter((a) => {
      const texto = busqueda.trim().toLowerCase()

      const nombre = (a.nombre || "").toLowerCase()
      const categoria = (a.categoria || "").toLowerCase()
      const descripcion = (a.descripcion || "").toLowerCase()

      const coincideBusqueda =
        nombre.includes(texto) ||
        categoria.includes(texto) ||
        descripcion.includes(texto)

      let coincideStock = true

      if (filtroStockMinimo === "bajo") {
        coincideStock = a.stock < a.stockMinimo
      }

      if (filtroStockMinimo === "igual") {
        coincideStock = a.stock === a.stockMinimo
      }

      if (filtroStockMinimo === "sobre") {
        coincideStock = a.stock > a.stockMinimo
      }

      return coincideBusqueda && coincideStock
    })
    
  const totalPaginas = Math.ceil(listadoStockFiltrado.length / itemsPorPagina)
  const datosPaginados = listadoStockFiltrado.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina)

  const handleKeyDown = (e) => {
    if (!mostrarDropdown || articulosFiltrados.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setIndiceResaltado((prev) => {
          const nuevoIndice = prev < articulosFiltrados.length - 1 ? prev + 1 : 0
          scrollToItem(nuevoIndice)
          return nuevoIndice
        })
        break
      case "ArrowUp":
        e.preventDefault()
        setIndiceResaltado((prev) => {
          const nuevoIndice = prev > 0 ? prev - 1 : articulosFiltrados.length - 1
          scrollToItem(nuevoIndice)
          return nuevoIndice
        })
        break
      case "Enter":
        e.preventDefault()
        if (indiceResaltado >= 0 && indiceResaltado < articulosFiltrados.length) {
          const articuloSeleccionado = articulosFiltrados[indiceResaltado]
          setIdArticulo(articuloSeleccionado.id)
          setBusquedaArticulo(articuloSeleccionado.nombre)
          setMostrarDropdown(false)
          setIndiceResaltado(-1)
        }
        break
      case "Escape":
        setMostrarDropdown(false)
        setIndiceResaltado(-1)
        break
    }
  }

  const scrollToItem = (index) => {
    if (dropdownListRef.current) {
      const items = dropdownListRef.current.children
      if (items[index]) {
        items[index].scrollIntoView({ block: "nearest" })
      }
    }
  }

  useEffect(() => {
    setIndiceResaltado(-1)
  }, [busquedaArticulo])

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Consulta de Stock por Artículo</h1>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <label className="font-semibold mr-2">Filtrar por estado:</label>
        <select value={filtroEsNuevo} onChange={(e) => setFiltroEsNuevo(e.target.value)} className="border p-2 rounded">
          <option value="">Todos</option>
          <option value="1">Nuevos</option>
          <option value="0">Usados</option>
        </select>
        <span className="ml-4 text-sm text-gray-600">
          {filtroEsNuevo === "1"
            ? "Mostrando solo productos nuevos"
            : filtroEsNuevo === "0"
              ? "Mostrando solo productos usados"
              : "Mostrando todos los productos"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 items-center mb-4">
        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Buscar artículo..."
            value={busquedaArticulo}
            onChange={(e) => {
              setBusquedaArticulo(e.target.value)
              setMostrarDropdown(true)
              if (e.target.value === "") {
                setIdArticulo("")
              }
            }}
            onFocus={() => setMostrarDropdown(true)}
            onKeyDown={handleKeyDown}
            className="border p-2 w-64 rounded bg-lime-100"
          />
          {mostrarDropdown && articulosFiltrados.length > 0 && (
            <div
              ref={dropdownListRef}
              className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto"
            >
              {articulosFiltrados.map((a, index) => (
                <div
                  key={a.id}
                  onClick={() => {
                    setIdArticulo(a.id)
                    setBusquedaArticulo(a.nombre)
                    setMostrarDropdown(false)
                    setIndiceResaltado(-1)
                  }}
                  onMouseEnter={() => setIndiceResaltado(index)}
                  className={`p-2 cursor-pointer ${
                    indiceResaltado === index
                      ? "bg-blue-200 font-semibold"
                      : idArticulo === a.id
                        ? "bg-blue-100"
                        : "hover:bg-blue-100"
                  }`}
                >
                  {a.nombre}
                </div>
              ))}
            </div>
          )}
          {mostrarDropdown && busquedaArticulo && articulosFiltrados.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg p-2 text-gray-500">
              No se encontraron artículos
            </div>
          )}
        </div>

        <button onClick={buscarStock} className="bg-blue-600 text-white px-4 py-2 rounded">
          Buscar
        </button>
        <button onClick={exportarPDF} className="bg-yellow-600 text-white px-3 py-1 rounded">
          PDF
        </button>
        <button onClick={exportarExcel} className="bg-green-600 text-white px-3 py-1 rounded">
          Excel
        </button>
      </div>

      {loading && <Loader />}

      {stock !== null && (
        <>
          <div className="mb-4 text-lg">
            <strong>Stock actual:</strong> {typeof stock === "number" ? stock.toFixed(2) : stock}
          </div>

          <div className="overflow-x-auto" ref={tablaRef}>
            <table className="min-w-full table-auto border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Tipo</th>
                  <th className="p-2">Cantidad</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2">Motivo / Descripción</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((m, i) => {
                  const esNuevoNum = Number(m.esnuevo)
                  return (
                    <tr key={i} className="text-center border-t">
                      <td className="p-2">{formatearFechaHora(m.fecha)}</td>
                      <td className="p-2">{m.tipo}</td>
                      <td className="p-2">{typeof m.cantidad === "number" ? m.cantidad.toFixed(2) : m.cantidad}</td>
                      <td className="p-2">
                        {esNuevoNum === 1 ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                            Nuevo
                          </span>
                        ) : esNuevoNum === 0 ? (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                            Usado
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="p-2">{m.motivo || m.detalle || ""}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <hr className="my-8" />

      <div className="flex flex-col items-center justify-center mt-8 border p-8">
        <h2 className="text-lg font-semibold pb-8">Listado general de stock</h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pb-8 mb-4">
          <input
            type="text"
            placeholder="Buscar por artículo, categoría o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-lime-100 border-blue-500 border p-2 rounded w-full md:w-96"
          />
          <select
            value={filtroStockMinimo}
            onChange={(e) => setFiltroStockMinimo(e.target.value)}
            className="border p-2 rounded bg-white"
          >
            <option value="">Todos</option>
            <option value="bajo">Stock bajo</option>
            <option value="igual">Stock igual al mínimo</option>
            <option value="sobre">Stock sobre el mínimo</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={obtenerListadoStock}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaSyncAlt />
              Actualizar
            </button>
            <button onClick={exportarResumenPDF} className="bg-yellow-600 text-white px-3 py-1 rounded">
              PDF
            </button>
            <button onClick={exportarResumenExcel} className="bg-green-600 text-white px-3 py-1 rounded">
              Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto" ref={resumenRef}>
        <table className="min-w-full table-auto border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 cursor-pointer" onClick={() => ordenarPor("nombre")}>
                Artículo
              </th>
              <th className="p-2 cursor-pointer" onClick={() => ordenarPor("categoria")}>
                Categoría
              </th>
              <th className="p-2 cursor-pointer" onClick={() => ordenarPor("descripcion")}>
                Descripción
              </th>
              <th className="p-2 cursor-pointer" onClick={() => ordenarPor("stock")}>
                Stock Actual
              </th>
              <th className="p-2">Stock Mínimo</th>
            </tr>
          </thead>
          <tbody>
            {datosPaginados.map((art, i) => (
              <tr key={i} className="text-center border-t">
                <td className="p-2 whitespace-nowrap">{art.nombre}</td>
                <td className="p-2">{art.categoria || "-"}</td>
                <td className="p-2 text-left break-words max-w-md">{art.descripcion || "-"}</td>
                <td className="p-2">{typeof art.stock === "number" ? art.stock.toFixed(2) : art.stock}</td>
                <td
                  className={`p-2 font-bold text-white ${
                    art.color === "red"
                      ? "bg-red-600"
                      : art.color === "yellow"
                        ? "bg-yellow-500 text-black"
                        : "bg-green-600"
                  }`}
                >
                  {typeof art.stockMinimo === "number" ? art.stockMinimo.toFixed(2) : art.stockMinimo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPaginaActual(i + 1)}
              className={`px-3 py-1 border rounded ${paginaActual === i + 1 ? "bg-blue-600 text-white" : ""}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
