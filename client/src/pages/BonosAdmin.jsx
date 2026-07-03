import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"

import { API_URLS } from "../api/api"
import { toast } from "react-toastify"
import Loader from "../components/Loader"
import { FaTrash, FaKey, FaBuilding, FaSearch, FaTimes, FaChevronDown } from "react-icons/fa"
import Alerta from "../pages/Alertas"
import { capitalizarTexto } from "../utils/capitalizarTexto"

export default function BonosAdmin() {
  const [personas, setPersonas] = useState([])
  const [busquedaPersona, setBusquedaPersona] = useState("")
  const [idPersona, setIdPersona] = useState("")
  const [mes, setMes] = useState("")
  const [anio, setAnio] = useState("")
  const [archivo, setArchivo] = useState(null)
  const [bonos, setBonos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(-1)

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
    if(yaregistrado.current) return
    yaregistrado.current = true
    const emaillocal = getEmailFromLocalStorage()
    if(!emaillocal) return
    registrarIngreso(API_URLS.usuarios,emaillocal,'Bonos Admin')
  }

  const inputFileRef = useRef(null)
  const searchInputRef = useRef(null)
  const dropdownRef = useRef(null)

  const MESES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
    "Sac1",
    "Sac2",
  ]

  // Obtener personas (solo activas)
  const obtenerPersonas = async () => {
    try {
      const res = await fetch(API_URLS.personas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "get",
          mostrar_inactivos: false
        }),
      })
      const data = await res.json()
      setPersonas(data)
    } catch (error) {
      toast.error("Error cargando personas")
    }
  }

  // Filtrar personas por búsqueda
  const personasFiltradas = personas.filter(p => 
    busquedaPersona === "" ? true : 
    `${p.apellido} ${p.nombre} ${p.dni} ${p.empresa_nombre || ""}`
      .toLowerCase()
      .includes(busquedaPersona.toLowerCase())
  )

  // Obtener bonos de la persona
  const obtenerBonos = async (idPersonaSeleccionada) => {
    if (!idPersonaSeleccionada) return

    setCargando(true)
    try {
      const res = await fetch(API_URLS.personasbonos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getByPersona", idPersona: idPersonaSeleccionada }),
      })
      const data = await res.json()
      setBonos(data.success ? data.data : [])
      if (!data.success) toast.error(data.error)
    } catch (error) {
      toast.error("Error cargando bonos")
    }
    setCargando(false)
  }

  // Seleccionar una persona
  const seleccionarPersona = (persona) => {
    setIdPersona(persona.id.toString())
    setBusquedaPersona(`${capitalizarTexto(persona.apellido)}, ${capitalizarTexto(persona.nombre)} - ${persona.dni}`)
    setMostrarDropdown(false)
    setIndiceSeleccionado(-1)
    obtenerBonos(persona.id)
  }

  // Limpiar selección
  const limpiarSeleccion = () => {
    setIdPersona("")
    setBusquedaPersona("")
    setBonos([])
    setMostrarDropdown(false)
    setIndiceSeleccionado(-1)
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)
  }

  // Abrir dropdown
  const abrirDropdown = () => {
    setMostrarDropdown(true)
    setIndiceSeleccionado(-1)
  }

  // Manejar teclas
  const handleKeyDown = (e) => {
    if (!mostrarDropdown || personasFiltradas.length === 0) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        abrirDropdown()
      }
      if (e.key === 'Escape') {
        setMostrarDropdown(false)
        setIndiceSeleccionado(-1)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setIndiceSeleccionado(prev => 
          prev < personasFiltradas.length - 1 ? prev + 1 : prev
        )
        setTimeout(() => {
          const selectedElement = document.querySelector('.dropdown-item-selected')
          selectedElement?.scrollIntoView({ block: 'nearest' })
        }, 0)
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setIndiceSeleccionado(prev => prev > 0 ? prev - 1 : -1)
        setTimeout(() => {
          const selectedElement = document.querySelector('.dropdown-item-selected')
          selectedElement?.scrollIntoView({ block: 'nearest' })
        }, 0)
        break
      
      case 'Enter':
        e.preventDefault()
        if (indiceSeleccionado >= 0 && personasFiltradas[indiceSeleccionado]) {
          seleccionarPersona(personasFiltradas[indiceSeleccionado])
        } else if (personasFiltradas.length === 1) {
          seleccionarPersona(personasFiltradas[0])
        }
        break
      
      case 'Escape':
        e.preventDefault()
        setMostrarDropdown(false)
        setIndiceSeleccionado(-1)
        break
      
      default:
        break
    }
  }

  // Firmar bono con imagen de empresa
  const firmarBonoConEmpresa = async (idBono, archivoUrl) => {
    if (!idPersona) {
      toast.error("Debe seleccionar una persona")
      return
    }

    if (
      !(await Alerta.confirmar({
        texto: "¿Desea firmar este bono con la imagen de la empresa? Esta acción se debe hacer ANTES de que el empleado firme el bono.",
      }))
    )
      return

    setCargando(true)
    try {
      const res = await fetch(API_URLS.personasbonos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "firmarConEmpresa",
          idBono: idBono,
          archivo_url: archivoUrl,
          idPersona: idPersona,
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Bono firmado correctamente por la empresa")
        obtenerBonos(idPersona)
      } else {
        toast.error(data.error || "Error al firmar bono")
      }
    } catch (error) {
      toast.error("Error de conexión al firmar bono")
    }
    setCargando(false)
  }

  // Subir bono
  const subirBono = async () => {
    if (!idPersona || !mes || !anio || !archivo) {
      toast.error("Complete todos los campos")
      return
    }

    const formData = new FormData()
    formData.append("action", "insert")
    formData.append("idPersona", idPersona)
    formData.append("mes", mes)
    formData.append("anio", anio)
    formData.append("archivo", archivo)

    setCargando(true)
    try {
      const res = await fetch(API_URLS.personasbonos, { method: "POST", body: formData })
      const data = await res.json()
      if (data.success) {
        toast.success("Bono subido correctamente")
        setArchivo(null)
        if (inputFileRef.current) inputFileRef.current.value = ""
        obtenerBonos(idPersona)
      } else {
        toast.error(data.error || "Error al subir bono")
      }
    } catch (error) {
      toast.error("Error de conexión al subir bono")
    }
    setCargando(false)
  }

  // Eliminar bono
  const eliminarBono = async (id) => {
    if (!(await Alerta.confirmar({ texto: "¿Deseas eliminar este bono?" }))) return

    try {
      const res = await fetch(API_URLS.personasbonos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Bono eliminado")
        obtenerBonos(idPersona)
      } else {
        toast.error(data.error || "Error al eliminar")
      }
    } catch (error) {
      toast.error("Error de conexión al eliminar")
    }
  }

  // Reset clave
  const resetClave = async () => {
    if (!idPersona) return
    if (!(await Alerta.confirmar({ texto: "¿Seguro que deseas resetear la clave de esta persona?" }))) return

    try {
      const res = await fetch(API_URLS.personasbonos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resetClave", idPersona }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Clave reseteada. La persona deberá crear una nueva.")
      } else {
        toast.error(data.error || "Error al resetear clave")
      }
    } catch (error) {
      toast.error("Error de conexión al resetear clave")
    }
  }

  // Función para determinar el estado del bono
  const obtenerEstadoBono = (bono) => {
    const empresaFirmada = bono.firmado_empresa == 1
    const empleadoFirmado = bono.firmado_por

    if (empresaFirmada && empleadoFirmado) {
      return {
        texto: "✓ Completamente firmado",
        color: "text-green-600",
        detalle: `Empresa: ${bono.firmado_empresa_por} (${new Date(bono.firmado_empresa_fecha).toLocaleDateString("es-AR")})
                 Empleado: ${bono.firmado_por} (${new Date(bono.firmado_fecha).toLocaleDateString("es-AR")})`,
      }
    } else if (empresaFirmada && !empleadoFirmado) {
      return {
        texto: "✓ Firmado por empresa",
        color: "text-blue-600",
        detalle: `${bono.firmado_empresa_por} (${new Date(bono.firmado_empresa_fecha).toLocaleDateString("es-AR")})
                 Pendiente: Firma del empleado`,
      }
    } else if (!empresaFirmada && empleadoFirmado) {
      return {
        texto: "⚠️ Solo empleado",
        color: "text-orange-600",
        detalle: `${bono.firmado_por} (${new Date(bono.firmado_fecha).toLocaleDateString("es-AR")})
                 Falta: Firma de empresa`,
      }
    } else {
      return {
        texto: "Sin firmar",
        color: "text-red-600",
        detalle: "Pendiente: Firma de empresa y empleado",
      }
    }
  }

  useEffect(() => {
    obtenerPersonas()
    registrarse()
  }, [])

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setMostrarDropdown(false)
        setIndiceSeleccionado(-1)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const personaSeleccionada = personas.find((p) => p.id === Number.parseInt(idPersona))

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Administración de Bonos de Sueldo</h2>

      {/* Selector de persona - Searchable Select */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="col-span-4 relative" ref={searchInputRef}>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="🔍 Buscar o seleccionar persona (nombre, apellido, DNI o empresa)..."
              value={busquedaPersona}
              onChange={(e) => {
                setBusquedaPersona(e.target.value)
                setMostrarDropdown(true)
                if (e.target.value === "") {
                  setIdPersona("")
                  setBonos([])
                }
                setIndiceSeleccionado(-1)
              }}
              onFocus={() => setMostrarDropdown(true)}
              onKeyDown={handleKeyDown}
              className="border p-2 pl-10 pr-10 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Botón para abrir/cerrar dropdown */}
            <button
              onClick={() => setMostrarDropdown(!mostrarDropdown)}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaChevronDown className={`transition-transform ${mostrarDropdown ? 'rotate-180' : ''}`} />
            </button>
            {/* Botón para limpiar selección */}
            {idPersona && (
              <button
                onClick={limpiarSeleccion}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                title="Limpiar selección"
              >
                <FaTimes />
              </button>
            )}
          </div>
          
          {/* Dropdown con lista de personas */}
          {mostrarDropdown && (
            <div 
              ref={dropdownRef}
              className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-72 overflow-y-auto"
            >
              {personasFiltradas.length > 0 ? (
                <>
                  {/* Indicador de cantidad de resultados */}
                  <div className="px-3 py-2 bg-gray-50 border-b text-xs text-gray-500 sticky top-0">
                    {personasFiltradas.length} {personasFiltradas.length === 1 ? 'persona encontrada' : 'personas encontradas'}
                  </div>
                  
                  {personasFiltradas.map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => seleccionarPersona(p)}
                      onMouseEnter={() => setIndiceSeleccionado(idx)}
                      className={`p-3 cursor-pointer border-b last:border-b-0 transition-colors ${
                        idx === indiceSeleccionado 
                          ? 'bg-blue-100 border-l-4 border-l-blue-500' 
                          : 'hover:bg-gray-50'
                      } dropdown-item-${idx === indiceSeleccionado ? 'selected' : ''}`}
                    >
                      <div className="font-medium flex justify-between items-center">
                        <span>
                          {capitalizarTexto(p.apellido)}, {capitalizarTexto(p.nombre)}
                        </span>
                        {idx === indiceSeleccionado && (
                          <span className="text-xs text-blue-600 bg-blue-200 px-2 py-0.5 rounded">
                            ← Enter
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex gap-3 mt-1">
                        <span>📄 DNI: {p.dni}</span>
                        {p.empresa_nombre && (
                          <span>🏢 {p.empresa_nombre}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Ayuda de teclado */}
                  <div className="px-3 py-2 bg-gray-50 border-t text-xs text-gray-400 sticky bottom-0">
                    ↑↓ navegar • Enter seleccionar • Esc cerrar
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {busquedaPersona ? (
                    <>❌ No se encontraron personas con "<strong>{busquedaPersona}</strong>"</>
                  ) : (
                    <>📋 No hay personas disponibles</>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {idPersona && (
          <button
            onClick={resetClave}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded flex items-center justify-center transition-colors"
            title="Resetear clave"
          >
            <FaKey className="mr-1" /> Resetear Clave
          </button>
        )}
      </div>

      {/* Mostrar persona seleccionada - Tarjeta mejorada */}
      {personaSeleccionada && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  Persona seleccionada:
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {capitalizarTexto(personaSeleccionada.apellido)}, {capitalizarTexto(personaSeleccionada.nombre)}
                </div>
                <div className="text-sm text-gray-600">
                  📄 DNI: {personaSeleccionada.dni}
                  {personaSeleccionada.empresa_nombre && (
                    <span className="ml-3">🏢 Empresa: {personaSeleccionada.empresa_nombre}</span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={limpiarSeleccion}
              className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
            >
              Cambiar persona
            </button>
          </div>
        </div>
      )}

      {/* Filtros y subida de archivo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          value={mes}
          onChange={(e) => {
            setMes(e.target.value)
            setArchivo(null)
          }}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">📅 Seleccionar Mes</option>
          {MESES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          placeholder="📆 Año"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="file"
          accept="application/pdf"
          ref={inputFileRef}
          onChange={(e) => setArchivo(e.target.files[0])}
          className="border p-2 rounded col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col items-start mb-6">
        <button
          onClick={subirBono}
          disabled={!idPersona || !mes || !anio || !archivo}
          className={`px-6 py-2 rounded text-white transition-colors flex items-center gap-2 ${
            !idPersona || !mes || !anio || !archivo 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          📤 Subir Bono
        </button>
      </div>

      {/* Información sobre el flujo de firmas */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>📋 Flujo de firmas:</strong>
              1️⃣ Subir bono → 2️⃣ Firmar con empresa → 3️⃣ El empleado firma desde su portal
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de bonos */}
      <div className="mt-6">
        {personaSeleccionada && (
          <h3 className="font-semibold mb-3 text-lg">
            📄 Bonos de {capitalizarTexto(personaSeleccionada.nombre)} {capitalizarTexto(personaSeleccionada.apellido)}
          </h3>
        )}

        {cargando ? (
          <Loader mensaje="Cargando bonos..." />
        ) : bonos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-5xl mb-3">📭</div>
            <div className="text-gray-500">
              No hay bonos cargados para esta persona
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Seleccione un mes, año y archivo PDF para subir el primer bono
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Mes</th>
                  <th className="p-2 border">Año</th>
                  <th className="p-2 border">Archivo</th>
                  <th className="p-2 border">Estado de Firmas</th>
                  <th className="p-2 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bonos.map((b) => {
                  const estado = obtenerEstadoBono(b)
                  return (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{b.mes}</td>
                      <td className="border p-2 text-center">{b.anio}</td>
                      <td className="border p-2 text-center">
                        <a
                          href={b.archivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800 flex items-center justify-center gap-1"
                        >
                          📄 Ver PDF
                        </a>
                      </td>
                      <td className="border p-2">
                        <div className={`text-xs ${estado.color}`}>
                          <div className="font-semibold">{estado.texto}</div>
                          <div className="text-gray-600 mt-1 whitespace-pre-line text-xs">
                            {estado.detalle}
                          </div>
                        </div>
                      </td>
                      <td className="border p-2 text-center">
                        <div className="flex justify-center gap-2">
                          {b.firmado_empresa != 1 && (
                            <button
                              onClick={() => firmarBonoConEmpresa(b.id, b.archivo_url)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center gap-1 transition-colors"
                              title="Firmar con imagen de empresa"
                            >
                              <FaBuilding /> Firmar
                            </button>
                          )}

                          <button
                            onClick={() => eliminarBono(b.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
                            title="Eliminar bono"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}