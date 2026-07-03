import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { useForm } from "react-hook-form"
import { API_URLS } from "../api/api"
import { toast } from "react-toastify"
import Alerta from "../pages/Alertas"
import { FaTrash, FaSyncAlt } from "react-icons/fa"

export default function TiposCombustible() {
  const [tipos, setTipos] = useState([])
  const [editId, setEditId] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const { register, handleSubmit, reset, setValue } = useForm()

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Tipos de Combustible')
  }

  const obtenerTipos = async () => {
    const res = await fetch(API_URLS.tiposcombustible, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    })
    const data = await res.json()
    setTipos(Array.isArray(data) ? data : [])
  }

  const onSubmit = async (datos) => {
    const action = editId ? "update" : "insert"
    const payload = { ...datos, action }
    if (editId) payload.idtipo = editId

    const res = await fetch(API_URLS.tiposcombustible, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const resultado = await res.json()
    if (resultado.success) {
      toast.success(editId ? "Tipo actualizado" : "Tipo agregado")
      reset()
      setEditId(null)
      obtenerTipos()
    } else {
      toast.error("Error al guardar")
    }
  }

  const eliminarTipo = async (id) => {
    if (!(await Alerta.confirmar({ texto: "¿Deseas eliminar este tipo de combustible?" }))) return

    const res = await fetch(API_URLS.tiposcombustible, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", idtipo: id }),
    })

    const resultado = await res.json()
    if (resultado.success) {
      toast.success("Tipo eliminado")
      obtenerTipos()
    } else {
      toast.error("Error al eliminar")
    }
  }

  const editarTipo = (tipo) => {
    setEditId(tipo.idtipo)
    setValue("nombrecombustible", tipo.nombrecombustible)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    obtenerTipos()
    registrarse()
  }, [])

  const tiposFiltrados = tipos.filter((t) => t.nombrecombustible?.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editId ? "Editar Tipo de Combustible" : "Tipos de Combustible"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          {...register("nombrecombustible", { required: true })}
          className="border p-2 w-full"
          placeholder="Nombre del combustible (ej: Nafta Super, Gasoil)"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <div className="flex flex-col items-center mt-8 border p-8 rounded w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 w-full">
          <input
            type="text"
            placeholder="Buscar tipo de combustible..."
            className="w-full border bg-lime-100 border-blue-500 p-2"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            onClick={obtenerTipos}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <FaSyncAlt />
            Actualizar
          </button>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-2 font-semibold text-gray-700 p-2 border-b">
            <span>Tipo de Combustible</span>
            <span>Acciones</span>
          </div>
          {tiposFiltrados.map((tipo) => (
            <div key={tipo.idtipo} className="grid grid-cols-2 gap-2 py-2 border-b items-center">
              <div>{tipo.nombrecombustible}</div>
              <div className="flex gap-2">
                <button onClick={() => editarTipo(tipo)} className="bg-yellow-500 text-white px-2 py-1 text-sm rounded">
                  Editar
                </button>
                <button
                  onClick={() => eliminarTipo(tipo.idtipo)}
                  className="bg-red-600 text-white px-2 py-1 text-sm rounded"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          {tiposFiltrados.length === 0 && (
            <div className="text-center py-4 text-gray-500">No hay tipos de combustible registrados</div>
          )}
        </div>
      </div>
    </div>
  )
}
