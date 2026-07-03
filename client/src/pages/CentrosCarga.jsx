import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { useForm } from "react-hook-form"
import { API_URLS } from "../api/api"
import { toast } from "react-toastify"
import Alerta from "../pages/Alertas"
import { FaTrash, FaSyncAlt } from "react-icons/fa"

export default function CentrosCarga() {
  const [centros, setCentros] = useState([])
  const [editId, setEditId] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const { register, handleSubmit, reset, setValue } = useForm()

  const obtenerCentros = async () => {
    const res = await fetch(API_URLS.centroscarga, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    })
    const data = await res.json()
    setCentros(Array.isArray(data) ? data : [])
  }

    const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Centros de carga')

  }

  const onSubmit = async (datos) => {
    const action = editId ? "update" : "insert"
    const payload = { ...datos, action }
    if (editId) payload.idcentro = editId

    const res = await fetch(API_URLS.centroscarga, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const resultado = await res.json()
    if (resultado.success) {
      toast.success(editId ? "Centro actualizado" : "Centro agregado")
      reset()
      setEditId(null)
      obtenerCentros()
    } else {
      toast.error("Error al guardar")
    }
  }

  const eliminarCentro = async (id) => {
    if (!(await Alerta.confirmar({ texto: "¿Deseas eliminar este centro de carga?" }))) return

    const res = await fetch(API_URLS.centroscarga, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", idcentro: id }),
    })

    const resultado = await res.json()
    if (resultado.success) {
      toast.success("Centro eliminado")
      obtenerCentros()
    } else {
      toast.error("Error al eliminar")
    }
  }

  const editarCentro = (centro) => {
    setEditId(centro.idcentro)
    setValue("nombrecentro", centro.nombrecentro)
    setValue("direccioncentro", centro.direccioncentro)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    obtenerCentros()
    registrarse()
  }, [])

  const centrosFiltrados = centros.filter(
    (c) =>
      c.nombrecentro?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.direccioncentro?.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editId ? "Editar Centro de Carga" : "Centros de Carga"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          {...register("nombrecentro", { required: true })}
          className="border p-2 w-full"
          placeholder="Nombre del centro"
        />
        <input {...register("direccioncentro")} className="border p-2 w-full md:col-span-2" placeholder="Dirección" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <div className="flex flex-col items-center mt-8 border p-8 rounded w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 w-full">
          <input
            type="text"
            placeholder="Buscar por nombre o dirección..."
            className="w-full border bg-lime-100 border-blue-500 p-2"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            onClick={obtenerCentros}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <FaSyncAlt />
            Actualizar
          </button>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-3 font-semibold text-gray-700 p-2 border-b">
            <span>Nombre</span>
            <span>Dirección</span>
            <span>Acciones</span>
          </div>
          {centrosFiltrados.map((centro) => (
            <div key={centro.idcentro} className="grid grid-cols-3 gap-2 py-2 border-b items-center">
              <div>{centro.nombrecentro}</div>
              <div>{centro.direccioncentro || "-"}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => editarCentro(centro)}
                  className="bg-yellow-500 text-white px-2 py-1 text-sm rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarCentro(centro.idcentro)}
                  className="bg-red-600 text-white px-2 py-1 text-sm rounded"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          {centrosFiltrados.length === 0 && (
            <div className="text-center py-4 text-gray-500">No hay centros de carga registrados</div>
          )}
        </div>
      </div>
    </div>
  )
}
