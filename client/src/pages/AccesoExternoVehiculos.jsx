"use client"

import { useState, useEffect } from "react"
import { FaLock, FaCar, FaUpload, FaEye, FaDownload, FaTrash } from "react-icons/fa"
import { toast } from "react-toastify"
import { API_URLS } from "../api/api"
import Alerta from "../pages/Alertas"

const API_ACCESO = API_URLS.baseURL + "/acceso-externo-vehiculos.php"
const API_DOCUMENTOS = API_URLS.baseURL + "/documentosvehiculo.php"

export default function AccesoExternoVehiculos() {
  const [claveAcceso, setClaveAcceso] = useState("")
  const [vehiculoAutorizado, setVehiculoAutorizado] = useState(null)
  const [documentos, setDocumentos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [subiendoArchivo, setSubiendoArchivo] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const [descripcion, setDescripcion] = useState("")
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)
  const [visorAbierto, setVisorAbierto] = useState(false)
  const [documentoActual, setDocumentoActual] = useState(null)

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        if (visorAbierto) {
          setVisorAbierto(false)
        }
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [visorAbierto])

  const validarClave = async (e) => {
    e.preventDefault()

    if (!claveAcceso.trim()) {
      toast.error("Por favor ingrese la clave de acceso")
      return
    }

    setCargando(true)
    try {
      console.log("[v0] Enviando clave:", claveAcceso.trim(), "longitud:", claveAcceso.trim().length)

      const response = await fetch(API_ACCESO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "validarClave", claveAcceso: claveAcceso.trim() }),
      })

      const data = await response.json()

      console.log("[v0] Respuesta:", data)

      if (data.success) {
        setVehiculoAutorizado(data.vehiculo)
        setDocumentos(data.documentos || [])
        toast.success(`Acceso autorizado a vehículo ${data.vehiculo.patente}`)
      } else {
        toast.error(data.error || "Clave de acceso inválida")
      }
    } catch (error) {
      console.error("Error al validar clave:", error)
      toast.error("Error al validar la clave de acceso")
    } finally {
      setCargando(false)
    }
  }

  const subirArchivos = async () => {
    if (!archivoSeleccionado) {
      toast.error("Debe seleccionar un archivo")
      return
    }

    if (!descripcion.trim()) {
      toast.error("Debe ingresar una descripción del documento")
      return
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (archivoSeleccionado.size > MAX_FILE_SIZE) {
      const sizeMB = (archivoSeleccionado.size / (1024 * 1024)).toFixed(2)
      toast.error(`El archivo es muy grande (${sizeMB}MB). El límite es 10MB.`)
      return
    }

    setSubiendoArchivo(true)
    setProgreso(0)

    const formData = new FormData()
    formData.append("action", "subirArchivos")
    formData.append("idVehiculo", vehiculoAutorizado.idVehiculo)
    formData.append("descripcion", descripcion)
    formData.append("archivos[]", archivoSeleccionado)

    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const porcentaje = Math.round((e.loaded / e.total) * 100)
        setProgreso(porcentaje)
      }
    })

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText)
          if (data.success) {
            setDocumentos(data.documentos || [])
            toast.success("Documento subido exitosamente")
            setDescripcion("")
            setArchivoSeleccionado(null)
            document.getElementById("archivoInput").value = ""
          } else {
            toast.error(data.error || "Error al subir el documento")
          }
        } catch (error) {
          toast.error("Error al procesar la respuesta del servidor")
        }
      } else {
        toast.error("Error al subir el documento")
      }
      setSubiendoArchivo(false)
      setProgreso(0)
    })

    xhr.addEventListener("error", () => {
      toast.error("Error de red al subir el documento")
      setSubiendoArchivo(false)
      setProgreso(0)
    })

    xhr.open("POST", API_DOCUMENTOS)
    xhr.send(formData)
  }

  const eliminarDocumento = async (id) => {
    const confirmado = await Alerta.confirmar(
      "¿Está seguro de eliminar este documento?",
      "Esta acción no se puede deshacer",
    )

    if (!confirmado) return

    try {
      const response = await fetch(API_DOCUMENTOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "eliminarDocumento", id }),
      })

      const data = await response.json()

      if (data.success) {
        setDocumentos(data.documentos || [])
        toast.success("Documento eliminado")
      } else {
        toast.error(data.error || "Error al eliminar")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al eliminar el documento")
    }
  }

  const verDocumento = (doc) => {
    setDocumentoActual(doc)
    setVisorAbierto(true)
  }

  const cerrarSesion = () => {
    setVehiculoAutorizado(null)
    setDocumentos([])
    setClaveAcceso("")
    setDescripcion("")
    setArchivoSeleccionado(null)
  }

  const esPDF = (nombreArchivo) => {
    return nombreArchivo?.toLowerCase().endsWith(".pdf")
  }

  const construirUrlPDF = (url) => {
    // Agregar parámetros para mejorar la visualización del PDF en iframe
    return `${url}#toolbar=0&navpanes=0&scrollbar=1`
  }

  // Si no hay vehículo autorizado, mostrar formulario de login
  if (!vehiculoAutorizado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FaLock className="text-blue-600 text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Transpol S.R.L</h1>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Externo</h1>
            <p className="text-gray-600">Ingrese su clave de acceso para gestionar documentos del vehículo</p>
          </div>

          <form onSubmit={validarClave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clave de Acceso</label>
              <input
                type="text"
                value={claveAcceso}
                onChange={(e) => setClaveAcceso(e.target.value.toUpperCase())}
                placeholder="Ingrese su clave (5 caracteres)"
                maxLength={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase text-center text-lg font-mono tracking-wider"
                disabled={cargando}
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {cargando ? "Validando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Pantalla principal con gestión de documentos
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCar className="text-blue-600 text-2xl" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{vehiculoAutorizado.patente}</h1>
                <p className="text-sm text-gray-600">
                  {vehiculoAutorizado.marca} {vehiculoAutorizado.modelo} - {vehiculoAutorizado.anio}
                </p>
              </div>
            </div>
            <button
              onClick={cerrarSesion}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulario de subida */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaUpload /> Subir Documento
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Documento *</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: Seguro del vehículo, RTO, VTV, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={subiendoArchivo}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo (PDF, JPG, PNG - máx. 10MB) *
              </label>
              <input
                id="archivoInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setArchivoSeleccionado(e.target.files[0])}
                className="w-full"
                disabled={subiendoArchivo}
              />
            </div>

            {subiendoArchivo && (
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className="bg-blue-600 h-4 transition-all duration-300" style={{ width: `${progreso}%` }} />
              </div>
            )}

            <button
              onClick={subirArchivos}
              disabled={subiendoArchivo}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {subiendoArchivo ? `Subiendo... ${progreso}%` : "Subir Documento"}
            </button>
          </div>
        </div>

        {/* Lista de documentos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Documentos del Vehículo ({documentos.length})</h2>

          {documentos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay documentos cargados para este vehículo</p>
          ) : (
            <div className="space-y-3">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{doc.descripcion}</p>
                    <p className="text-sm text-gray-500">{doc.archivo}</p>
                    <p className="text-xs text-gray-400">{new Date(doc.fechaSubida).toLocaleString("es-AR")}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => verDocumento(doc)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      title="Ver documento"
                    >
                      <FaEye />
                    </button>
                    <a
                      href={doc.archivoUrl}
                      download
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                      title="Descargar"
                    >
                      <FaDownload />
                    </a>
                    <button
                      onClick={() => eliminarDocumento(doc.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal visor de documentos */}
      {visorAbierto && documentoActual && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setVisorAbierto(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">{documentoActual.descripcion}</h3>
              <button onClick={() => setVisorAbierto(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {esPDF(documentoActual.nombreArchivo || documentoActual.archivo) ? (
                <iframe
                  key={documentoActual.id}
                  src={construirUrlPDF(documentoActual.archivoUrl)}
                  className="w-full h-full border-0"
                  title="Vista previa PDF"
                  type="application/pdf"
                />
              ) : (
                <img
                  src={documentoActual.archivoUrl || "/placeholder.svg"}
                  alt={documentoActual.descripcion}
                  className="max-w-full h-auto mx-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
