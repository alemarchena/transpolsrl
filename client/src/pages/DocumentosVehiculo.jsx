import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api"
import Alerta from "../pages/Alertas"

const formatearFechaHoraSQL = (fechaSQL) => {
  if (!fechaSQL) return ""
  const partes = fechaSQL.split(" ")
  if (partes.length === 2) {
    const [fecha, hora] = partes
    const [year, month, day] = fecha.split("-")
    const [hours, minutes] = hora.split(":")
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }
  return ""
}

const agregarCacheBuster = (url) => {
  if (!url) return url
  const separador = url.includes("?") ? "&" : "?"
  return `${url}${separador}t=${Date.now()}`
}

export default function DocumentosVehiculo() {
  const [busqueda, setBusqueda] = useState("")
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null)
  const [vehiculos, setVehiculos] = useState([])
  const [documentos, setDocumentos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [visor, setVisor] = useState(null)
  const [descripcion, setDescripcion] = useState("")
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const [procesando, setProcesando] = useState(false)

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Documentos vehículo')
  }
  // Cargar lista de vehículos
  const cargarVehiculos = async () => {
    setCargando(true)
    try {
      const res = await fetch(API_URLS.vehiculos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get" }),
      })
      const data = await res.json()
      setVehiculos(data || [])
    } catch {
      Alerta.error("Error cargando vehículos")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarVehiculos()
    registrarse()
  }, [])

  // Buscar documentos de un vehículo
  const buscarDocumentos = async () => {
    if (!vehiculoSeleccionado) {
      Alerta.error("Debes seleccionar un vehículo primero")
      return
    }
    setCargando(true)
    try {
      const res = await fetch(API_URLS.documentosvehiculo, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "buscarVehiculo",
          busqueda: vehiculoSeleccionado.patente || vehiculoSeleccionado.numerointerno,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setDocumentos(data.documentos)
      } else {
        Alerta.error(data.error || "Vehículo no encontrado")
        setDocumentos([])
      }
    } catch {
      Alerta.error("Error buscando documentación")
    } finally {
      setCargando(false)
    }
  }

  // Subir archivos con barra de progreso real
  const subirArchivos = async (files) => {

    
    try {
      const formData = new FormData()
      formData.append("action", "subirArchivos")
      formData.append("idVehiculo", vehiculoSeleccionado.id)
      formData.append("descripcion", descripcion)
      files.forEach((f) => formData.append("archivos[]", f))

      setProcesando(true)
      setProgreso(0)

      const xhr = new XMLHttpRequest()
      xhr.open("POST", API_URLS.documentosvehiculo, true)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded * 100) / e.total)
          setProgreso(percent)
        }
      }

      xhr.onload = () => {
        setProgreso(100)
        const data = JSON.parse(xhr.responseText)
        if (data.success) {
          setDocumentos(data.documentos)
          Alerta.exito("Archivos subidos correctamente")
        } else {
          Alerta.error(data.error || "Error al subir archivos")
        }
        setProcesando(false)
        setTimeout(() => setProgreso(0), 800)
      }

      xhr.onerror = () => {
        Alerta.error("Error de red al subir archivos")
        setProcesando(false)
        setProgreso(0)
      }

      xhr.send(formData)
    } catch (err) {
      console.error(err)
      Alerta.error("Error en la subida")
      setProcesando(false)
      setProgreso(0)
    }
  }

  // Manejar archivos seleccionados
  const manejarArchivos = async (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer?.files || e.target.files)

    if (!vehiculoSeleccionado) {
      Alerta.error("Primero selecciona un vehículo")
      e.target.value = ''

      return
    }
    if (files.length === 0) {
      Alerta.error("No has seleccionado ningún archivo")
      e.target.value = ''

      return
    }

    if(descripcion.trim() == '' )
    {
      Alerta.error("La descripción es obligatoria")
      e.target.value = ''

      return
    }



    // Validar que solo contenga caracteres seguros (letras, números, espacios, guiones, puntos y guiones bajos)
    const caracteresValidos = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ._-]+$/
    if (!caracteresValidos.test(descripcion)) {
      Alerta.error(
        "La descripción contiene caracteres no permitidos.",
      )
      e.target.value = ''

      return
    }

    
    await subirArchivos(files)
  }

  // Eliminar documento
  const eliminarDocumento = async (id) => {
    if (!(await Alerta.confirmar({ texto: "¿Deseas eliminar este documento?" }))) return

    setCargando(true)
    try {
      const res = await fetch(API_URLS.documentosvehiculo, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "eliminarDocumento", id }),
      })
      const data = await res.json()
      if (data.success) {
        Alerta.exito("Documento eliminado")
        setDocumentos(data.documentos)
      } else {
        Alerta.error(data.error || "Error al eliminar")
      }
    } catch {
      Alerta.error("Error al eliminar")
    } finally {
      setCargando(false)
    }
  }

  const abrirVisor = (url) => {
    setVisor(agregarCacheBuster(url))
  }

  // Descargar todos los documentos como ZIP
  const descargarTodos = async () => {
    if (documentos.length === 0) {
      Alerta.error("No hay documentos para descargar")
      return
    }

    setProcesando(true)
    setProgreso(10)

    try {
      const response = await fetch(API_URLS.documentosvehiculo, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "descargarTodos",
          idVehiculo: vehiculoSeleccionado.id,
        }),
      })

      setProgreso(50)

      if (!response.ok) {
        throw new Error("Error al descargar archivos")
      }

      const blob = await response.blob()
      setProgreso(80)

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `documentos_${vehiculoSeleccionado.patente}_${Date.now()}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setProgreso(100)
      Alerta.exito(`${documentos.length} archivo(s) descargado(s) en ZIP`)
    } catch (err) {
      console.error(err)
      Alerta.error("Error al descargar archivos")
    } finally {
      setProcesando(false)
      setTimeout(() => setProgreso(0), 800)
    }
  }

  // Filtrar sugerencias
  const sugerencias = vehiculos.filter((v) =>
    `${v.patente} ${v.numerointerno}`.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Documentación de Vehículos</h1>

      {/* Buscador */}
      <div className="relative mb-4">
        <input
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value)
            setMostrarSugerencias(true)
          }}
          placeholder="Buscar por patente o número interno"
          className="border bg-lime-100 border-blue-500 p-2 w-full"
        />
        {mostrarSugerencias && sugerencias.length > 0 && (
          <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto">
            {sugerencias.map((v) => (
              <li
                key={v.id}
                className={`p-2 cursor-pointer hover:bg-blue-100 ${
                  vehiculoSeleccionado?.id === v.id ? "bg-blue-200" : ""
                }`}
                onClick={() => {
                  setVehiculoSeleccionado(v)
                  setBusqueda(`${v.patente} (${v.numerointerno})`)
                  setMostrarSugerencias(false)
                }}
              >
                {v.patente} - {v.marca} ({v.numerointerno})
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={buscarDocumentos} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        Buscar Documentación
      </button>

      {/* Zona de carga */}
      {vehiculoSeleccionado && (
        <>
          <h2 className="font-semibold mb-2 text-lg text-blue-800">
            Vehículo: {vehiculoSeleccionado.patente} ({vehiculoSeleccionado.numerointerno})
          </h2>

          <input
            type="text"
            placeholder="Descripción obligatoria"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div
            className="border-2 border-dashed border-blue-400 bg-blue-50 p-6 text-center rounded-lg cursor-pointer hover:bg-blue-100 transition"
            onDrop={manejarArchivos}
            onDragOver={(e) => e.preventDefault()}
          >
            <p className="mb-3 text-gray-600">Arrastra y suelta archivos PDF aquí o selecciona desde tu dispositivo</p>

            <label className="inline-block bg-blue-600 text-white font-semibold px-5 py-2 rounded shadow hover:bg-blue-700 cursor-pointer">
              Seleccionar Archivos
              <input type="file" multiple accept="application/pdf" onChange={manejarArchivos} className="hidden" />
            </label>
          </div>
        </>
      )}

      {documentos.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Documentos cargados</h3>
            <button
              onClick={descargarTodos}
              disabled={procesando}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Descargar Todos ({documentos.length})
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Archivo</th>
                  <th className="border border-gray-300 p-2 text-left">Descripción</th>
                  <th className="border border-gray-300 p-2 text-left">Fecha Subida</th>
                  <th className="border border-gray-300 p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{doc.nombreArchivo}</td>
                    <td className="border border-gray-300 p-2">{doc.descripcion || "-"}</td>
                    <td className="border border-gray-300 p-2">{formatearFechaHoraSQL(doc.fechaSubida)}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => abrirVisor(doc.archivoUrl)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => eliminarDocumento(doc.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Barra de progreso */}
      {procesando && (
        <div className="w-full bg-gray-200 rounded mt-4">
          <div
            className="bg-blue-600 text-white text-center rounded transition-all duration-200"
            style={{ width: `${progreso}%` }}
          >
            {progreso}%
          </div>
        </div>
      )}

      {/* Modal visor PDF */}
      {visor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 relative">
            <button
              onClick={() => setVisor(null)}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              X
            </button>
            <iframe src={visor} title="Visor PDF" className="w-full h-full border"></iframe>
          </div>
        </div>
      )}
    </div>
  )
}