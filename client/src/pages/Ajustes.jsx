"use client"

import { useEffect, useState,useRef } from "react"
import { useForm } from "react-hook-form"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import ExcelJS from "exceljs"
import { API_URLS } from "../api/api"
import Loader from "../components/Loader"
import { toast } from "react-toastify"
import Alerta from "../pages/Alertas"
import { FaTrash } from "react-icons/fa"
import { formatearFechaHora } from "../utils/formatoFechas"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"

export default function Ajustes() {
  const { register, handleSubmit, reset, setValue } = useForm()
  const [ajustes, setAjustes] = useState([])
  const [articulos, setArticulos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [busquedaArticulo, setBusquedaArticulo] = useState("")
  const [mostrarLista, setMostrarLista] = useState(false)
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null)
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(-1)

  const [busquedaArticuloFiltro, setBusquedaArticuloFiltro] = useState("")
  const [articuloFiltroSeleccionado, setArticuloFiltroSeleccionado] = useState(null)
  const [indiceSeleccionadoFiltro, setIndiceSeleccionadoFiltro] = useState(-1)

  const [filtros, setFiltros] = useState({ fechaDesde: "", fechaHasta: "", idArticulo: "", tipo: "" })
  const [busquedaFiltroArticulo, setBusquedaFiltroArticulo] = useState("")
  const [mostrarListaFiltro, setMostrarListaFiltro] = useState(false)

  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)

  const API_URL = API_URLS.ajustes

   
  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Ajustes')

  }

  const cargarDatos = async () => {
    setLoading(true)
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get", ...filtros }),
    })
    const data = await res.json()
    setAjustes(data)
    setLoading(false)
  }

  const cargarArticulosYUsuarios = async () => {
    const urls = [API_URLS.articulos, API_URLS.usuarios]
    const setters = [setArticulos, setUsuarios]
    for (let i = 0; i < urls.length; i++) {
      const res = await fetch(urls[i], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get" }),
      })
      const data = await res.json()
      setters[i](data)
    }
  }

  useEffect(() => {
    cargarDatos()
    cargarArticulosYUsuarios()
    registrarse()
  }, [])

  const onSubmit = async (formData) => {
    if (!articuloSeleccionado) {
      toast.error("Debes seleccionar un artículo")
      return
    }
    const action = editId ? "update" : "insert"
    const payload = {
      action,
      ...formData,
      idArticulo: articuloSeleccionado.id,
      esnuevo: Number.parseInt(formData.esnuevo),
    }
    if (editId) payload.id = editId

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const result = await res.json()
    if (result.success) {
      toast.success(editId ? "Ajuste actualizado" : "Ajuste registrado")
      reset()
      setEditId(null)
      setBusquedaArticulo("")
      setArticuloSeleccionado(null)
      setMostrarLista(false)
      cargarDatos()
    } else {
      toast.error("Error al guardar ajuste")
    }
  }

  const editar = (ajuste) => {
    setEditId(ajuste.id)
    setArticuloSeleccionado({ id: ajuste.idArticulo, nombre: ajuste.articulo })
    setBusquedaArticulo(ajuste.articulo)
    setValue("tipo", ajuste.tipo)
    setValue("cantidad", ajuste.cantidad)
    setValue("motivo", ajuste.motivo)
    setValue("email", ajuste.email)
    setValue("esnuevo", ajuste.esnuevo.toString())
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const eliminar = async (id) => {
    if (!(await Alerta.confirmar({ texto: "¿Deseas eliminar este ajuste?" }))) return
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success("Ajuste eliminado")
      cargarDatos()
    } else {
      toast.error("No se pudo eliminar")
    }
  }

  const exportarPDF = async () => {
    const tabla = document.getElementById("tabla-exportar")
    const tablaClone = tabla.cloneNode(true)
    tablaClone.style.display = "block"
    tablaClone.style.position = "absolute"
    tablaClone.style.top = "-9999px"
    document.body.appendChild(tablaClone)

    const canvas = await html2canvas(tablaClone)
    document.body.removeChild(tablaClone)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF()
    pdf.text("Ajustes de Artículos", 10, 10)
    pdf.addImage(imgData, "PNG", 10, 20, 190, 0)
    pdf.save("ajustes.pdf")
  }

  const exportarExcel = async () => {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet("Ajustes")
    ws.columns = [
      { header: "Fecha", key: "fecha", width: 20 },
      { header: "Artículo", key: "articulo", width: 25 },
      { header: "Tipo", key: "tipo", width: 15 },
      { header: "Cantidad", key: "cantidad", width: 10 },
      { header: "Usuario", key: "usuario", width: 20 },
      { header: "Motivo", key: "motivo", width: 30 },
      { header: "Es Nuevo", key: "esnuevo", width: 10 },
    ]
    ajustes.forEach((a) =>
      ws.addRow({
        fecha: formatearFechaHora(a.fecha_hora),
        articulo: a.articulo,
        tipo: a.tipo,
        cantidad: a.cantidad,
        usuario: a.usuario,
        motivo: a.motivo,
        esnuevo: a.esnuevo == 1 ? "Nuevo" : a.esnuevo == 2 ? "A reparar" : "Usado",
      }),
    )
    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer])
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ajustes.xlsx"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const articulosFiltrados = articulos.filter((a) => a.nombre.toLowerCase().includes(busquedaArticulo.toLowerCase()))

  const articulosFiltroFiltrados = articulos.filter((a) =>
    a.nombre.toLowerCase().includes(busquedaFiltroArticulo.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Ajustes de Artículos</h2>

      {/* FORMULARIO PRINCIPAL */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-6 gap-2 mb-6">
        <div className="relative col-span-2">
          <input
            type="text"
            value={busquedaArticulo}
            onChange={(e) => {
              setBusquedaArticulo(e.target.value)
              setArticuloSeleccionado(null)
              setMostrarLista(true)
              setIndiceSeleccionado(-1)
            }}
            onFocus={() => setMostrarLista(true)}
            onKeyDown={(e) => {
              if (!mostrarLista || articulosFiltrados.length === 0) return

              if (e.key === "ArrowDown") {
                e.preventDefault()
                setIndiceSeleccionado((prev) => (prev < articulosFiltrados.length - 1 ? prev + 1 : 0))
              }

              if (e.key === "ArrowUp") {
                e.preventDefault()
                setIndiceSeleccionado((prev) => (prev > 0 ? prev - 1 : articulosFiltrados.length - 1))
              }

              if (e.key === "Enter") {
                e.preventDefault()
                if (indiceSeleccionado >= 0) {
                  const seleccionado = articulosFiltrados[indiceSeleccionado]
                  setArticuloSeleccionado(seleccionado)
                  setBusquedaArticulo(seleccionado.nombre)
                  setMostrarLista(false)
                }
              }

              if (e.key === "Escape") {
                setMostrarLista(false)
              }
            }}
            placeholder="Buscar artículo..."
            className="border p-2 w-full"
          />
          {mostrarLista && busquedaArticulo && articulosFiltrados.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow w-full max-h-40 overflow-y-auto">
              {articulosFiltrados.map((a, index) => (
                <li
                  key={a.id}
                  onClick={() => {
                    setArticuloSeleccionado(a)
                    setBusquedaArticulo(a.nombre)
                    setMostrarLista(false)
                  }}
                  className={`p-2 cursor-pointer ${index === indiceSeleccionado ? "bg-blue-200" : "hover:bg-blue-100"}`}
                >
                  {a.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select {...register("tipo", { required: true })} className="border p-2">
          <option value="">Tipo</option>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
        <input
          type="number"
          step="0.01"
          {...register("cantidad", { required: true })}
          className="border p-2"
          placeholder="Cantidad"
        />
        <select {...register("email", { required: true })} className="border p-2">
          <option value="">Usuario</option>
          {usuarios.map((u) => (
            <option key={u.email} value={u.email}>
              {u.email}
            </option>
          ))}
        </select>
        <input {...register("motivo")} className="border p-2" placeholder="Motivo" />
        <select {...register("esnuevo", { required: true })} className="border p-2">
          <option value="">Estado</option>
          <option value="1">Nuevo</option>
          <option value="0">Usado</option>
          <option value="2">A reparar</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {/* FILTROS */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <input
          type="date"
          className="border p-1 bg-lime-100 border-blue-500 rounded h-10 px-2"
          value={filtros.fechaDesde}
          onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
        />
        <input
          type="date"
          className="border p-1 bg-lime-100 border-blue-500 rounded h-10 px-2"
          value={filtros.fechaHasta}
          onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
        />

        <div className="relative">
          <input
            type="text"
            value={busquedaArticuloFiltro}
            onChange={(e) => {
              setBusquedaArticuloFiltro(e.target.value)
              setArticuloFiltroSeleccionado(null)
              setMostrarListaFiltro(true)
              setIndiceSeleccionadoFiltro(-1)
            }}
            onFocus={() => setMostrarListaFiltro(true)}
            onKeyDown={(e) => {
              if (!mostrarListaFiltro || articulosFiltrados.length === 0) return

              if (e.key === "ArrowDown") {
                e.preventDefault()
                setIndiceSeleccionadoFiltro((prev) => (prev < articulosFiltrados.length - 1 ? prev + 1 : 0))
              }

              if (e.key === "ArrowUp") {
                e.preventDefault()
                setIndiceSeleccionadoFiltro((prev) => (prev > 0 ? prev - 1 : articulosFiltrados.length - 1))
              }

              if (e.key === "Enter") {
                e.preventDefault()
                if (indiceSeleccionadoFiltro >= 0) {
                  const seleccionado = articulosFiltrados[indiceSeleccionadoFiltro]
                  setArticuloFiltroSeleccionado(seleccionado)
                  setBusquedaArticuloFiltro(seleccionado.nombre)
                  setFiltros({ ...filtros, idArticulo: seleccionado.id })
                  setMostrarListaFiltro(false)
                }
              }

              if (e.key === "Escape") {
                setMostrarListaFiltro(false)
              }
            }}
            placeholder="Artículo..."
            className="border p-1 bg-lime-100 border-blue-500 rounded h-10 px-2"
          />

          {mostrarListaFiltro && busquedaArticuloFiltro && articulosFiltrados.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow w-full max-h-40 overflow-y-auto">
              {articulosFiltrados.map((a, index) => (
                <li
                  key={a.id}
                  onClick={() => {
                    setArticuloFiltroSeleccionado(a)
                    setBusquedaArticuloFiltro(a.nombre)
                    setFiltros({ ...filtros, idArticulo: a.id })
                    setMostrarListaFiltro(false)
                  }}
                  className={`p-2 cursor-pointer ${
                    index === indiceSeleccionadoFiltro ? "bg-blue-200" : "hover:bg-blue-100"
                  }`}
                >
                  {a.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          className="border p-1 h-10 rounded"
          value={filtros.tipo}
          onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
        >
          <option value="">Todos</option>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={cargarDatos}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            Buscar
          </button>
          <button onClick={exportarPDF} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
            PDF
          </button>
          <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Excel
          </button>
        </div>
      </div>

      {loading ? (
        <Loader mensaje="Cargando ajustes..." />
      ) : (
        <div className="overflow-x-auto">
          <table id="tabla-exportar" className="min-w-full bg-white border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Artículo</th>
                <th className="p-2 border">Tipo</th>
                <th className="p-2 border">Cantidad</th>
                <th className="p-2 border">Usuario</th>
                <th className="p-2 border">Motivo</th>
                <th className="p-2 border">Es Nuevo</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ajustes.map((a, i) => (
                <tr key={i} className="text-center border-t">
                  <td className="p-2 border">{formatearFechaHora(a.fecha_hora)}</td>
                  <td className="p-2 border">{a.articulo}</td>
                  <td className="p-2 border">{a.tipo}</td>
                  <td className="p-2 border">{a.cantidad}</td>
                  <td className="p-2 border">{a.usuario}</td>
                  <td className="p-2 border">{a.motivo}</td>
                  <td className="p-2 border">
                    {a.esnuevo == 1 ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Nuevo</span>
                    ) : a.esnuevo == 2 ? (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">
                        A reparar
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">Usado</span>
                    )}
                  </td>
                  <td className="p-2 border flex justify-center gap-2">
                    <button onClick={() => editar(a)} className="bg-yellow-500 text-white px-2 py-2 rounded text-sm">
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(a.id)}
                      className="bg-red-600 text-white px-2 py-2 rounded text-sm hover:bg-red-700 flex items-center gap-1"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
