"use client"

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import Loader from "../components/Loader"
import { API_URLS } from "../api/api"
import { toast } from "react-toastify"
import Alerta from "../pages/Alertas"
import { FaSyncAlt, FaTrash, FaSort, FaSortUp, FaSortDown } from "react-icons/fa"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"

export default function Articulos() {


  const [articulos, setArticulos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [editId, setEditId] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [ordenCampo, setOrdenCampo] = useState("")
  const [ordenAsc, setOrdenAsc] = useState(true)
  const [articulosCargados, setArticulosCargados] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, setValue } = useForm()
  const API_URL = API_URLS.articulos
  const CAT_URL = API_URLS.categorias

  const obtenerCategorias = async () => {
    const res = await fetch(CAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    })
    const data = await res.json()
    setCategorias(data)
  }

  const obtenerArticulos = async () => {
    setLoading(true)
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    })
    const data = await res.json()
    setArticulos(data)
    setArticulosCargados(true)
    setLoading(false)
  }

  
  useEffect(() => {
    obtenerCategorias()
    registrarse()
  }, [])
  
  const yaregistrado = useRef(false)
  const registrarse = ()=> {

    if(yaregistrado.current) return
    yaregistrado.current = true
    const emaillocal = getEmailFromLocalStorage()
    if(!emaillocal) return
    registrarIngreso(API_URLS.usuarios,emaillocal,'Articulos')

  }

  const onSubmit = async (datos) => {
    const action = editId ? "update" : "insert"
    const payload = { ...datos, action }
    if (editId) payload.id = editId

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    reset()
    setEditId(null)
    obtenerArticulos()
  }

  const eliminarArticulo = async (id) => {
    if (!(await Alerta.confirmar({ texto: "¿Deseas eliminar este artículo?" }))) return
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    })
    const resultado = await res.json()
    if (resultado.success) {
      toast.success("Artículo eliminado correctamente.")
    } else {
      toast.error(resultado.error || "No se pudo eliminar.")
    }
    obtenerArticulos()
  }

  const editarArticulo = (item) => {
    setEditId(item.id)
    setValue("nombre", item.nombre)
    setValue("descripcion", item.descripcion)
    setValue("idCategoria", item.idCategoria)
    setValue("stock_minimo", item.stock_minimo)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const articulosFiltrados = articulos.filter(
    (item) =>
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const ordenarPor = (campo) => {
    if (ordenCampo === campo) {
      setOrdenAsc(!ordenAsc)
    } else {
      setOrdenCampo(campo)
      setOrdenAsc(true)
    }
  }

  const articulosOrdenados = [...articulosFiltrados].sort((a, b) => {
    const valA = a[ordenCampo]?.toString().toLowerCase() || ""
    const valB = b[ordenCampo]?.toString().toLowerCase() || ""
    if (valA < valB) return ordenAsc ? -1 : 1
    if (valA > valB) return ordenAsc ? 1 : -1
    return 0
  })

  const exportarExcel = async () => {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet("Artículos")

    ws.columns = [
      { header: "Nombre", key: "nombre", width: 25 },
      { header: "Categoría", key: "categoria", width: 25 },
      { header: "Descripción", key: "descripcion", width: 40 },
      { header: "Stock mínimo", key: "stock_minimo", width: 15 },
    ]

    articulosFiltrados.forEach((item) => {
      ws.addRow({
        nombre: item.nombre,
        categoria: item.categoria || "Sin categoría",
        descripcion: item.descripcion || "",
        stock_minimo: item.stock_minimo,
      })
    })

    const buffer = await wb.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), "articulos.xlsx")
  }

  const exportarPDF = async () => {
    const tabla = document.getElementById("tabla-exportar")
    if (!tabla) {
      alert("No se encontró la tabla para exportar.")
      return
    }

    try {
      const tablaClone = tabla.cloneNode(true)
      tablaClone.style.display = "block"
      tablaClone.style.position = "absolute"
      tablaClone.style.top = "-9999px"
      document.body.appendChild(tablaClone)

      const canvas = await html2canvas(tablaClone, { scale: 2 })
      document.body.removeChild(tablaClone)

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const imgProps = pdf.getImageProperties(imgData)
      const imgWidth = pageWidth - 20
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width

      const fecha = new Date()
      const fechaStr = fecha.toLocaleDateString("es-AR")
      const horaStr = fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })

      pdf.setFontSize(18)
      pdf.text("Listado de Artículos", pageWidth / 2, 20, { align: "center" })
      pdf.setFontSize(12)
      pdf.text(`Fecha: ${fechaStr} - ${horaStr}`, 15, 30)
      pdf.addImage(imgData, "PNG", 10, 40, imgWidth, imgHeight)
      pdf.save(`articulos-${fecha.toISOString().slice(0, 10)}.pdf`)
    } catch (error) {
      console.error("Error exportando PDF:", error)
      alert("Ocurrió un error al exportar el PDF.")
    }
  }

  return (
    <div className="max-w-full mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editId ? "Editar artículo" : "Artículos"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative group">
          <input {...register("nombre", { required: true })} className="border p-2 w-full" placeholder="Nombre" />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Ingrese el nombre del artículo
          </div>
        </div>

        <div className="relative group">
          <select {...register("idCategoria", { required: true })} className="border p-2 w-full">
            <option value="">Categoría...</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Seleccione la categoría del artículo
          </div>
        </div>

        <div className="relative group">
          <input
            type="number"
            step="0.01"
            {...register("stock_minimo", { min: 0 })}
            className="border p-2 w-full"
            placeholder="Stock mínimo"
          />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Cantidad mínima de stock para alertas
          </div>
        </div>

        <div className="relative group md:col-span-3">
          <textarea {...register("descripcion")} className="border p-2 w-full" placeholder="Descripción (opcional)" />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Descripción detallada del artículo (opcional)
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded h-10">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>
      <div className="flex flex-col items-center mt-8 border p-8 rounded w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 w-full">
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            className="w-full border bg-lime-100 border-blue-500 p-2"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            onClick={obtenerArticulos}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <FaSyncAlt />
            Actualizar
          </button>
          <button onClick={exportarPDF} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
            PDF
          </button>
          <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Excel
          </button>
        </div>

        <ul id="lista-articulos" className="divide-y border-t w-full">
          <div className="grid grid-cols-[2fr_1fr_3fr_1fr_1.5fr] font-semibold text-gray-700 p-2 m-2">
            <button
              onClick={() => ordenarPor("nombre")}
              className="text-left flex items-center gap-2 hover:text-blue-600"
            >
              Nombre
              {ordenCampo === "nombre" ? (
                ordenAsc ? (
                  <FaSortUp className="text-blue-600" />
                ) : (
                  <FaSortDown className="text-blue-600" />
                )
              ) : (
                <FaSort className="text-gray-400" />
              )}
            </button>
            <button
              onClick={() => ordenarPor("categoria")}
              className="text-left flex items-center gap-2 hover:text-blue-600"
            >
              Categoría
              {ordenCampo === "categoria" ? (
                ordenAsc ? (
                  <FaSortUp className="text-blue-600" />
                ) : (
                  <FaSortDown className="text-blue-600" />
                )
              ) : (
                <FaSort className="text-gray-400" />
              )}
            </button>
            <button
              onClick={() => ordenarPor("descripcion")}
              className="text-left flex items-center gap-2 hover:text-blue-600"
            >
              Descripción
              {ordenCampo === "descripcion" ? (
                ordenAsc ? (
                  <FaSortUp className="text-blue-600" />
                ) : (
                  <FaSortDown className="text-blue-600" />
                )
              ) : (
                <FaSort className="text-gray-400" />
              )}
            </button>
            <button
              onClick={() => ordenarPor("stock_minimo")}
              className="text-left flex items-center gap-2 hover:text-blue-600"
            >
              Stock mínimo
              {ordenCampo === "stock_minimo" ? (
                ordenAsc ? (
                  <FaSortUp className="text-blue-600" />
                ) : (
                  <FaSortDown className="text-blue-600" />
                )
              ) : (
                <FaSort className="text-gray-400" />
              )}
            </button>
            <span className="text-left">Acciones</span>
          </div>

          {loading ? (
            <Loader mensaje="Cargando artículos..." />
          ) : (
            articulosOrdenados.map((item) => (
              <li key={item.id} className="grid grid-cols-[2fr_1fr_3fr_1fr_1.5fr] gap-2 py-2 items-center">
                <div>{item.nombre}</div>
                <div>{item.categoria || "Sin categoría"}</div>
                <div className="break-words max-w-md">{item.descripcion || "-"}</div>
                <div>{item.stock_minimo}</div>
                <div className="flex gap-2 justify-start">
                  <button
                    onClick={() => editarArticulo(item)}
                    className="bg-yellow-500 text-white px-2 py-1 text-sm rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarArticulo(item.id)}
                    className="bg-red-600 text-white px-2 py-1 text-sm rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Tabla oculta para exportar a PDF */}
      <div className="hidden">
        <table id="tabla-exportar" className="w-full border text-sm">
          <thead>
            <tr>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Categoría</th>
              <th className="border p-2">Descripción</th>
              <th className="border p-2">Stock mínimo</th>
            </tr>
          </thead>
          <tbody>
            {articulosFiltrados.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.nombre}</td>
                <td className="border p-2">{item.categoria || "Sin categoría"}</td>
                <td className="border p-2">{item.descripcion || "-"}</td>
                <td className="border p-2">{item.stock_minimo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
