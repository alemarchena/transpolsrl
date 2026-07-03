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
import { FaTrash, FaEdit } from "react-icons/fa"
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"
import { formatearFechaDDMMYYYY } from "../utils/formatoFechas"
import { formatearHora } from "../utils/formatearHora"
import { useDebounce } from "../utils/useDebounce"

export default function UsoVehiculo() {
const { register, handleSubmit, reset, setValue, watch } = useForm()


const watchRemito = watch("remito") || ""
const watchFecha = watch("fecha") || ""

const remitoDebounce = useDebounce(watchRemito, 600)
const fechaDebounce = useDebounce(watchFecha, 600)

  const [remitoDuplicado, setRemitoDuplicado] = useState(false)
  const ultimaConsulta = useRef("")
  const [vehiculos, setVehiculos] = useState([])
  const [personas, setPersonas] = useState([])
  const [personasExternas, setPersonasExternas] = useState([])
  const [centrosCarga, setCentrosCarga] = useState([])
  const [tiposCombustible, setTiposCombustible] = useState([])
  const [usos, setUsos] = useState([])
  const [loading, setLoading] = useState(false)
  const [busqueda, setBusqueda] = useState("")

  const yaregistrado = useRef(false)
  
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Registro de Uso del Vehiculo')
  }

    const verificarRemitoExistente = async (remito, fecha) => {

      const limpiarRemito = (r) => (r || "").replace(/\s+/g, "")

      const res = await fetch(API_URLS.usovehiculo, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "checkRemito",
          remito: limpiarRemito(remito),
          fecha,
          id: editandoId
        })
      })

      const data = await res.json()

      if (data.existe) {
        setRemitoDuplicado(true)

        toast.error("Este remito ya fue registrado para esa fecha", {
          toastId: "remito-duplicado"
        })
      } else {
        setRemitoDuplicado(false)
      }
    }
        
    useEffect(() => {

      if (!remitoDebounce || !fechaDebounce) return

      const clave = `${remitoDebounce.replace(/\s+/g,"")}-${fechaDebounce}`

      if (ultimaConsulta.current === clave) return

      ultimaConsulta.current = clave
      verificarRemitoExistente(remitoDebounce, fechaDebounce)

    }, [remitoDebounce, fechaDebounce])


  const hoy = new Date();
  const fechaLocal = hoy.getFullYear() + "-" +
    String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
    String(hoy.getDate()).padStart(2, "0");

    
  const haceunames = new Date();
  haceunames.setDate(haceunames.getDate() - 30);
  const fechaLocalatras = haceunames.getFullYear() + "-" +
    String(haceunames.getMonth() + 1).padStart(2, "0") + "-" +
    String(haceunames.getDate()).padStart(2, "0");

  const [fechaDesde, setFechaDesde] = useState(fechaLocalatras)
  const [fechaHasta, setFechaHasta] = useState(fechaLocal)
  const [fecha, setFecha] = useState(() => new Date().toISOString().split("T")[0])
  const [filtroCentroCarga, setFiltroCentroCarga] = useState("")

  const [busquedaVehiculo, setBusquedaVehiculo] = useState("")
  const [mostrarListaVehiculo, setMostrarListaVehiculo] = useState(false)
  const [indiceVehiculo, setIndiceVehiculo] = useState(-1)
  const [editandoId, setEditandoId] = useState(null)

  const [busquedaFiltroVehiculo, setBusquedaFiltroVehiculo] = useState("")
  const [mostrarListaFiltroVehiculo, setMostrarListaFiltroVehiculo] = useState(false)
  const [indiceFiltroVehiculo, setIndiceFiltroVehiculo] = useState(-1)
  const [vehiculoSeleccionadoFiltro, setVehiculoSeleccionadoFiltro] = useState(null)

  const [ordenColumna, setOrdenColumna] = useState(null)
  const [ordenDireccion, setOrdenDireccion] = useState("asc")

  const [montoFacturado, setMontoFacturado] = useState("")

  const vehiculosFiltrados = vehiculos.filter((v) =>
    `${v.numerointerno || ""} ${v.patente} ${v.marca} ${v.modelo}`
      .toLowerCase()
      .includes(busquedaVehiculo.toLowerCase()),
  )

  const vehiculosFiltradosParaBusqueda = vehiculos.filter((v) =>
    `${v.numerointerno || ""} ${v.patente} ${v.marca} ${v.modelo}`
      .toLowerCase()
      .includes(busquedaFiltroVehiculo.toLowerCase()),
  )

  const handleOrdenar = (columna) => {
    if (ordenColumna === columna) {
      setOrdenDireccion(ordenDireccion === "asc" ? "desc" : "asc")
    } else {
      setOrdenColumna(columna)
      setOrdenDireccion("asc")
    }
  }

  const getUsosOrdenados = () => {
    if (!ordenColumna) return usos

    return [...usos].sort((a, b) => {
      let valorA = a[ordenColumna]
      let valorB = b[ordenColumna]

      if (valorA == null) valorA = ""
      if (valorB == null) valorB = ""

      const esNumeroA = typeof valorA === "string" && valorA.trim() !== "" && !isNaN(valorA)
      const esNumeroB = typeof valorB === "string" && valorB.trim() !== "" && !isNaN(valorB)

      if (esNumeroA && esNumeroB) {
        valorA = Number(valorA)
        valorB = Number(valorB)
      }

      if (typeof valorA === "string" && typeof valorB === "string") {
        const comparacion = valorA.localeCompare(valorB, "es", { sensitivity: "base" })
        return ordenDireccion === "asc" ? comparacion : -comparacion
      }

      if (valorA < valorB) return ordenDireccion === "asc" ? -1 : 1
      if (valorA > valorB) return ordenDireccion === "asc" ? 1 : -1
      return 0
    })
  }

  const IconoOrdenamiento = ({ columna }) => {
    if (ordenColumna !== columna) return <FaSort className="inline ml-1 text-gray-400" />
    return ordenDireccion === "asc" ? (
      <FaSortUp className="inline ml-1 text-blue-600" />
    ) : (
      <FaSortDown className="inline ml-1 text-blue-600" />
    )
  }

  const obtenerDatos = async () => {

    setLoading(true)
    const res = await fetch(API_URLS.usovehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get", busqueda, fechaDesde, fechaHasta, centroCarga: filtroCentroCarga }),
    })
    const data = await res.json()
    setUsos(Array.isArray(data.data) ? data.data : [])
    setLoading(false)
  }

  const obtenerVehiculos = async () => {
    const res = await fetch(API_URLS.vehiculos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    })
    const data = await res.json()
    setVehiculos(data)
  }

  const obtenerPersonas = async () => {
    const res = await fetch(API_URLS.personas, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    })
    const data = await res.json()
    setPersonas(data)
  }

  const obtenerPersonasExternas = async () => {
    try {
      const res = await fetch(API_URLS.personasexternas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get" }),
      })
      const data = await res.json()
      setPersonasExternas(Array.isArray(data) ? data : [])
    } catch (error) {
      setPersonasExternas([])
    }
  }

  const obtenerCentrosCarga = async () => {
    const res = await fetch(API_URLS.centroscarga, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    })
    const data = await res.json()
    setCentrosCarga(data)
  }

  const obtenerTiposCombustible = async () => {
    const res = await fetch(API_URLS.tiposcombustible, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    })
    const data = await res.json()
    setTiposCombustible(data)
  }

  const onSubmit = async (datos) => {

    if (remitoDuplicado && !editandoId) {
      toast.error("No se puede guardar porque el remito ya existe para esa fecha")
      return
    }

    const validarAnioFecha = (fecha) => {
      if (!fecha) return false

      const partes = fecha.split("-")
      if (partes.length !== 3) return false

      const anio = partes[0]

      // Debe tener exactamente 4 dígitos
      if (!/^\d{4}$/.test(anio)) return false

      const anioNum = Number(anio)

      // Rango razonable de años
      if (anioNum < 1900 || anioNum > 2100) return false

      return true
    }

    const normalizarHoraMinutos = (hora) => {
      if (!hora) return ""
      const partes = hora.split(":")
      const h = partes[0]?.padStart(2, "0") || "00"
      const m = partes[1]?.padStart(2, "0") || "00"
      return `${h}:${m}`
    }

    const limpiarRemito = (remito) => {
      return (remito || "").replace(/\s+/g, "")
    }

    const esObligatorio = (valor) => {
      return valor !== undefined && valor !== null && valor !== ""
    }

    const detectarMontoFechaSospechoso = (fecha, monto) => {
      const montoNum = Number(monto || 0)

      return usos.filter((u) => {
        if (editandoId && u.id === editandoId) return false

        const montoUso = Number(u.montototal || 0)

        const mismaFecha = u.fecha === fecha
        const montoSimilar = Math.abs(montoUso - montoNum) < 1

        return mismaFecha && montoSimilar
      })
    }

  // -------------------------
  // VALIDACIÓN DE CAMPOS OBLIGATORIOS
  // -------------------------

  if (!esObligatorio(datos.litros)) {
    toast.error("Debe ingresar los litros")
    return
  }

  if (!esObligatorio(datos.idVehiculo)) {
    toast.error("Debe seleccionar un vehículo")
    return
  }

  if (!esObligatorio(datos.fecha)) {
    toast.error("La fecha es obligatoria")
    return
  }

  if (!validarAnioFecha(datos.fecha)) {
  toast.error("El año de la fecha debe tener 4 dígitos y ser válido")
  return
}

  if (!esObligatorio(datos.hora)) {
    toast.error("La hora es obligatoria")
    return
  }

  if (!esObligatorio(datos.remito)) {
    toast.error("El número de remito es obligatorio")
    return
  }

  if (!esObligatorio(datos.montototal)) {
    toast.error("El monto total es obligatorio")
    return
  }

  // -------------------------
  // NORMALIZAR DATOS
  // -------------------------

  const horaIngresada = normalizarHoraMinutos(datos.hora)
  const montoIngresado = Number(datos.montototal || 0)
  const remitoIngresado = limpiarRemito(datos.remito)

  // -------------------------
  // BUSCAR COINCIDENCIAS EXACTAS
  // -------------------------

  const coincidencias = usos.filter((u) => {

    if (editandoId && u.id === editandoId) return false

    const horaUso = normalizarHoraMinutos(u.hora)
    const montoUso = Number(u.montototal || 0)

    return (
      u.fecha === datos.fecha &&
      horaUso === horaIngresada &&
      Math.abs(montoUso - montoIngresado) < 0.01
    )
  })

  if (coincidencias.length > 0) {

    const igualRemito = coincidencias.find(
      (u) => limpiarRemito(u.remito) === remitoIngresado
    )

    // DUPLICADO EXACTO
    if (igualRemito) {
      toast.error("Este comprobante ya fue registrado anteriormente.")
      return
    }

    const sospechoso = coincidencias[0]

    const confirmar = await Alerta.confirmar({
      texto:
        `Existe un registro con los mismos datos:\n\n` +
        `Fecha: ${formatearFechaDDMMYYYY(sospechoso.fecha)}\n` +
        `Hora: ${formatearHora(sospechoso.hora)}\n` +
        `Monto: $${sospechoso.montototal}\n` +
        `Remito: ${sospechoso.remito || "Sin remito"}\n\n` +
        `El remito ingresado es diferente.\n¿Desea guardar igualmente?`
    })

    if (!confirmar) return
  }

  // -------------------------
  // DETECTAR SOSPECHA POR FECHA Y MONTO
  // -------------------------

  const sospechosos = detectarMontoFechaSospechoso(datos.fecha, datos.montototal)

  if (sospechosos.length > 0) {

    const s = sospechosos[0]

    const confirmar = await Alerta.confirmar({
      texto:
        `Existe un registro con fecha y monto similar:\n\n` +
        `Fecha: ${formatearFechaDDMMYYYY(s.fecha)}\n` +
        `Hora: ${formatearHora(s.hora)}\n` +
        `Monto: $${s.montototal}\n` +
        `Remito: ${s.remito || "Sin remito"}\n\n` +
        `Esto podría ser un error.\n¿Desea guardar igualmente?`
    })

    if (!confirmar) return
  }

  // -------------------------
  // GUARDAR
  // -------------------------

  const action = editandoId ? "update" : "insert"

  const personaValue = datos.idPersona
  const esPersonaExterna = personaValue && personaValue.toString().startsWith("ext_")
  const idPersonaReal = esPersonaExterna ? personaValue.replace("ext_", "") : personaValue

  const payload = editandoId
    ? { action, id: editandoId, ...datos, idPersona: idPersonaReal, esPersonaExterna }
    : { action, ...datos, idPersona: idPersonaReal, esPersonaExterna }

  const res = await fetch(API_URLS.usovehiculo, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const respuesta = await res.json()

  if (respuesta.success) {

    toast.success(editandoId ? "Registro actualizado" : "Registro guardado")

    reset({
      fecha,
      kmActuales: "",
      remito: "",
      tipocombustible: "",
      litros: "",
      montototal: "",
      precintoentrada: "",
      precintosalida: "",
      centrodecarga: "",
    })
    setRemitoDuplicado(false)
    ultimaConsulta.current = ""

    setBusquedaVehiculo("")
    setEditandoId(null)
    obtenerDatos()

  } else {
    toast.error("Error al guardar")
  }
}

  const editarUso = (uso) => {
    setEditandoId(uso.id)
    setValue("idVehiculo", uso.idVehiculo)

    if (uso.esPersonaExterna == 1) {
      setValue("idPersona", `ext_${uso.idPersona}`)
    } else {
      setValue("idPersona", uso.idPersona)
    }

    setValue("fecha", uso.fecha)
    setFecha(uso.fecha)
    setValue("hora", uso.hora)
    setValue("kmActuales", uso.kmActuales)
    setValue("remito", uso.remito || "")
    setValue("tipocombustible", uso.tipocombustible || "")
    setValue("litros", uso.litros || "")
    setValue("montototal", uso.montototal || "")
    setValue("precintoentrada", uso.precintoentrada || "")
    setValue("precintosalida", uso.precintosalida || "")
    setValue("centrodecarga", uso.centrodecarga || "")

    const vehiculoTexto = `[${uso.numerointerno || ""}] ${uso.patente} - ${uso.marca} ${uso.modelo}`
    setBusquedaVehiculo(vehiculoTexto)

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const cancelarEdicion = () => {
    setEditandoId(null)
    reset({
      fecha,
      kmActuales: "",
      remito: "",
      tipocombustible: "",
      litros: "",
      montototal: "",
      precintoentrada: "",
      precintosalida: "",
      centrodecarga: "",
    })
    setBusquedaVehiculo("")
  }

  const eliminarUso = async (id) => {
    if (!(await Alerta.confirmar({ texto: "¿Deseas eliminar este registro?" }))) return

    const res = await fetch(API_URLS.usovehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success("Eliminado correctamente")
      obtenerDatos()
    } else {
      toast.error("Error al eliminar")
    }
  }

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Uso del vehículo")

    sheet.columns = [
      { header: "Fecha", key: "fecha", width: 12 },
      { header: "Hora", key: "hora", width: 10 },
      { header: "Vehículo", key: "vehiculo", width: 35 },
      { header: "Persona", key: "persona", width: 25 },
      { header: "KM actuales", key: "kmActuales", width: 12 },
      { header: "KM recorridos", key: "kmRecorridos", width: 14 },
      { header: "Remito", key: "remito", width: 15 },
      { header: "Tipo Combustible", key: "tipoCombustible", width: 18 },
      { header: "Litros", key: "litros", width: 10 },
      { header: "Consumo (l/100km)", key: "consumo", width: 16 },
      { header: "Monto Total", key: "montoTotal", width: 12 },
      { header: "Centro de Carga", key: "centroCarga", width: 25 },
      { header: "Precinto Entrada", key: "precintoEntrada", width: 18 },
      { header: "Precinto Salida", key: "precintosalida", width: 18 },
    ]

    usos.forEach((u) => {
      const row = sheet.addRow({
        fecha: formatearFechaDDMMYYYY(u.fecha),
        hora: formatearHora(u.hora),
        vehiculo: `${u.numerointerno ? `[${u.numerointerno}] ` : ""}${u.patente} - ${u.marca} ${u.modelo}`,
        persona:
          u.esPersonaExterna == 1 ? `${u.nombreCompleto} (Ext)` : u.nombreCompleto || `${u.nombre} ${u.apellido}`,
        kmActuales: u.kmActuales ? Number(u.kmActuales) : null,
        kmRecorridos: u.kmRecorridos ? Number(u.kmRecorridos) : null,
        remito: u.remito || "",
        tipoCombustible: u.nombrecombustible || "",
        litros: u.litros ? Number(u.litros) : null,
        consumo: u.consumo ? Number(u.consumo) : null,
        montoTotal: u.montototal ? Number(u.montototal) : null,
        centroCarga: u.nombrecentro || "",
        precintoEntrada: u.precintoentrada || "",
        precintosalida: u.precintosalida || "",
      })

      row.getCell("kmActuales").numFmt = "#,##0"
      row.getCell("kmRecorridos").numFmt = "#,##0"
      row.getCell("litros").numFmt = "#,##0.00"
      row.getCell("consumo").numFmt = "#,##0.00"
      row.getCell("montoTotal").numFmt = "$#,##0.00"
    })

    const headerRow = sheet.getRow(1)
    headerRow.font = { bold: true }

    // Agregar filas vacías para separación
    sheet.addRow({})
    sheet.addRow({})

    // Calcular valores de conciliación
    const totalRemitos = usos.reduce((sum, uso) => {
      const monto = Number.parseFloat(uso.montototal) || 0
      return sum + monto
    }, 0)

    const montoFacturadoNum = Number.parseFloat(montoFacturado) || 0
    const diferencia = montoFacturadoNum - totalRemitos
    const sonIguales = Math.abs(diferencia) < 0.01 && montoFacturado !== ""

    // Agregar título de conciliación
    const tituloRow = sheet.addRow({ fecha: "CONCILIACIÓN DE MONTOS" })
    tituloRow.font = { bold: true, size: 14 }
    tituloRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    }

    // Total de Remitos
    const totalRemitosRow = sheet.addRow({
      fecha: "Total de Remitos:",
      hora: totalRemitos,
    })
    totalRemitosRow.font = { bold: true }
    totalRemitosRow.getCell("hora").numFmt = "$#,##0.00"
    totalRemitosRow.getCell("hora").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDBEAFE" }, // bg-blue-50
    }

    // Monto Facturado
    const montoFacturadoRow = sheet.addRow({
      fecha: "Monto Facturado:",
      hora: montoFacturadoNum || "",
    })
    montoFacturadoRow.font = { bold: true }
    montoFacturadoRow.getCell("hora").numFmt = "$#,##0.00"
    montoFacturadoRow.getCell("hora").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF9FAFB" }, // bg-gray-50
    }

    // Diferencia
    const diferenciaRow = sheet.addRow({
      fecha: "Diferencia:",
      hora: sonIguales ? "✓ Coincide" : diferencia,
    })
    diferenciaRow.font = { bold: true }
    if (!sonIguales && typeof diferenciaRow.getCell("hora").value === "number") {
      diferenciaRow.getCell("hora").numFmt = "$#,##0.00"
    }
    diferenciaRow.getCell("hora").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: sonIguales ? "FFD1FAE5" : "FFFEE2E2" }, // bg-green-50 or bg-red-50
    }
    diferenciaRow.getCell("hora").font = {
      bold: true,
      color: { argb: sonIguales ? "FF16A34A" : "FFDC2626" }, // text-green-600 or text-red-600
    }

    const blob = await workbook.xlsx.writeBuffer()
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([blob]))
    a.download = "uso_vehiculo.xlsx"
    a.click()
  }

  const exportarPDF = async () => {
    const fechaActual = new Date()
    const fechaISO = fechaActual.toISOString().split("T")[0]
    const fechaStr = formatearFechaDDMMYYYY(fechaISO)
    const horaStr = formatearHora(fechaActual)

    const input = document.getElementById("tabla-usovehiculo")
    if (!input) {
      toast.error("No se encontró la tabla para exportar.")
      return
    }

    const canvas = await html2canvas(input)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    pdf.setFontSize(12)
    pdf.text("Reporte de Uso de Vehículos", 14, 15)
    pdf.setFontSize(10)
    pdf.text(`Fecha: ${fechaStr}  Hora: ${horaStr}`, 14, 22)

    pdf.addImage(imgData, "PNG", 14, 30, pdfWidth - 28, pdfHeight)
    pdf.save(`usovehiculos_${fechaStr.replaceAll("/", "-")}_${horaStr.replaceAll(":", "-")}.pdf`)
  }

  useEffect(() => {
    obtenerVehiculos()
    obtenerPersonas()
    obtenerPersonasExternas()
    obtenerCentrosCarga()
    obtenerTiposCombustible()
    obtenerDatos()
    registrarse()
  }, [])

  const totalRemitos = usos.reduce((sum, uso) => {
    const monto = Number.parseFloat(uso.montototal) || 0
    return sum + monto
  }, 0)

  const montoFacturadoNum = Number.parseFloat(montoFacturado) || 0
  const diferencia = montoFacturadoNum - totalRemitos
  const sonIguales = Math.abs(diferencia) < 0.01 && montoFacturado !== ""

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1800px]">
      <h2 className="text-2xl font-bold mb-4">{editandoId ? "Editar Uso del Vehículo" : "Uso del Vehículo"}</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6"
      >
        <div className="relative sm:col-span-2 xl:col-span-3">
          <input
            type="text"
            value={busquedaVehiculo}
            placeholder="Ej: [18] AE893IL - Buscar por número interno, patente, marca..."
            className="border p-2 w-full bg-lime-100 text-sm"
            title="Busque y seleccione el vehículo por número interno, patente, marca o modelo"
            onChange={(e) => {
              setBusquedaVehiculo(e.target.value)
              setMostrarListaVehiculo(true)
              setIndiceVehiculo(-1)
            }}
            onFocus={() => setMostrarListaVehiculo(true)}
            onKeyDown={(e) => {
              if (!mostrarListaVehiculo || vehiculosFiltrados.length === 0) return

              if (e.key === "ArrowDown") {
                e.preventDefault()
                setIndiceVehiculo((prev) => (prev < vehiculosFiltrados.length - 1 ? prev + 1 : 0))
              }
              if (e.key === "ArrowUp") {
                e.preventDefault()
                setIndiceVehiculo((prev) => (prev > 0 ? prev - 1 : vehiculosFiltrados.length - 1))
              }
              if (e.key === "Enter") {
                e.preventDefault()
                if (indiceVehiculo >= 0) {
                  const v = vehiculosFiltrados[indiceVehiculo]
                  setBusquedaVehiculo(`[${v.numerointerno || ""}] ${v.patente} - ${v.marca} ${v.modelo}`)
                  setValue("idVehiculo", v.id)
                  setMostrarListaVehiculo(false)
                }
              }
              if (e.key === "Escape") setMostrarListaVehiculo(false)
            }}
          />
          {mostrarListaVehiculo && busquedaVehiculo && vehiculosFiltrados.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto rounded shadow">
              {vehiculosFiltrados.map((v, index) => (
                <li
                  key={v.id}
                  onClick={() => {
                    setBusquedaVehiculo(`[${v.numerointerno || ""}] ${v.patente} - ${v.marca} ${v.modelo}`)
                    setValue("idVehiculo", v.id)
                    setMostrarListaVehiculo(false)
                  }}
                  className={`p-2 cursor-pointer text-sm ${index === indiceVehiculo ? "bg-blue-200" : "hover:bg-blue-100"}`}
                >
                  {v.numerointerno ? `[${v.numerointerno}] ` : ""}
                  {v.patente} - {v.marca} {v.modelo}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          {...register("idPersona", { required: true })}
          className="border p-2 text-sm rounded"
          title="Seleccione la persona responsable del uso del vehículo"
        >
          <option value="">Persona</option>
          <optgroup label="Empleados">
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.apellido} {p.nombre}
              </option>
            ))}
          </optgroup>
          <optgroup label="Personas Externas" className="bg-orange-100">
            {personasExternas.map((p) => (
              <option key={`ext_${p.id}`} value={`ext_${p.id}`} className="bg-orange-100">
                {p.apellido} {p.nombre}
              </option>
            ))}
          </optgroup>
        </select>

        <input
          type="date"
          {...register("fecha", { required: true })}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border p-2 text-sm"
          title="Fecha del uso del vehículo"
        />

        <input
          type="time"
          {...register("hora", { required: true })}
          className="border p-2 text-sm"
          title="Hora del uso del vehículo"
        />

        <input
          type="number"
          step="0.01"
          {...register("kmActuales", { required: true })}
          className="border p-2 text-sm"
          placeholder="KM actuales"
          title="Kilometraje actual del vehículo en el momento del uso"
        />

        <input
          type="text"
          {...register("remito")}
          className="border p-2 text-sm"
          placeholder="Remito"
          title="Número de remito de carga de combustible (opcional)"
        />

        <select {...register("tipocombustible")} className="border p-2 text-sm" title="Tipo de combustible cargado">
          <option value="">Tipo Combustible</option>
          {tiposCombustible.map((tc) => (
            <option key={tc.idtipo} value={tc.idtipo}>
              {tc.nombrecombustible}
            </option>
          ))}
        </select>

        <input
          type="number"
          step="0.01"
          {...register("litros")}
          className="border p-2 text-sm"
          placeholder="Litros"
          title="Cantidad de litros de combustible cargados"
        />

        <input
          type="number"
          step="0.01"
          {...register("montototal")}
          className="border p-2 bg-amber-50 text-sm"
          placeholder="Monto Total"
          title="Monto total de la carga de combustible"
        />

        <select
          {...register("centrodecarga")}
          className="border p-2 text-sm"
          title="Centro de carga donde se realizó la carga de combustible"
        >
          <option value="">Centro de Carga</option>
          {centrosCarga.map((cc) => (
            <option key={cc.idcentro} value={cc.idcentro}>
              {cc.nombrecentro}
            </option>
          ))}
        </select>

        <input
          type="text"
          {...register("precintoentrada")}
          className="border p-2 text-sm"
          placeholder="Precinto Entrada"
          title="Número de precinto de entrada"
        />

        <input
          type="text"
          {...register("precintosalida")}
          className="border p-2 text-sm"
          placeholder="Precinto Salida"
          title="Número de precinto de salida"
        />

        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-6 flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex-1 text-sm">
            {editandoId ? "Actualizar Uso" : "Guardar Uso"}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="bg-gray-500 text-white px-4 py-2 rounded text-sm"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col items-center mt-6 border p-4 rounded w-full">
        <div className="flex flex-col md:flex-row items-center gap-3 mb-4 w-full">
          <div className="relative w-full md:w-auto md:flex-1">
            <input
              type="text"
              className="border p-2 bg-lime-100 border-blue-500 rounded px-3 w-full text-sm"
              placeholder="Ej: [18] AE893IL - Buscar por número interno, patente, marca..."
              value={busquedaFiltroVehiculo}
              onChange={(e) => {
                setBusquedaFiltroVehiculo(e.target.value)
                setMostrarListaFiltroVehiculo(true)
                setIndiceFiltroVehiculo(-1)
              }}
              onFocus={() => setMostrarListaFiltroVehiculo(true)}
              onKeyDown={(e) => {
                if (!mostrarListaFiltroVehiculo || vehiculosFiltradosParaBusqueda.length === 0) return

                if (e.key === "ArrowDown") {
                  e.preventDefault()
                  setIndiceFiltroVehiculo((prev) => (prev < vehiculosFiltradosParaBusqueda.length - 1 ? prev + 1 : 0))
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault()
                  setIndiceFiltroVehiculo((prev) => (prev > 0 ? prev - 1 : vehiculosFiltradosParaBusqueda.length - 1))
                }
                if (e.key === "Enter") {
                  e.preventDefault()
                  if (indiceFiltroVehiculo >= 0) {
                    const v = vehiculosFiltradosParaBusqueda[indiceFiltroVehiculo]
                    setBusquedaFiltroVehiculo(`[${v.numerointerno || ""}] ${v.patente} - ${v.marca} ${v.modelo}`)
                    setVehiculoSeleccionadoFiltro(v)
                    setBusqueda(v.patente) // Enviar solo la patente al backend
                    setMostrarListaFiltroVehiculo(false)
                  }
                }
                if (e.key === "Escape") setMostrarListaFiltroVehiculo(false)
              }}
            />
            {mostrarListaFiltroVehiculo && busquedaFiltroVehiculo && vehiculosFiltradosParaBusqueda.length > 0 && (
              <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto rounded shadow">
                {vehiculosFiltradosParaBusqueda.map((v, index) => (
                  <li
                    key={v.id}
                    onClick={() => {
                      setBusquedaFiltroVehiculo(`[${v.numerointerno || ""}] ${v.patente} - ${v.marca} ${v.modelo}`)
                      setVehiculoSeleccionadoFiltro(v)
                      setBusqueda(v.patente) // Enviar solo la patente al backend
                      setMostrarListaFiltroVehiculo(false)
                    }}
                    className={`p-2 cursor-pointer text-sm ${index === indiceFiltroVehiculo ? "bg-blue-200" : "hover:bg-blue-100"}`}
                  >
                    {v.numerointerno ? `[${v.numerointerno}] ` : ""}
                    {v.patente} - {v.marca} {v.modelo}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="date"
            className="border p-2 bg-lime-100 border-blue-500 rounded px-3 text-sm"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 bg-lime-100 border-blue-500 rounded px-3 text-sm"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
          <select
            className="border p-2 bg-lime-100 border-blue-500 rounded px-3 text-sm min-w-[180px]"
            value={filtroCentroCarga}
            onChange={(e) => setFiltroCentroCarga(e.target.value)}
            title="Filtrar por Centro de Carga"
          >
            <option value="">Todos los Centros</option>
            {centrosCarga.map((cc) => (
              <option key={cc.idcentro} value={cc.idcentro}>
                {cc.nombrecentro}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={obtenerDatos}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              Buscar
            </button>
            <button
              onClick={exportarPDF}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm"
            >
              PDF
            </button>
            <button
              onClick={exportarExcel}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
            >
              Excel
            </button>
          </div>
        </div>

        {usos.length > 0 && (
          <>
            {/* Tabla de registros */}
            <div className="overflow-x-auto shadow-lg rounded-lg w-full">
              <table id="tabla-usovehiculo" className="min-w-full bg-white border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("fecha")}
                    >
                      Fecha <IconoOrdenamiento columna="fecha" />
                    </th>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("hora")}
                    >
                      Hora <IconoOrdenamiento columna="hora" />
                    </th>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("patente")}
                    >
                      Vehículo <IconoOrdenamiento columna="patente" />
                    </th>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("nombre")}
                    >
                      Persona <IconoOrdenamiento columna="nombre" />
                    </th>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("kmActuales")}
                    >
                      KM actuales <IconoOrdenamiento columna="kmActuales" />
                    </th>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("kmRecorridos")}
                    >
                      KM recorridos <IconoOrdenamiento columna="kmRecorridos" />
                    </th>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("remito")}
                    >
                      Remito <IconoOrdenamiento columna="remito" />
                    </th>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("nombrecombustible")}
                    >
                      Combustible <IconoOrdenamiento columna="nombrecombustible" />
                    </th>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("litros")}
                    >
                      Litros <IconoOrdenamiento columna="litros" />
                    </th>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("consumo")}
                    >
                      Consumo (l/100km) <IconoOrdenamiento columna="consumo" />
                    </th>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("montototal")}
                    >
                      Monto <IconoOrdenamiento columna="montototal" />
                    </th>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("nombrecentro")}
                    >
                      Centro <IconoOrdenamiento columna="nombrecentro" />
                    </th>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("precintoentrada")}
                    >
                      Precinto Ent. <IconoOrdenamiento columna="precintoentrada" />
                    </th>
                    <th
                      className="px-2 py-1 border cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                      onClick={() => handleOrdenar("precintosalida")}
                    >
                      Precinto Sal. <IconoOrdenamiento columna="precintosalida" />
                    </th>
                    <th className="px-2 py-1 border whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {getUsosOrdenados().map((u, i) => (
                    <tr key={i} className="text-center border-t hover:bg-gray-50">
                      <td className="px-2 py-1 border whitespace-nowrap">{formatearFechaDDMMYYYY(u.fecha)}</td>
                      <td className="px-2 py-1 border whitespace-nowrap">{formatearHora(u.hora)}</td>
                      <td className="px-2 py-1 border whitespace-nowrap">
                        {u.numerointerno ? `[${u.numerointerno}] ` : ""}
                        {u.patente} - {u.marca} {u.modelo}
                      </td>
                      <td
                        className={`px-2 py-1 border whitespace-nowrap ${u.esPersonaExterna == 1 ? "bg-orange-100" : ""}`}
                      >
                        {u.nombreCompleto || `${u.nombre || ""} ${u.apellido || ""}`}
                        {u.esPersonaExterna == 1 && <span className="ml-1 text-xs text-orange-600">(Ext)</span>}
                      </td>
                      <td className="px-2 py-1 border">{u.kmActuales}</td>
                      <td className="px-2 py-1 border">{u.kmRecorridos}</td>
                      <td className="px-2 py-1 border">{u.remito || "-"}</td>
                      <td className="px-2 py-1 border">{u.nombrecombustible || "-"}</td>
                      <td className="px-2 py-1 border">
                        {u.litros
                          ? Number(u.litros).toLocaleString("es-AR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "-"}
                      </td>
                      <td className="px-2 py-1 border">
                        {u.consumo
                          ? `${Number(u.consumo).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} l/100km`
                          : "-"}
                      </td>
                      <td className="px-2 py-1 border whitespace-nowrap">
                        {u.montototal
                          ? `$${Number(u.montototal).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : "-"}
                      </td>
                      <td className="px-2 py-1 border">{u.nombrecentro || "-"}</td>
                      <td className="px-2 py-1 border">{u.precintoentrada || "-"}</td>
                      <td className="px-2 py-1 border">{u.precintosalida || "-"}</td>
                      <td className="px-2 py-1 border text-center">
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => editarUso(u)}
                            className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600"
                            title="Editar registro"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => eliminarUso(u.id)}
                            className="bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                            title="Eliminar registro"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {usos.length === 0 && (
                    <tr>
                      <td colSpan="15" className="text-center py-4 text-gray-500">
                        No hay registros
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 w-full">
              <h3 className="text-lg font-semibold mb-3">Conciliación de Montos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total de Remitos */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Total de Remitos</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ${totalRemitos.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Monto Facturado */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Monto Facturado</h3>
                  <input
                    type="number"
                    step="0.01"
                    value={montoFacturado}
                    onChange={(e) => setMontoFacturado(e.target.value)}
                    placeholder="Ingrese monto facturado"
                    className="w-full border rounded px-3 py-2 text-lg font-semibold"
                  />
                </div>

                {/* Diferencia */}
                <div
                  className={`border rounded-lg p-4 ${
                    sonIguales ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Diferencia</h3>
                  <p className={`text-2xl font-bold ${sonIguales ? "text-green-600" : "text-red-600"}`}>
                    {sonIguales
                      ? "✓ Coincide"
                      : montoFacturado === ""
                        ? "-"
                        : `${diferencia > 0 ? "+" : ""}$${Math.abs(diferencia).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </p>
                  {!sonIguales && montoFacturado !== "" && (
                    <p className="text-xs text-gray-600 mt-1">
                      {diferencia > 0 ? "Facturado mayor que remitos" : "Facturado menor que remitos"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {loading && <Loader />}
      </div>
    </div>
  )
}
