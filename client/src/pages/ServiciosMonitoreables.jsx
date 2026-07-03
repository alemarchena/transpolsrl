import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { useForm } from "react-hook-form"
import { API_URLS } from "../api/api"
import { toast } from "react-toastify"
import Alerta from "../pages/Alertas"
import { FaTrash, FaSyncAlt, FaEdit } from "react-icons/fa"

export default function ServiciosMonitoreables() {
  const [servicios, setServicios] = useState([])
  const [editId, setEditId] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const { register, handleSubmit, reset, setValue } = useForm()

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Servicios Monitoreables')
  }

  const obtenerServicios = async () => {
    const res = await fetch(API_URLS.serviciosmonitoreables, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    })
    const data = await res.json()
    setServicios(Array.isArray(data) ? data : [])
  }

  const onSubmit = async (datos) => {
    const action = editId ? "update" : "insert"
    const payload = {
      ...datos,
      action,
      acumulable: datos.acumulable ? 1 : 0,
    }
    if (editId) payload.id = editId

    const res = await fetch(API_URLS.serviciosmonitoreables, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const resultado = await res.json()
    if (resultado.success) {
      toast.success(editId ? "Servicio actualizado" : "Servicio agregado")
      reset()
      setEditId(null)
      obtenerServicios()
    } else {
      toast.error("Error al guardar")
    }
  }

  const eliminarServicio = async (id) => {
    if (!(await Alerta.confirmar({ texto: "¿Deseas eliminar este servicio monitoreable?" }))) return

    const res = await fetch(API_URLS.serviciosmonitoreables, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    })

    const resultado = await res.json()
    if (resultado.success) {
      toast.success("Servicio eliminado")
      obtenerServicios()
    } else {
      toast.error("Error al eliminar")
    }
  }

  const editarServicio = (servicio) => {
    setEditId(servicio.id)
    setValue("nombre", servicio.nombre)
    setValue("acumulable", servicio.acumulable === 1 || servicio.acumulable === "1")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const cancelarEdicion = () => {
    setEditId(null)
    reset()
  }

  useEffect(() => {
    obtenerServicios()
    registrarse()
  }, [])

  const serviciosFiltrados = servicios.filter((s) => s.nombre?.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editId ? "Editar Servicio Monitoreable" : "Servicios Monitoreables"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          {...register("nombre", { required: true })}
          className="border p-2 w-full"
          placeholder="Nombre del servicio"
          title="Ingrese el nombre del servicio monitoreable"
        />
        <div className="flex items-center gap-2 border p-2">
          <input type="checkbox" {...register("acumulable")} id="acumulable" className="w-5 h-5 cursor-pointer" />
          <label htmlFor="acumulable" className="cursor-pointer select-none">
            Acumulable
          </label>
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1">
            {editId ? "Actualizar" : "Agregar"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col items-center mt-8 border p-8 rounded w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 w-full">
          <input
            type="text"
            placeholder="Buscar servicio monitoreable..."
            className="w-full border bg-lime-100 border-blue-500 p-2"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            onClick={obtenerServicios}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <FaSyncAlt />
            Actualizar
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left">Nombre del Servicio</th>
                <th className="border p-2 text-center">Acumulable</th>
                <th className="border p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {serviciosFiltrados.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-gray-50">
                  <td className="border p-2">{servicio.id}</td>
                  <td className="border p-2">{servicio.nombre}</td>
                  <td className="border p-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="checkbox"
                        checked={servicio.acumulable === 1 || servicio.acumulable === "1"}
                        readOnly
                        className="w-5 h-5 cursor-default"
                      />
                      <span
                        className={`text-sm ${servicio.acumulable === 1 || servicio.acumulable === "1" ? "text-green-600 font-semibold" : "text-gray-400"}`}
                      >
                        {servicio.acumulable === 1 || servicio.acumulable === "1" ? "Acumulable" : ""}
                      </span>
                    </div>
                  </td>
                  <td className="border p-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => editarServicio(servicio)}
                        className="bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600 flex items-center gap-1"
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        onClick={() => eliminarServicio(servicio.id)}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {serviciosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500 border">
                    No hay servicios monitoreables registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
