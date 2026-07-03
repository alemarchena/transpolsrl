"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import ExcelJS from "exceljs"
import { API_URLS } from "../api/api"
import Loader from "../components/Loader"
import { toast } from "react-toastify"
import Alerta from "../pages/Alertas"
import { FaSyncAlt, FaTrash, FaEdit, FaSort, FaSortUp, FaSortDown } from "react-icons/fa"

export default function PersonasExternas() {
  const [personas, setPersonas] = useState([])
  const [editId, setEditId] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [ordenColumna, setOrdenColumna] = useState("apellido")
  const [ordenDireccion, setOrdenDireccion] = useState("asc")
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, setValue } = useForm()
  const API_URL = API_URLS.personasexternas

  const obtenerPersonas = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get" }),
      })
      const data = await res.json()
      setPersonas(data)
    } catch (error) {
      toast.error("Error al cargar personas externas")
    }
    setLoading(false)
  }

  const manejarOrdenamiento = (columna) => {
    if (ordenColumna === columna) {
      setOrdenDireccion(ordenDireccion === "asc" ? "desc" : "asc")
    } else {
      setOrdenColumna(columna)
      setOrdenDireccion("asc")
    }
  }

  const obtenerIconoOrden = (columna) => {
    if (ordenColumna !== columna) {
      return <FaSort className="inline ml-1 text-gray-400" />
    }
    return ordenDireccion === "asc" ? (
      <FaSortUp className="inline ml-1 text-blue-600" />
    ) : (
      <FaSortDown className="inline ml-1 text-blue-600" />
    )
  }

  const onSubmit = async (datos) => {
    const action = editId ? "update" : "insert"
    const payload = { ...datos, action }
    if (editId) payload.id = editId

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const resultado = await res.json()

      if (resultado.success) {
        toast.success(editId ? "Persona actualizada con éxito." : "Persona agregada con éxito.")
        reset()
        setEditId(null)
        obtenerPersonas()
      } else {
        toast.error(resultado.error || "Ocurrió un error al guardar.")
      }
    } catch (error) {
      toast.error("Error de conexión")
    }
  }

  const eliminarPersona = async (id) => {
    if (!(await Alerta.confirmar({ texto: "¿Deseas eliminar esta persona externa?" }))) return

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })

      const resultado = await res.json()

      if (resultado.success) {
        toast.success(resultado.message || "Persona eliminada correctamente.")
        obtenerPersonas()
      } else {
        toast.error(resultado.error || "No se pudo eliminar la persona.")
      }
    } catch (error) {
      toast.error("Error de conexión al eliminar persona")
    }
  }

  const editarPersona = (item) => {
    setEditId(item.id)
    setValue("nombre", item.nombre)
    setValue("apellido", item.apellido)
    setValue("whatsapp", item.whatsapp || "")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const cancelarEdicion = () => {
    setEditId(null)
    reset()
  }

  const personasFiltradas = personas.filter((p) =>
    `${p.nombre} ${p.apellido} ${p.whatsapp || ""}`.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const personasOrdenadas = [...personasFiltradas].sort((a, b) => {
    let valA, valB

    switch (ordenColumna) {
      case "nombre":
        valA = a.nombre?.toLowerCase() || ""
        valB = b.nombre?.toLowerCase() || ""
        break
      case "apellido":
        valA = a.apellido?.toLowerCase() || ""
        valB = b.apellido?.toLowerCase() || ""
        break
      case "whatsapp":
        valA = a.whatsapp || ""
        valB = b.whatsapp || ""
        break
      default:
        valA = a.apellido?.toLowerCase() || ""
        valB = b.apellido?.toLowerCase() || ""
    }

    let resultado = 0
    if (valA < valB) resultado = -1
    if (valA > valB) resultado = 1

    return ordenDireccion === "asc" ? resultado : -resultado
  })

  const exportarExcel = async () => {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet("Personas Externas")

    ws.columns = [
      { header: "Nombre", key: "nombre", width: 25 },
      { header: "Apellido", key: "apellido", width: 25 },
      { header: "WhatsApp", key: "whatsapp", width: 20 },
    ]

    // Estilo de encabezados
    ws.getRow(1).font = { bold: true }
    ws.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0E0E0" } }

    personasOrdenadas.forEach((p) =>
      ws.addRow({
        nombre: p.nombre,
        apellido: p.apellido,
        whatsapp: p.whatsapp || "",
      }),
    )

    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer])
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "personas_externas.xlsx"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  useEffect(() => {
    obtenerPersonas()
  }, [])

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">{editId ? "Editar Persona Externa" : "Personas Externas"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          {...register("nombre", { required: true })}
          placeholder="Nombre"
          className="border px-3 py-2 h-10 rounded"
        />
        <input
          {...register("apellido", { required: true })}
          placeholder="Apellido"
          className="border px-3 py-2 h-10 rounded"
        />
        <input
          {...register("whatsapp")}
          placeholder="WhatsApp (ej: 549261123456)"
          className="border px-3 py-2 h-10 rounded"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 h-10 rounded hover:bg-blue-700 flex-1">
            {editId ? "Actualizar" : "Agregar"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="bg-gray-500 text-white px-4 py-2 h-10 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o WhatsApp..."
          className="p-2 border bg-lime-100 border-blue-500 rounded w-full md:w-1/2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={obtenerPersonas}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <FaSyncAlt /> Actualizar
          </button>
          <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Excel
          </button>
        </div>
      </div>

      {loading ? (
        <Loader mensaje="Cargando personas externas..." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th
                  className="p-2 border cursor-pointer hover:bg-gray-200 select-none"
                  onClick={() => manejarOrdenamiento("nombre")}
                >
                  Nombre {obtenerIconoOrden("nombre")}
                </th>
                <th
                  className="p-2 border cursor-pointer hover:bg-gray-200 select-none"
                  onClick={() => manejarOrdenamiento("apellido")}
                >
                  Apellido {obtenerIconoOrden("apellido")}
                </th>
                <th
                  className="p-2 border cursor-pointer hover:bg-gray-200 select-none"
                  onClick={() => manejarOrdenamiento("whatsapp")}
                >
                  WhatsApp {obtenerIconoOrden("whatsapp")}
                </th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personasOrdenadas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No hay personas externas registradas
                  </td>
                </tr>
              ) : (
                personasOrdenadas.map((item) => (
                  <tr key={item.id} className="text-center border-t hover:bg-gray-50">
                    <td className="p-2 border">{item.nombre}</td>
                    <td className="p-2 border">{item.apellido}</td>
                    <td className="p-2 border">
                      {item.whatsapp ? (
                        <a
                          href={`https://wa.me/${item.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 font-semibold hover:underline"
                        >
                          {item.whatsapp}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2 border">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => editarPersona(item)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 flex items-center gap-1"
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          onClick={() => eliminarPersona(item.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1"
                        >
                          <FaTrash /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">Total: {personasOrdenadas.length} persona(s) externa(s)</div>
    </div>
  )
}
