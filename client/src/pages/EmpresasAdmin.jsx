import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api"
import { toast } from "react-toastify"
import Loader from "../components/Loader"
import { FaTrash, FaEdit, FaImage, FaSyncAlt } from "react-icons/fa"
import Alerta from "../pages/Alertas"
import SignatureCanvas from "react-signature-canvas"

export default function EmpresasAdmin() {
  const [empresas, setEmpresas] = useState([])
  const [editId, setEditId] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [formData, setFormData] = useState({
    razon_social: "",
    cuit: "",
    imagen_firma: null,
  })
  const [mostrarFirma, setMostrarFirma] = useState(false)
  const sigCanvasRef = useRef(null)

  // Referencias para limpiar inputs
  const inputFileRef = useRef(null)
  const previewImageRef = useRef(null)

  
  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Empresas')
  }

  // Obtener empresas
  const obtenerEmpresas = async () => {
    setCargando(true)
    try {
      const res = await fetch(API_URLS.empresas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get" }),
      })
      const data = await res.json()
      setEmpresas(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error("Error cargando empresas")
      setEmpresas([])
    }
    setCargando(false)
  }

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setFormData((prev) => ({
      ...prev,
      imagen_firma: file,
    }))

    // Mostrar preview de la imagen
    if (file && previewImageRef.current) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImageRef.current.src = e.target.result
        previewImageRef.current.style.display = "block"
      }
      reader.readAsDataURL(file)
    }
  }

  // Crear firma digital
  const crearFirmaDigital = async () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      toast.error("Debe dibujar la firma antes de guardar")
      return
    }

    const firmaBase64 = sigCanvasRef.current.toDataURL("image/png")

    // Convertir base64 a blob para enviarlo como archivo
    const response = await fetch(firmaBase64)
    const blob = await response.blob()

    // Crear un archivo desde el blob
    const nombreArchivo = `firma_digital_${Date.now()}.png`
    const archivoFirma = new File([blob], nombreArchivo, { type: "image/png" })

    // Actualizar el estado del formulario
    setFormData((prev) => ({
      ...prev,
      imagen_firma: archivoFirma,
    }))

    // Mostrar preview
    if (previewImageRef.current) {
      previewImageRef.current.src = firmaBase64
      previewImageRef.current.style.display = "block"
    }

    setMostrarFirma(false)
    toast.success("Firma digital creada correctamente")
  }

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      razon_social: "",
      cuit: "",
      imagen_firma: null,
    })
    setEditId(null)
    if (inputFileRef.current) inputFileRef.current.value = ""
    if (previewImageRef.current) previewImageRef.current.style.display = "none"
  }

  // Guardar empresa (crear o actualizar)
  const guardarEmpresa = async (e) => {
    e.preventDefault()

    if (!formData.razon_social.trim() || !formData.cuit.trim()) {
      toast.error("Razón social y CUIT son obligatorios")
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append("action", editId ? "update" : "insert")
    formDataToSend.append("razon_social", formData.razon_social.trim())
    formDataToSend.append("cuit", formData.cuit.trim())

    if (editId) {
      formDataToSend.append("id", editId)
    }

    if (formData.imagen_firma) {
      formDataToSend.append("imagen_firma", formData.imagen_firma)
    }

    setCargando(true)
    try {
      const res = await fetch(API_URLS.empresas, {
        method: "POST",
        body: formDataToSend,
      })
      const data = await res.json()

      if (data.success) {
        toast.success(data.message || (editId ? "Empresa actualizada correctamente" : "Empresa creada correctamente"))
        limpiarFormulario()
        obtenerEmpresas()
      } else {
        toast.error(data.error || "Error al guardar empresa")
      }
    } catch (error) {
      toast.error("Error de conexión al guardar empresa")
    }
    setCargando(false)
  }

  // Editar empresa
  const editarEmpresa = (empresa) => {
    setEditId(empresa.id)
    setFormData({
      razon_social: empresa.razon_social,
      cuit: empresa.cuit,
      imagen_firma: null,
    })

    // Mostrar imagen actual si existe
    if (empresa.imagen_firma_url && previewImageRef.current) {
      previewImageRef.current.src = empresa.imagen_firma_url
      previewImageRef.current.style.display = "block"
    }

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Eliminar empresa
  const eliminarEmpresa = async (id) => {
    if (!(await Alerta.confirmar({ texto: "¿Deseas eliminar esta empresa? Esta acción no se puede deshacer." }))) return

    try {
      const res = await fetch(API_URLS.empresas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success("Empresa eliminada correctamente")
        obtenerEmpresas()
      } else {
        toast.error(data.error || "Error al eliminar empresa")
      }
    } catch (error) {
      toast.error("Error de conexión al eliminar empresa")
    }
  }

  useEffect(() => {
    obtenerEmpresas()
    registrarse()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">{editId ? "Editar Empresa" : "Administración de Empresas"}</h2>

      {/* Formulario */}
      <form onSubmit={guardarEmpresa} className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Razón Social */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Razón Social *</label>
            <input
              type="text"
              name="razon_social"
              value={formData.razon_social}
              onChange={handleInputChange}
              placeholder="Ingrese la razón social"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* CUIT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CUIT *</label>
            <input
              type="text"
              name="cuit"
              value={formData.cuit}
              onChange={handleInputChange}
              placeholder="XX-XXXXXXXX-X"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Imagen de Firma */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaImage className="inline mr-2" />
            Imagen de Firma Digital
          </label>
          <input
            type="file"
            ref={inputFileRef}
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Formatos permitidos: JPG, PNG, GIF. Esta imagen se usará para firmar digitalmente los bonos.
          </p>

          {/* Botón para crear firma digital */}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setMostrarFirma(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaEdit /> Crear Firma Digital
            </button>
          </div>

          {/* Preview de imagen */}
          <div className="mt-4">
            <img
              ref={previewImageRef}
              alt="Preview de firma"
              className="max-w-xs max-h-32 border rounded shadow-sm"
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={cargando}
            className={`px-6 py-2 rounded text-white font-medium ${
              cargando ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {cargando ? "Guardando..." : editId ? "Actualizar Empresa" : "Crear Empresa"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded font-medium"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Botón de actualizar */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Empresas Registradas</h3>
        <button
          onClick={obtenerEmpresas}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <FaSyncAlt /> Actualizar
        </button>
      </div>

      {/* Lista de empresas */}
      {cargando ? (
        <Loader mensaje="Cargando empresas..." />
      ) : empresas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay empresas registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empresas.map((empresa) => (
            <div
              key={empresa.id}
              className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">{empresa.razon_social}</h4>
                <p className="text-gray-600">
                  <strong>CUIT:</strong> {empresa.cuit}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Creada: {new Date(empresa.fecha_creacion).toLocaleDateString("es-AR")}
                </p>
              </div>

              {/* Imagen de firma */}
              {empresa.imagen_firma_url && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Firma Digital:</p>
                  <img
                    src={empresa.imagen_firma_url || "/placeholder.svg"}
                    alt="Firma digital"
                    className="max-w-full h-16 object-contain border rounded"
                  />
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => editarEmpresa(empresa)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded flex items-center gap-1"
                  title="Editar empresa"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => eliminarEmpresa(empresa.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center gap-1"
                  title="Eliminar empresa"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de firma digital */}
      {mostrarFirma && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Crear Firma Digital</h3>
            <p className="text-sm text-gray-600 mb-4">
              Dibuje su firma en el recuadro. Esta imagen se usará para firmar digitalmente los bonos.
            </p>

            <div className="border-2 border-gray-300 rounded mb-4">
              <SignatureCanvas
                ref={sigCanvasRef}
                penColor="black"
                canvasProps={{
                  width: 450,
                  height: 200,
                  className: "w-full h-auto",
                }}
              />
            </div>

            <div className="flex justify-between gap-2">
              <button
                type="button"
                onClick={() => sigCanvasRef.current?.clear()}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Borrar
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMostrarFirma(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={crearFirmaDigital}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Confirmar Firma
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
