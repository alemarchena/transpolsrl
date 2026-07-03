import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { useForm } from "react-hook-form"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import ExcelJS from "exceljs"
import { API_URLS } from "../api/api"
import Loader from "../components/Loader"
import { toast } from "react-toastify"
import Alerta from "../pages/Alertas"
import { FaSyncAlt, FaTrash, FaSort, FaSortUp, FaSortDown, FaFileAlt } from "react-icons/fa"
import { AiOutlineDownload, AiOutlineClose, AiOutlineDelete } from "react-icons/ai"
import { formatearFechaDDMMYYYY } from "../utils/formatoFechas"
import { capitalizarTexto, nombreCompleto } from "../utils/capitalizarTexto";

export default function Personas() {
  const [personas, setPersonas] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [editId, setEditId] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [ordenColumna, setOrdenColumna] = useState("apellido")
  const [ordenDireccion, setOrdenDireccion] = useState("asc")
  const [loading, setLoading] = useState(false)

  const [mostrarDocumentos, setMostrarDocumentos] = useState(false)
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null)
  const [documentos, setDocumentos] = useState([])
  const [subiendoArchivo, setSubiendoArchivo] = useState(false)
  const [progresoSubida, setProgresoSubida] = useState(0)
  const [nombreDocumento, setNombreDocumento] = useState("")
  const [visor, setVisor] = useState(null)
  const [tipoVisor, setTipoVisor] = useState(null)
  const [archivoTemporal, setArchivoTemporal] = useState(null)
  const [mostrarInactivos, setMostrarInactivos] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm()
  const API_URL = API_URLS.personas

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
    if(yaregistrado.current) return
    yaregistrado.current = true
    const emaillocal = getEmailFromLocalStorage()
    if(!emaillocal) return
    registrarIngreso(API_URLS.usuarios,emaillocal,'Personas')
  }

  useEffect(() => {
    obtenerPersonas()
    obtenerEmpresas()
    registrarse()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (visor) {
          cerrarVisor()
        } else if (mostrarDocumentos) {
          setMostrarDocumentos(false)
          setPersonaSeleccionada(null)
          setDocumentos([])
          setNombreDocumento("")
          setArchivoTemporal(null)
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [visor, mostrarDocumentos])

  // Recargar cuando cambia mostrarInactivos
  useEffect(() => {
    obtenerPersonas()
  }, [mostrarInactivos])

  const obtenerPersonas = async () => {
    setLoading(true)
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "get",
        mostrar_inactivos: mostrarInactivos
      }),
    })
    const data = await response.json()
    if (Array.isArray(data)) {
      setPersonas(data)
    }
    setLoading(false)
  }

  const toggleInactivo = async (id, estadoActual) => {
    // estadoActual: 1 = inactivo, 0 = activo
    const nuevoEstado = estadoActual === 1 ? 0 : 1  // Si está inactivo (1) lo activo (0), si está activo (0) lo inactivo (1)
    const mensajeConfirmacion = estadoActual === 1
      ? "¿Deseas activar esta persona?" 
      : "¿Deseas desactivar esta persona? Podrás verla más tarde activando 'Mostrar inactivos'."

    if (!(await Alerta.confirmar({ texto: mensajeConfirmacion }))) return

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "toggleInactivo",
          id: id,
          nuevo_estado: nuevoEstado
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message)
        obtenerPersonas()
      } else {
        toast.error(data.error || "Error al cambiar estado")
      }
    } catch (error) {
      toast.error("Error de conexión")
    }
  }

  const obtenerEmpresas = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getEmpresas" }),
      })
      const data = await res.json()
      setEmpresas(data)
    } catch (error) {
      toast.error("Error cargando empresas")
    }
  }

  const obtenerDocumentos = async (idPersona) => {
    try {
      const res = await fetch(API_URLS.documentospersona, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", idPersona }),
      })
      const data = await res.json()
      if (data.success && Array.isArray(data.documentos)) {
        setDocumentos(data.documentos)
      }
    } catch (error) {
      toast.error("Error al obtener documentos")
    }
  }

  const abrirDocumentos = (persona) => {
    setPersonaSeleccionada(persona)
    setMostrarDocumentos(true)
    obtenerDocumentos(persona.id)
  }

  const confirmarSubidaArchivo = async () => {
    if (!archivoTemporal) return
    if (!nombreDocumento.trim()) {
      toast.error("Por favor ingresa un nombre para el documento")
      return
    }
    await realizarSubida(archivoTemporal, null)
  }

  const subirDocumento = async (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return

    const MAX_SIZE = 10 * 1024 * 1024
    if (archivo.size > MAX_SIZE) {
      toast.error(
        `El archivo es demasiado grande. Tamaño máximo: 10MB. Tu archivo: ${(archivo.size / 1024 / 1024).toFixed(2)}MB`,
      )
      e.target.value = ""
      return
    }

    if (!nombreDocumento.trim()) {
      setArchivoTemporal(archivo)
      toast.error("Por favor ingresa un nombre para el documento")
      return
    }

    await realizarSubida(archivo, e.target)
  }

  const realizarSubida = async (archivo, inputElement) => {
    const formData = new FormData()
    formData.append("archivo", archivo)
    formData.append("nombre", nombreDocumento)
    formData.append("idPersona", personaSeleccionada.id)
    formData.append("action", "upload")

    setSubiendoArchivo(true)
    setProgresoSubida(0)

    try {
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const porcentaje = Math.round((e.loaded / e.total) * 100)
          setProgresoSubida(porcentaje)
        }
      })
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText)
          if (data.success) {
            toast.success("Documento subido correctamente")
            if (data.documentos) {
              setDocumentos(data.documentos)
            }
            setNombreDocumento("")
            setArchivoTemporal(null)
            if (inputElement) inputElement.value = ""
          } else {
            toast.error(data.error || "Error al subir el documento")
          }
        }
        setSubiendoArchivo(false)
        setProgresoSubida(0)
      })
      xhr.addEventListener("error", () => {
        toast.error("Error de red al subir el documento")
        setSubiendoArchivo(false)
      })
      xhr.open("POST", API_URLS.documentospersona, true)
      xhr.send(formData)
    } catch (error) {
      console.error("Error al subir documento:", error)
      toast.error("Error al subir el documento")
      setSubiendoArchivo(false)
    }
  }

  const eliminarDocumento = async (id) => {
    if (!(await Alerta.confirmar({ texto: "¿Deseas eliminar este documento?" }))) return

    try {
      const res = await fetch(API_URLS.documentospersona, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Documento eliminado correctamente")
        if (data.documentos) {
          setDocumentos(data.documentos)
        }
      } else {
        toast.error(data.error || "Error al eliminar el documento")
      }
    } catch (error) {
      toast.error("Error al eliminar el documento")
    }
  }

  const actualizarEmpresa = async (idPersona, idEmpresa) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateEmpresa",
          id: idPersona,
          id_empresa: idEmpresa || null,
        }),
      })
      const resultado = await res.json()
      if (resultado.success) {
        setPersonas((prev) =>
          prev.map((p) =>
            p.id === idPersona ? { ...p, id_empresa: idEmpresa, empresa_nombre: resultado.persona.empresa_nombre } : p,
          ),
        )
        toast.success("Empresa actualizada correctamente")
      } else {
        toast.error(resultado.error || "Error al actualizar empresa")
      }
    } catch (error) {
      toast.error("Error de conexión al actualizar empresa")
    }
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
    if (!datos.dni || datos.dni.trim() === "") {
      toast.error("El DNI es obligatorio.")
      return
    }
    if (!datos.nombre || datos.nombre.trim() === "") {
      toast.error("El nombre es obligatorio.")
      return
    }
    if (!datos.apellido || datos.apellido.trim() === "") {
      toast.error("El apellido es obligatorio.")
      return
    }
    if (!datos.legajo || datos.legajo.trim() === "") {
      toast.error("El legajo es obligatorio.")
      return
    }
    if (!datos.nacimiento || datos.nacimiento.trim() === "") {
      toast.error("La fecha de nacimiento es obligatoria.")
      return
    }
    if (!datos.fecha_ingreso || datos.fecha_ingreso.trim() === "") {
      toast.error("La fecha de ingreso es obligatoria.")
      return
    }

    const action = editId ? "update" : "insert"
    const payload = { ...datos, action }
    // Convertir inactivo a número (0 o 1)
    payload.inactivo = datos.inactivo ? 1 : 0
    if (editId) payload.id = editId

    const dniRepetido = personas.some((p) => p.dni === datos.dni && p.id !== editId)
    if (dniRepetido) {
      toast.error("Ya existe una persona con ese DNI.")
      return
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const result = await response.json()

    if (result.success) {
      toast.success(editId ? "Persona actualizada con éxito." : "Persona agregada con éxito.")
      reset({
        legajo: "",
        dni: "",
        nombre: "",
        apellido: "",
        nacimiento: "",
        sexo: "M",
        direccion: "",
        whatsapp: "",
        fecha_ingreso: "",
        id_empresa: "",
        inactivo: false,
      })
      setEditId(null)
      obtenerPersonas()
    } else {
      toast.error(result.error || "Ocurrió un error al guardar.")
    }
  }

  const eliminarPersona = async (id) => {
    if (!(await Alerta.confirmar({ texto: "¿Deseas eliminar esta persona? Esta acción no se puede deshacer." }))) return

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message || "Persona eliminada correctamente.")
        obtenerPersonas()
      } else {
        toast.error(data.error || "No se pudo eliminar la persona.")
      }
    } catch (error) {
      console.error("Error al eliminar persona:", error)
      toast.error("Error de conexión al eliminar persona")
    }
  }

  const editarPersona = (item) => {
    setEditId(item.id)
    setValue("legajo", item.legajo)
    setValue("dni", item.dni)
    setValue("nombre", item.nombre)
    setValue("apellido", item.apellido)
    setValue("nacimiento", item.nacimiento)
    setValue("sexo", item.sexo)
    setValue("direccion", item.direccion)
    setValue("whatsapp", item.whatsapp)
    setValue("fecha_ingreso", item.fecha_ingreso)
    setValue("id_empresa", item.id_empresa || "")
    setValue("inactivo", item.inactivo === 1) // Convertir a booleano para checkbox
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const personasFiltradas = personas.filter((p) =>
    `${p.nombre} ${p.apellido} ${p.dni} ${p.empresa_nombre || ""}`.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const personasOrdenadas = [...personasFiltradas].sort((a, b) => {
    let valA, valB
    switch (ordenColumna) {
      case "legajo":
        valA = a.legajo || ""
        valB = b.legajo || ""
        break
      case "dni":
        valA = a.dni || ""
        valB = b.dni || ""
        break
      case "nombre":
        valA = a.nombre?.toLowerCase() || ""
        valB = b.nombre?.toLowerCase() || ""
        break
      case "apellido":
        valA = a.apellido?.toLowerCase() || ""
        valB = b.apellido?.toLowerCase() || ""
        break
      case "nacimiento":
        valA = new Date(a.nacimiento || "1900-01-01")
        valB = new Date(b.nacimiento || "1900-01-01")
        break
      case "sexo":
        valA = a.sexo || ""
        valB = b.sexo || ""
        break
      case "fecha_ingreso":
        valA = new Date(a.fecha_ingreso || "1900-01-01")
        valB = new Date(b.fecha_ingreso || "1900-01-01")
        break
      case "whatsapp":
        valA = a.whatsapp || ""
        valB = b.whatsapp || ""
        break
      case "empresa":
        valA = a.empresa_nombre?.toLowerCase() || ""
        valB = b.empresa_nombre?.toLowerCase() || ""
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
    const ws = wb.addWorksheet("Personas")
    ws.columns = [
      { header: "legajo", key: "legajo", width: 20 },
      { header: "DNI", key: "dni", width: 15 },
      { header: "Nombre", key: "nombre", width: 20 },
      { header: "Apellido", key: "apellido", width: 20 },
      { header: "Nacimiento", key: "nacimiento", width: 15 },
      { header: "Sexo", key: "sexo", width: 10 },
      { header: "Dirección", key: "direccion", width: 30 },
      { header: "WhatsApp", key: "whatsapp", width: 20 },
      { header: "Fecha Ingreso", key: "fecha_ingreso", width: 15 },
      { header: "Empresa", key: "empresa_nombre", width: 30 },
      { header: "Estado", key: "estado", width: 10 },
    ]
    personasOrdenadas.forEach((p) => {
      ws.addRow({
        ...p,
        nombre: capitalizarTexto(p.nombre),
        apellido: capitalizarTexto(p.apellido),
        empresa_nombre: capitalizarTexto(p.empresa_nombre),
        estado: Number(p.inactivo) === 1 ? "Inactivo" : "Activo",
      })
    })
    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer])
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "personas.xlsx"
    a.click()
    window.URL.revokeObjectURL(url)
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
    pdf.text("Listado de Personas", 10, 10)
    pdf.addImage(imgData, "PNG", 10, 20, 190, 0)
    pdf.save("personas.pdf")
  }

  const agregarCacheBuster = (url) => {
    if (!url) return url
    const separador = url.includes("?") ? "&" : "?"
    return `${url}${separador}t=${Date.now()}`
  }

  const abrirVisor = (url, archivo) => {
    const extension = archivo.split(".").pop().toLowerCase()
    if (extension === "pdf") {
      setTipoVisor("pdf")
    } else if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      setTipoVisor("imagen")
    }
    setVisor(agregarCacheBuster(url))
  }

  const cerrarVisor = () => {
    setVisor(null)
    setTipoVisor(null)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">{editId ? "Editar Persona" : "Personas"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="flex flex-col">
          <input
            {...register("legajo", { required: true })}
            placeholder="Legajo *"
            className={`border px-3 py-2 h-10 rounded ${errors.legajo ? "border-red-500" : ""}`}
          />
          {errors.legajo && <span className="text-red-500 text-xs mt-1">Campo obligatorio</span>}
        </div>
        <div className="flex flex-col">
          <input
            {...register("dni", { required: true })}
            placeholder="DNI *"
            className={`border px-3 py-2 h-10 rounded ${errors.dni ? "border-red-500" : ""}`}
          />
          {errors.dni && <span className="text-red-500 text-xs mt-1">Campo obligatorio</span>}
        </div>
        <div className="flex flex-col">
          <input
            {...register("nombre", { required: true })}
            placeholder="Nombre *"
            className={`border px-3 py-2 h-10 rounded ${errors.nombre ? "border-red-500" : ""}`}
          />
          {errors.nombre && <span className="text-red-500 text-xs mt-1">Campo obligatorio</span>}
        </div>
        <div className="flex flex-col">
          <input
            {...register("apellido", { required: true })}
            placeholder="Apellido *"
            className={`border px-3 py-2 h-10 rounded ${errors.apellido ? "border-red-500" : ""}`}
          />
          {errors.apellido && <span className="text-red-500 text-xs mt-1">Campo obligatorio</span>}
        </div>

        <select
          {...register("sexo")}
          className="border px-3 py-2 h-10 rounded text-gray-800 bg-white"
        >
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="X">Otro</option>
        </select>

        <select
          {...register("id_empresa")}
          className="border px-3 py-2 h-10 rounded text-gray-800 bg-white"
        >
          <option value="">Sin empresa</option>
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.razon_social}
            </option>
          ))}
        </select>

        <div className="flex flex-col">
          <input
            id="nacimiento"
            {...register("nacimiento", { required: true })}
            type="date"
            className={`border px-3 py-2 h-10 rounded ${errors.nacimiento ? "border-red-500" : ""}`}
          />
          <label htmlFor="nacimiento" className="text-center text-sm font-semibold text-gray-700 mb-1">
            Fecha de nacimiento *
          </label>
          {errors.nacimiento && <span className="text-red-500 text-xs mt-1">Campo obligatorio</span>}
        </div>

        <div className="flex flex-col">
          <input
            id="fecha_ingreso"
            {...register("fecha_ingreso", { required: true })}
            type="date"
            className={`border px-3 py-2 h-10 rounded ${errors.fecha_ingreso ? "border-red-500" : ""}`}
          />
          <label htmlFor="fecha_ingreso" className="text-center text-sm font-semibold text-gray-700 mb-1">
            Fecha de ingreso *
          </label>
          {errors.fecha_ingreso && <span className="text-red-500 text-xs mt-1">Campo obligatorio</span>}
        </div>

        <textarea
          {...register("direccion")}
          placeholder="Dirección"
          className="border px-3 py-2 h-10 rounded"
        />

        <div className="flex flex-col">
          <div className="flex">
            <input
              id="whatsapp"
              {...register("whatsapp")}
              placeholder="Ej: 549261123456"
              className="border px-3 py-2 h-10 rounded-l w-full"
            />
            {watch("whatsapp") && (
              <a
                href={`https://wa.me/${watch("whatsapp")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-4 flex items-center rounded-r"
              >
                Ir
              </a>
            )}
          </div>
          <label htmlFor="whatsapp" className="text-sm font-semibold text-gray-700 mb-1">
            WhatsApp
          </label>
        </div>

        {/* Campo inactivo */}
        <div className="flex flex-col md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("inactivo")}
              className="w-4 h-4"
            />
            <span className="text-sm font-semibold text-gray-700">Usuario inactivo</span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            Si está marcado, la persona no aparecerá en listados normales
          </p>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 h-10 rounded hover:bg-blue-700 md:col-span-5">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {/* Barra de búsqueda y filtros - CORREGIDO: solo un buscador */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="flex gap-2 flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, DNI o empresa..."
            className="p-2 border bg-lime-100 border-blue-500 rounded w-full md:w-96"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <label className="flex items-center gap-2 px-3 py-2 border rounded bg-yellow-100 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={mostrarInactivos}
              onChange={(e) => setMostrarInactivos(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm bg-yellow-100">Mostrar inactivos</span>
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={obtenerPersonas}
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

      {loading ? (
        <Loader mensaje="Cargando personas..." />
      ) : (
        <div className="overflow-x-auto">
          <table id="tabla-exportar" className="min-w-full bg-white border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border cursor-pointer hover:bg-gray-200 select-none" onClick={() => manejarOrdenamiento("legajo")}>
                  Legajo {obtenerIconoOrden("legajo")}
                </th>
                <th className="p-2 border cursor-pointer hover:bg-gray-200 select-none" onClick={() => manejarOrdenamiento("dni")}>
                  DNI {obtenerIconoOrden("dni")}
                </th>
                <th className="p-2 border cursor-pointer hover:bg-gray-200 select-none" onClick={() => manejarOrdenamiento("apellido")}>
                  Apellido {obtenerIconoOrden("apellido")}
                </th>
                <th className="p-2 border cursor-pointer hover:bg-gray-200 select-none" onClick={() => manejarOrdenamiento("nombre")}>
                  Nombre {obtenerIconoOrden("nombre")}
                </th>
                <th className="p-2 border cursor-pointer hover:bg-gray-200 select-none" onClick={() => manejarOrdenamiento("nacimiento")}>
                  Nacimiento {obtenerIconoOrden("nacimiento")}
                </th>
                <th className="p-2 border cursor-pointer hover:bg-gray-200 select-none" onClick={() => manejarOrdenamiento("sexo")}>
                  Sexo {obtenerIconoOrden("sexo")}
                </th>
                <th className="p-2 border cursor-pointer hover:bg-gray-200 select-none" onClick={() => manejarOrdenamiento("fecha_ingreso")}>
                  Fecha Ingreso {obtenerIconoOrden("fecha_ingreso")}
                </th>
                <th className="p-2 border cursor-pointer hover:bg-gray-200 select-none" onClick={() => manejarOrdenamiento("whatsapp")}>
                  WhatsApp {obtenerIconoOrden("whatsapp")}
                </th>
                <th className="p-2 border cursor-pointer hover:bg-gray-200 select-none" onClick={() => manejarOrdenamiento("empresa")}>
                  Empresa {obtenerIconoOrden("empresa")}
                </th>
                <th className="p-2 border">Estado</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personasOrdenadas.map((item) => (
                <tr key={item.id} className={`text-center border-t ${Number(item.inactivo) === 1 ? 'bg-gray-100 opacity-75' : ''}`}>                  
                  <td className="p-2 border">{item.legajo}</td>
                  <td className="p-2 border">{item.dni}</td>
                  <td className="p-2 border">{capitalizarTexto(item.apellido)}</td>
                  <td className="p-2 border">{capitalizarTexto(item.nombre)}</td>
                  <td className="p-2 border">{formatearFechaDDMMYYYY(item.nacimiento)}</td>
                  <td className="p-2 border">{item.sexo}</td>
                  <td className="p-2 border">{formatearFechaDDMMYYYY(item.fecha_ingreso)}</td>
                  <td className="p-2 border">
                    {item.whatsapp ? (
                      <a href={`https://wa.me/${item.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:underline">
                        {item.whatsapp}
                      </a>
                    ) : "-"}
                  </td>
                  <td className="p-2 border">
                    <select
                      value={item.id_empresa || ""}
                      onChange={(e) => actualizarEmpresa(item.id, e.target.value || null)}
                      className="border px-2 py-1 rounded text-xs w-full max-w-[150px]"
                      disabled={Number(item.inactivo) === 1}
                    >
                      <option value="">Sin empresa</option>
                      {empresas.map((empresa) => (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.razon_social}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${Number(item.inactivo) === 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {Number(item.inactivo) === 1  ? 'Inactivo' : 'Activo'}
                    </span>
                  </td>
                  <td className="p-2 border flex justify-center gap-2">
                    <button
                      onClick={() => editarPersona(item)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                      disabled={Number(item.inactivo) === 1}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => toggleInactivo(item.id, Number(item.inactivo))}
                      className={`px-2 py-1 rounded text-sm text-white ${Number(item.inactivo) === 1 ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                    >
                      {Number(item.inactivo) === 1 ? 'Activar' : 'Desactivar'}
                    </button>
                    <button
                      onClick={() => eliminarPersona(item.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                      disabled={Number(item.inactivo) === 1}
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => abrirDocumentos(item)}
                      className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                      title="Documentos"
                    >
                      <FaFileAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarDocumentos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Documentos de {personaSeleccionada?.nombre} {personaSeleccionada?.apellido}
              </h2>
              <button
                onClick={() => {
                  setMostrarDocumentos(false)
                  setPersonaSeleccionada(null)
                  setDocumentos([])
                  setNombreDocumento("")
                  setArchivoTemporal(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Subir Nuevo Documento</h3>
              <div className="flex gap-2 items-end flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium mb-1">Nombre del documento</label>
                  <input
                    type="text"
                    value={nombreDocumento}
                    onChange={(e) => setNombreDocumento(e.target.value)}
                    placeholder="ej: DNI, Carnet de Conducir, Certificado..."
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer inline-block">
                    {subiendoArchivo ? "Subiendo..." : "Seleccionar Archivo"}
                    <input
                      type="file"
                      onChange={subirDocumento}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      disabled={subiendoArchivo}
                    />
                  </label>
                </div>
                {archivoTemporal && (
                  <button
                    type="button"
                    onClick={confirmarSubidaArchivo}
                    disabled={subiendoArchivo || !nombreDocumento.trim()}
                    className="rounded bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:bg-gray-300"
                  >
                    Confirmar
                  </button>
                )}
              </div>
              {subiendoArchivo && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${progresoSubida}%` }}
                    />
                  </div>
                  <p className="text-sm text-center mt-1">{progresoSubida}%</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-3">Documentos Guardados</h3>
              {documentos.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay documentos cargados</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentos.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg">{doc.nombre}</h4>
                        <button
                          onClick={() => eliminarDocumento(doc.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <AiOutlineDelete size={20} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Subido: {new Date(doc.fechaSubida).toLocaleDateString("es-AR")}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirVisor(doc.archivoUrl, doc.archivo)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 inline-flex items-center gap-2"
                        >
                          Ver
                        </button>
                        <a
                          href={doc.archivoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 inline-flex items-center gap-2"
                        >
                          <AiOutlineDownload /> Descargar
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {visor && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg w-[90%] h-[90%] relative flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Vista Previa</h3>
              <button onClick={cerrarVisor} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Cerrar
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {tipoVisor === "pdf" ? (
                <iframe src={visor} title="Visor PDF" className="w-full h-full border-0"></iframe>
              ) : (
                <img
                  src={visor || "/placeholder.svg"}
                  alt="Vista previa"
                  className="max-w-full max-h-full mx-auto object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
