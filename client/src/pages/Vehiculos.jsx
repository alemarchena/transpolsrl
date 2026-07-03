import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { useForm } from "react-hook-form"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { FaSyncAlt, FaTrash, FaRandom } from "react-icons/fa"
import ExcelJS from "exceljs"
import { format } from "date-fns"
import { API_URLS } from "../api/api"
import { toast } from "react-toastify"
import Alerta from "../pages/Alertas"

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [editId, setEditId] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [ordenCampo, setOrdenCampo] = useState("")
  const [ordenAsc, setOrdenAsc] = useState(true)
  const [esExterno, setEsExterno] = useState(false)
  const [cambiandoEstado, setCambiandoEstado] = useState({})

  const { register, handleSubmit, reset, setValue } = useForm()
  const API_URL = API_URLS.vehiculos

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
    if(yaregistrado.current) return
    yaregistrado.current = true
    const emaillocal = getEmailFromLocalStorage()
    if(!emaillocal) return
    registrarIngreso(API_URLS.usuarios,emaillocal,'Administracion de Vehiculos')
  }

  const obtenerTodosVehiculos = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" }),
      })
      const data = await res.json()
      
      console.log("Vehículos recibidos:", data)
      
      if (Array.isArray(data)) {
        setVehiculos(data)
      } else {
        console.error("La respuesta no es un array:", data)
        setVehiculos([])
      }
    } catch (error) {
      console.error("Error al obtener vehículos:", error)
      toast.error("Error al cargar los vehículos")
      setVehiculos([])
    }
  }

  useEffect(() => {
    obtenerTodosVehiculos()
    registrarse()
  }, [])

  const generarClaveAleatoria = async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generarClave" }),
    })
    const data = await res.json()
    if (data.success) {
      setValue("claveAcceso", data.clave)
      toast.success("Clave generada: " + data.clave)
    } else {
      toast.error(data.error || "Error al generar clave")
    }
  }

  const onSubmit = async (datos) => {
    const action = editId ? "update" : "insert"
    const payload = { ...datos, action }
    if (editId) payload.id = editId
    payload.esExterno = esExterno ? 1 : 0
    if (!esExterno) {
      payload.claveAcceso = null
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const resultado = await res.json()

    if (resultado.success) {
      toast.success(editId ? "Vehículo actualizado correctamente" : "Vehículo agregado correctamente")
      reset()
      setEditId(null)
      setEsExterno(false)
      obtenerTodosVehiculos()
    } else {
      toast.error(resultado.error || "Error al guardar el vehículo")
    }
  }

  const toggleEstadoVehiculo = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual
    const accion = nuevoEstado ? "activar" : "desactivar"
    
    setCambiandoEstado(prev => ({ ...prev, [id]: true }))

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: accion, id }),
      })
      const resultado = await res.json()
      
      if (resultado.success) {
        toast.success(nuevoEstado ? "Vehículo activado correctamente." : "Vehículo desactivado correctamente.")
        await obtenerTodosVehiculos()
      } else {
        toast.error(resultado.error || `No se pudo ${nuevoEstado ? 'activar' : 'desactivar'} el vehículo.`)
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      toast.error("Error al cambiar el estado del vehículo")
    } finally {
      setCambiandoEstado(prev => ({ ...prev, [id]: false }))
    }
  }

  const eliminarVehiculo = async (id) => {
    if (!(await Alerta.confirmar({ texto: "¿Deseas eliminar permanentemente este vehículo? Esta acción no se puede deshacer." }))) return
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    })
    const resultado = await res.json()
    if (resultado.success) {
      toast.success("Vehículo eliminado permanentemente.")
      obtenerTodosVehiculos()
    } else {
      toast.error(resultado.error || "No se pudo eliminar.")
    }
  }

  const editarVehiculo = (item) => {
    setEditId(item.id)
    setValue("numerointerno", item.numerointerno)
    setValue("patente", item.patente)
    setValue("marca", item.marca)
    setValue("modelo", item.modelo)
    setValue("anio", item.anio)
    setValue("descripcion", item.descripcion)
    setValue("cantidadbutacas", item.cantidadbutacas)
    setValue("numerochasis", item.numerochasis)
    setValue("kmfrecuenciacambioaceite", item.kmfrecuenciacambioaceite)
    const esExternoValor = item.esExterno == 1
    setValue("esExterno", esExternoValor)
    setEsExterno(esExternoValor)
    setValue("claveAcceso", item.claveAcceso || "")
  }

  const vehiculosFiltrados = vehiculos.filter(
    (item) =>
      item && (
        item.patente?.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.marca?.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.numerointerno?.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.modelo?.toLowerCase().includes(busqueda.toLowerCase())
      )
  )

  const vehiculosOrdenados = [...vehiculosFiltrados].sort((a, b) => {
    const valA = a[ordenCampo]?.toString().toLowerCase() || ""
    const valB = b[ordenCampo]?.toString().toLowerCase() || ""
    if (valA < valB) return ordenAsc ? -1 : 1
    if (valA > valB) return ordenAsc ? 1 : -1
    return 0
  })

  const exportarPDF = () => {
    const elemento = document.getElementById("tabla-vehiculos")
    html2canvas(elemento).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF()
      const fechaHora = format(new Date(), "yyyy-MM-dd HH:mm")
      const titulo = `Listado de vehículos - ${fechaHora}`
      pdf.setFontSize(14)
      pdf.text(titulo, 10, 10)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, "PNG", 0, 20, pdfWidth, pdfHeight)
      pdf.save(`vehiculos_${fechaHora}.pdf`)
    })
  }

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Vehículos")

    sheet.columns = [
      { header: "Número Interno", key: "numerointerno", width: 20 },
      { header: "Patente", key: "patente", width: 20 },
      { header: "Marca", key: "marca", width: 20 },
      { header: "Modelo", key: "modelo", width: 20 },
      { header: "Año", key: "anio", width: 10 },
      { header: "Butacas", key: "cantidadbutacas", width: 10 },
      { header: "N° Chasis", key: "numerochasis", width: 20 },
      { header: "KM Cambio Aceite", key: "kmfrecuenciacambioaceite", width: 20 },
      { header: "Descripción", key: "descripcion", width: 30 },
      { header: "Externo", key: "esExterno", width: 10 },
      { header: "Clave Acceso", key: "claveAcceso", width: 15 },
      { header: "Estado", key: "estado", width: 10 },
    ]

    vehiculosOrdenados.forEach((vehiculo) => {
      sheet.addRow({
        ...vehiculo,
        esExterno: vehiculo.esExterno == 1 ? "SÍ" : "No",
        estado: vehiculo.inactivo == 1 ? "INACTIVO" : "ACTIVO",
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    const fechaHora = format(new Date(), "yyyy-MM-dd_HH-mm")
    a.href = url
    a.download = `vehiculos_${fechaHora}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const ordenarPor = (campo) => {
    if (ordenCampo === campo) {
      setOrdenAsc(!ordenAsc)
    } else {
      setOrdenCampo(campo)
      setOrdenAsc(true)
    }
  }

  const ToggleSwitch = ({ activo, onChange, disabled }) => {
    return (
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${activo ? 'bg-green-600' : 'bg-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${activo ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vehículos</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-3 items-center rounded shadow">
        <div className="relative group">
          <input {...register("numerointerno")} placeholder="Número Interno" className="border p-2 w-full" />
          <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Identificador interno del vehículo
          </span>
        </div>

        <div className="relative group">
          <input {...register("patente", { required: true })} placeholder="Patente" className="border p-2 w-full" />
          <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Placa de identificación vehicular (requerido)
          </span>
        </div>

        <div className="relative group">
          <input {...register("marca", { required: true })} placeholder="Marca" className="border p-2 w-full" />
          <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Fabricante del vehículo (requerido)
          </span>
        </div>

        <div className="relative group">
          <input {...register("modelo", { required: true })} placeholder="Modelo" className="border p-2 w-full" />
          <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Modelo específico del vehículo (requerido)
          </span>
        </div>

        <div className="relative group">
          <input
            {...register("anio", { required: true })}
            type="number"
            placeholder="Año"
            className="border p-2 w-full"
          />
          <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Año de fabricación (requerido)
          </span>
        </div>

        <div className="relative group">
          <input
            {...register("cantidadbutacas")}
            type="number"
            placeholder="Cantidad de Butacas"
            className="border p-2 w-full"
          />
          <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Total de asientos disponibles
          </span>
        </div>

        <div className="relative group">
          <input {...register("numerochasis")} placeholder="Número de Chasis" className="border p-2 w-full" />
          <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Número único de identificación del chasis
          </span>
        </div>

        <div className="relative group">
          <input
            {...register("kmfrecuenciacambioaceite")}
            type="number"
            placeholder="Kilómetros entre cambio de aceite"
            className="border p-2 w-full"
          />
          <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Kilómetros entre cada cambio de aceite
          </span>
        </div>

        <div className="relative group md:col-span-2">
          <textarea {...register("descripcion")} placeholder="Descripción" className="border p-2 w-full" />
          <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Información adicional del vehículo
          </span>
        </div>

        <div className="md:col-span-3 flex items-center gap-2 border p-3 rounded bg-gray-50">
          <input
            type="checkbox"
            {...register("esExterno")}
            id="esExterno"
            onChange={(e) => setEsExterno(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="esExterno" className="font-medium cursor-pointer">
            Vehículo Externo (permite acceso externo para subir documentos)
          </label>
        </div>

        {esExterno && (
          <div className="md:col-span-3 border-2 border-blue-200 p-4 rounded bg-blue-50">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative group">
                <label className="block text-sm font-medium mb-1">Clave de Acceso (5 caracteres) *</label>
                <input
                  {...register("claveAcceso")}
                  placeholder="Ej: A3B7K"
                  maxLength={5}
                  className="border p-2 w-full uppercase"
                  style={{ textTransform: "uppercase" }}
                />
                <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  Clave única de 5 caracteres (letras y números)
                </span>
              </div>
              <button
                type="button"
                onClick={generarClaveAleatoria}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
              >
                <FaRandom /> Generar
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Esta clave permitirá que personas externas suban documentos solo para este vehículo
            </p>
          </div>
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <div className="flex flex-col items-center mt-8 border p-8 rounded w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 w-full">
          <input
            type="text"
            placeholder="Buscar por nº interno, patente, marca o modelo..."
            className="w-full border bg-lime-100 border-blue-500 p-2 md:w-1/2"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={obtenerTodosVehiculos}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaSyncAlt /> Actualizar
            </button>
            <button onClick={exportarPDF} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
              PDF
            </button>
            <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table id="tabla-vehiculos" className="min-w-full border border-gray-300 bg-white text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 cursor-pointer" onClick={() => ordenarPor("numerointerno")}>
                  N° Interno
                </th>
                <th className="p-2 cursor-pointer" onClick={() => ordenarPor("patente")}>
                  Patente
                </th>
                <th className="p-2 cursor-pointer" onClick={() => ordenarPor("marca")}>
                  Marca
                </th>
                <th className="p-2 cursor-pointer" onClick={() => ordenarPor("modelo")}>
                  Modelo
                </th>
                <th className="p-2 cursor-pointer" onClick={() => ordenarPor("anio")}>
                  Año
                </th>
                <th className="p-2 cursor-pointer" onClick={() => ordenarPor("cantidadbutacas")}>
                  Butacas
                </th>
                <th className="p-2 cursor-pointer" onClick={() => ordenarPor("numerochasis")}>
                  N° Chasis
                </th>
                <th className="p-2 cursor-pointer" onClick={() => ordenarPor("kmfrecuenciacambioaceite")}>
                  KM Cambio Aceite
                </th>
                <th className="p-2 cursor-pointer" onClick={() => ordenarPor("esExterno")}>
                  Externo
                </th>
                <th className="p-2">Clave</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculosOrdenados.length > 0 ? (
                vehiculosOrdenados.map((item) => (
                  <tr key={item.id} className={`text-center border-t ${item.inactivo == 1 ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}>
                    <td className="p-2">{item.numerointerno}</td>
                    <td className="p-2">{item.patente}</td>
                    <td className="p-2">{item.marca}</td>
                    <td className="p-2">{item.modelo}</td>
                    <td className="p-2">{item.anio}</td>
                    <td className="p-2">{item.cantidadbutacas}</td>
                    <td className="p-2">{item.numerochasis}</td>
                    <td className="p-2">{item.kmfrecuenciacambioaceite}</td>
                    <td className="p-2">
                      {item.esExterno == 1 ? (
                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">SÍ</span>
                      ) : (
                        <span className="text-gray-400 text-xs">No</span>
                      )}
                    </td>
                    <td className="p-2">
                      {item.claveAcceso ? (
                        <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs font-bold">
                          {item.claveAcceso}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-center gap-2">
                        <ToggleSwitch
                          activo={item.inactivo != 1}
                          onChange={() => toggleEstadoVehiculo(item.id, item.inactivo != 1)}
                          disabled={cambiandoEstado[item.id]}
                        />
                        <span className={`text-xs font-medium ${item.inactivo == 1 ? 'text-red-600' : 'text-green-600'}`}>
                          {item.inactivo == 1 ? 'Inactivo' : 'Activo'}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => editarVehiculo(item)}
                        className="bg-yellow-500 text-white px-2 py-2 text-sm rounded hover:bg-yellow-600 transition-colors"
                        title="Editar vehículo"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarVehiculo(item.id)}
                        className="bg-red-600 text-white px-2 py-2 text-sm rounded ml-2 hover:bg-red-700 transition-colors"
                        title="Eliminar permanentemente"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center py-4 text-gray-500">
                    No hay registros
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