import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { useForm } from "react-hook-form"
import { API_URLS } from "../api/api"
import { toast } from "react-toastify"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import ExcelJS from "exceljs"
import { formatearFechaHora, formatearFechaDDMMYYYY } from "../utils/formatoFechas"
import { formatearHora } from "../utils/formatearHora"
import Alerta from "../pages/Alertas"
import { FaTrash, FaEdit } from "react-icons/fa"

export default function ServiciosVehiculo() {
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const tablaRef = useRef()
  const { register, handleSubmit, reset, setValue, watch, setFocus } = useForm()

  const [servicios, setServicios] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [articulos, setArticulos] = useState([])
  const [personas, setPersonas] = useState([])
  const [serviciosMonitoreables, setServiciosMonitoreables] = useState([])
  const [editId, setEditId] = useState(null)

  const [sortField, setSortField] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Servicios Vehículo')
  }

  // Autocompletado formulario - Vehículos
  const [busquedaVehiculo, setBusquedaVehiculo] = useState("")
  const [mostrarListaVehiculo, setMostrarListaVehiculo] = useState(false)
  const [indiceVehiculo, setIndiceVehiculo] = useState(-1)

  // Autocompletado formulario - Artículos
  const [busquedaArticulo, setBusquedaArticulo] = useState("")
  const [mostrarListaArticulo, setMostrarListaArticulo] = useState(false)
  const [indiceArticulo, setIndiceArticulo] = useState(-1)

  // Autocompletado filtros - Vehículos
  const [busquedaVehiculoFiltro, setBusquedaVehiculoFiltro] = useState("")
  const [mostrarListaVehiculoFiltro, setMostrarListaVehiculoFiltro] = useState(false)
  const [indiceVehiculoFiltro, setIndiceVehiculoFiltro] = useState(-1)

  // Autocompletado filtros - Artículos
  const [busquedaArticuloFiltro, setBusquedaArticuloFiltro] = useState("")
  const [mostrarListaArticuloFiltro, setMostrarListaArticuloFiltro] = useState(false)
  const [indiceArticuloFiltro, setIndiceArticuloFiltro] = useState(-1)

  const [precioUltimaCompra, setPrecioUltimaCompra] = useState(null)

  const cantidad = watch("cantidad")
  const totalitemservicio = watch("totalitemservicio")

  const totalGastado = servicios.reduce((sum, servicio) => {
    return sum + Number(servicio.totalitemservicio || 0)
  }, 0)

    const hoy = new Date();
    const fechaHasta = hoy.getFullYear() + "-" +
      String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
      String(hoy.getDate()).padStart(2, "0");

      
    const haceunames = new Date();
    haceunames.setDate(haceunames.getDate() - 30);
    const fechaDesde = haceunames.getFullYear() + "-" +
      String(haceunames.getMonth() + 1).padStart(2, "0") + "-" +
      String(haceunames.getDate()).padStart(2, "0");


    const [filtros, setFiltros] = useState({ fechaDesde: fechaDesde, fechaHasta: fechaHasta, idVehiculo: "", idArticulo: "" })

  useEffect(() => {
    const obtenerFechaMendoza = () => {
      const ahora = new Date()
      // Convertir a string en zona horaria de Mendoza
      const opciones = {
        timeZone: "America/Argentina/Mendoza",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
      const formateador = new Intl.DateTimeFormat("en-CA", opciones)
      const partes = formateador.formatToParts(ahora)

      const obtenerValor = (tipo) => partes.find((p) => p.type === tipo)?.value || ""

      const fechaISO = `${obtenerValor("year")}-${obtenerValor("month")}-${obtenerValor("day")}T${obtenerValor("hour")}:${obtenerValor("minute")}`
      return fechaISO
    }

    setValue("fecha_servicio", obtenerFechaMendoza())
  }, [setValue])

  useEffect(() => {
    if (precioUltimaCompra !== null && cantidad > 0) {
      const total = precioUltimaCompra * cantidad
      setValue("totalitemservicio", total.toFixed(2))
    }
  }, [precioUltimaCompra, cantidad, setValue])

  

  const vehiculosFiltrados = vehiculos.filter((v) =>
    `${v.patente} ${v.marca} ${v.numerointerno || ""}`.toLowerCase().includes(busquedaVehiculo.toLowerCase()),
  )

  const articulosFiltrados = articulos.filter((a) => a.nombre.toLowerCase().includes(busquedaArticulo.toLowerCase()))

  const vehiculosFiltradosFiltro = vehiculos.filter((v) =>
    `${v.patente} ${v.marca} ${v.numerointerno || ""}`.toLowerCase().includes(busquedaVehiculoFiltro.toLowerCase()),
  )

  const articulosFiltradosFiltro = articulos.filter((a) =>
    a.nombre.toLowerCase().includes(busquedaArticuloFiltro.toLowerCase()),
  )

  const obtenerServicios = async () => {
    const res = await fetch(API_URLS.serviciosvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get", ...filtros, pagina }),
    })
    const json = await res.json()
    setServicios(json.datos || [])
    setTotalPaginas(json.totalPaginas || 1)
  }

  const cargarListas = async () => {
    const listas = [
      { url: API_URLS.vehiculos, set: setVehiculos },
      { url: API_URLS.articulos, set: setArticulos },
      { url: API_URLS.personas, set: setPersonas },
      { url: API_URLS.serviciosmonitoreables, set: setServiciosMonitoreables },
    ]
    for (const item of listas) {
      const res = await fetch(item.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get" }),
      })
      const data = await res.json()
      item.set(data)
    }
  }

  useEffect(() => {
    cargarListas()
    registrarse()
  }, [])

  useEffect(() => {
    obtenerServicios()
  }, [filtros, pagina])

  const onSubmit = async (datos) => {
    const payload = { ...datos, action: editId ? "update" : "insert" }
    if (editId) payload.id = editId

    const res = await fetch(API_URLS.serviciosvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    // if (json.success) {
    //   toast.success(editId ? "Servicio actualizado" : "Servicio guardado")
    //   reset()
    //   setEditId(null)
    //   setBusquedaVehiculo("")
    //   setBusquedaArticulo("")
    //   obtenerServicios()
    //   setTimeout(() => {
    //     articuloRef.current?.focus()
    //   }, 100)
    // } else {
    //   toast.error("Error al guardar")
    // }
    if (json.success) {
      toast.success(editId ? "Servicio actualizado" : "Servicio guardado")

      // Guardamos los valores que deben prevalecer
      const valoresPersistentes = {
        fecha_servicio: watch("fecha_servicio"),
        idVehiculo: watch("idVehiculo"),
        kmRecorridos: watch("kmRecorridos"),
        dniPersona: watch("dniPersona"),
      }

      // Reset parcial: mantenemos lo importante y limpiamos ítem
      reset({
        ...valoresPersistentes,
        idArticulo: "",
        cantidad: "",
        totalitemservicio: "",
        idserviciomonitoreable: "0",
        descripcion: "",
      })

      // Limpieza visual del autocompletado de artículo
      setBusquedaArticulo("")

      setPrecioUltimaCompra(null)

      setEditId(null)
      obtenerServicios()

      // Foco automático en Artículo
      setTimeout(() => {
        setFocus("idserviciomonitoreable")
      }, 100)
    }


  }

  const editar = (item) => {
    setEditId(item.id)
    setValue("idVehiculo", item.idVehiculo)
    setValue("idArticulo", item.idArticulo)
    setValue("cantidad", item.cantidad)
    setValue("dniPersona", item.dniPersona)
    setValue("descripcion", item.descripcion)
    setValue("kmRecorridos", item.kmRecorridos || 0)
    setValue("totalitemservicio", item.totalitemservicio || 0)
    setValue("idserviciomonitoreable", item.idserviciomonitoreable || 0)
    if (item.fecha_servicio) {
      const fecha = new Date(item.fecha_servicio)
      const fechaFormateada = fecha.toISOString().slice(0, 16)
      setValue("fecha_servicio", fechaFormateada)
    }
    const vehiculo = vehiculos.find((v) => v.id === item.idVehiculo)
    const articulo = articulos.find((a) => a.id === item.idArticulo)
    setBusquedaVehiculo(vehiculo ? `${vehiculo.patente} - ${vehiculo.marca}` : "")
    setBusquedaArticulo(articulo ? articulo.nombre : "")
    obtenerUltimoPrecioCompra(item.idArticulo)
  }

  const eliminar = async (id) => {
    const confirmar = await Alerta.confirmar({ texto: "¿Deseas eliminar este servicio?" })
    if (!confirmar) return

    const res = await fetch(API_URLS.serviciosvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    })
    const json = await res.json()
    if (json.success) {
      toast.success("Servicio eliminado")
      obtenerServicios()
    } else {
      toast.error("Error al eliminar")
    }
  }

  const exportarPDF = async () => {
    const tabla = tablaRef.current
    const canvas = await html2canvas(tabla, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("l", "mm", "a4")
    const imgWidth = pdf.internal.pageSize.getWidth() - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    pdf.text("Servicios a Vehículos", 14, 15)
    pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight)
    pdf.save("servicios_vehiculo.pdf")
  }

  const exportarExcel = async () => {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet("Servicios")
    ws.addRow([
      "Fecha",
      "Vehículo",
      "Artículo",
      "Categoría",
      "Cantidad",
      "Total",
      "Km",
      "Persona",
      "Descripción",
      "Servicio Monitoreable",
    ])
    servicios.forEach((s) =>
      ws.addRow([
        formatearFechaDDMMYYYY(s.fecha_servicio) + " " + formatearHora(s.fecha_servicio),
        s.numerointerno + " - " + s.patente + " - " + s.marca,
        s.nombreArticulo,
        s.categoria,
        s.cantidad,
        s.totalitemservicio || 0,
        s.kmRecorridos || 0,
        s.nombrePersona + " " + s.apellido,
        s.descripcion,
        s.idserviciomonitoreable
          ? serviciosMonitoreables.find((sm) => sm.id === s.idserviciomonitoreable)?.nombre
          : "Ninguno",
      ]),
    )
    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer])
    const link = document.createElement("a")
    link.href = window.URL.createObjectURL(blob)
    link.download = "servicios_vehiculo.xlsx"
    link.click()
  }

  const obtenerUltimoPrecioCompra = async (idArticulo) => {
    const res = await fetch(API_URLS.serviciosvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "obtenerUltimoPrecio", idArticulo }),
    })
    const json = await res.json()
    if (json.success && json.precio !== null) {
      setPrecioUltimaCompra(json.precio)
    } else {
      setPrecioUltimaCompra(null)
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedServicios = [...servicios].sort((a, b) => {
    if (!sortField) return 0

    let aValue = a[sortField]
    let bValue = b[sortField]

    // Manejar campos especiales que necesitan formateo
    if (sortField === "vehiculo") {
      aValue = `${a.numerointerno} ${a.patente} ${a.marca}`.toLowerCase()
      bValue = `${b.numerointerno} ${b.patente} ${b.marca}`.toLowerCase()
    } else if (sortField === "persona") {
      aValue = `${a.nombrePersona} ${a.apellido}`.toLowerCase()
      bValue = `${b.nombrePersona} ${b.apellido}`.toLowerCase()
    } else if (sortField === "nombreArticulo" || sortField === "categoria" || sortField === "descripcion") {
      aValue = (aValue || "").toLowerCase()
      bValue = (bValue || "").toLowerCase()
    } else if (sortField === "totalitemservicio" || sortField === "cantidad" || sortField === "kmRecorridos") {
      aValue = Number(aValue || 0)
      bValue = Number(bValue || 0)
    } else if (sortField === "fecha_servicio") {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <span className="ml-1 text-gray-400">⇅</span>
    }
    return sortDirection === "asc" ? (
      <span className="ml-1 text-blue-600">↑</span>
    ) : (
      <span className="ml-1 text-blue-600">↓</span>
    )
  }

  return (
    <div className="max-w-[1800px] mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Servicios Realizados al Vehículo</h1>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-4 gap-1 mb-6 items-start">
        <div className="relative group">
          <input
            type="datetime-local"
            {...register("fecha_servicio", { required: true })}
            className="border p-2 w-full min-w-0"
          />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Fecha y hora del servicio (se muestra la fecha actual por defecto)
          </div>
        </div>

        {/* Autocompletado Vehículo */}
        <div className="relative group col-span-1 ">
          <input
            type="text"
            value={busquedaVehiculo}
            placeholder="Vehículo"
            className="border p-2 w-full min-w-0"
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
                  setBusquedaVehiculo(`${v.patente} - ${v.marca}`)
                  setValue("idVehiculo", v.id)
                  setMostrarListaVehiculo(false)
                }
              }
              if (e.key === "Escape") setMostrarListaVehiculo(false)
            }}
          />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Seleccione el vehículo al que se le realizó el servicio
          </div>
          {mostrarListaVehiculo && busquedaVehiculo && vehiculosFiltrados.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full min-w-0 max-h-40 overflow-y-auto rounded shadow">
              {vehiculosFiltrados.map((v, index) => (
                <li
                  key={v.id}
                  onClick={() => {
                    setBusquedaVehiculo(`${v.patente} - ${v.marca}`)
                    setValue("idVehiculo", v.id)
                    setMostrarListaVehiculo(false)
                  }}
                  className={`p-2 cursor-pointer ${index === indiceVehiculo ? "bg-blue-200" : "hover:bg-blue-100"}`}
                >
                  {v.numerointerno ? `[${v.numerointerno}] ` : ""}
                  {v.patente} - {v.marca}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative group col-span-1">
          <input
            type="number"
            step="0.01"
            {...register("kmRecorridos", { required: true })}
            placeholder="Km recorridos"
            className="border p-2 w-full min-w-0"
          />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Kilometraje del vehículo al momento del servicio
          </div>
        </div>

        <div className="relative group col-span-1 ">
          <select {...register("dniPersona", { required: true })} className="border p-2 w-full min-w-0">
            <option value="">Persona</option>
            {personas.map((p) => (
              <option key={p.dni} value={p.dni}>
                {p.apellido} {p.nombre} 
              </option>
            ))}
          </select>
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Persona responsable del servicio
          </div>
        </div>


        <div className="relative group md:col-span-1">
          <select {...register("idserviciomonitoreable")} className="border p-2 w-full min-w-0" defaultValue="0">
            <option value="0">Ninguno</option>
            {serviciosMonitoreables.map((sm) => (
              <option key={sm.id} value={sm.id}>
                {sm.nombre}
              </option>
            ))}
          </select>
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Tipo de servicio monitoreable (opcional). Selecciona "Ninguno" si no aplica
          </div>
        </div>

        

        {/* Autocompletado Artículo */}
        <div className="relative group col-span-1">
          <input
            
            type="text"
            value={busquedaArticulo}
            placeholder="Artículo"
            className="border p-2 w-full min-w-0"
            onChange={(e) => {
              setBusquedaArticulo(e.target.value)
              setMostrarListaArticulo(true)
              setIndiceArticulo(-1)
              if (!e.target.value) {
                setPrecioUltimaCompra(null)
              }
            }}
            onFocus={() => setMostrarListaArticulo(true)}
            onKeyDown={(e) => {
              if (!mostrarListaArticulo || articulosFiltrados.length === 0) return

              if (e.key === "ArrowDown") {
                e.preventDefault()
                setIndiceArticulo((prev) => (prev < articulosFiltrados.length - 1 ? prev + 1 : 0))
              }
              if (e.key === "ArrowUp") {
                e.preventDefault()
                setIndiceArticulo((prev) => (prev > 0 ? prev - 1 : articulosFiltrados.length - 1))
              }
              if (e.key === "Enter") {
                e.preventDefault()
                if (indiceArticulo >= 0) {
                  const a = articulosFiltrados[indiceArticulo]
                  setBusquedaArticulo(a.nombre)
                  setValue("idArticulo", a.id)
                  obtenerUltimoPrecioCompra(a.id)
                  setMostrarListaArticulo(false)
                }
              }
              if (e.key === "Escape") setMostrarListaArticulo(false)
            }}
          />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Artículo o repuesto utilizado en el servicio
          </div>

          {mostrarListaArticulo && busquedaArticulo && articulosFiltrados.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full min-w-0 max-h-40 overflow-y-auto rounded shadow">
              {articulosFiltrados.map((a, index) => (
                <li
                  key={a.id}
                  onClick={() => {
                    setBusquedaArticulo(a.nombre)
                    setValue("idArticulo", a.id)
                    obtenerUltimoPrecioCompra(a.id)
                    setMostrarListaArticulo(false)
                  }}
                  className={`p-2 cursor-pointer ${index === indiceArticulo ? "bg-blue-200" : "hover:bg-blue-100"}`}
                >
                  {a.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative group">
          <input
            type="number"
            step="0.01"
            {...register("cantidad", { required: true })}
            placeholder="Cantidad"
            className="border p-2 w-full min-w-0"
          />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Cantidad de artículos utilizados
          </div>
        </div>

        <div className="relative group">
          <input
            type="number"
            step="0.01"
            {...register("totalitemservicio")}
            placeholder="Total del ítem"
            className="border p-2 bg-yellow-50 w-full min-w-0"
            title="Este campo se calcula automáticamente (precio × cantidad) pero puede editarse"
          />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Total del ítem (precio × cantidad). Se calcula automáticamente pero puede editarse
          </div>
        </div>

        
        
        

        <div className="relative group col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-4">
          <input {...register("descripcion")} placeholder="Descripción" className="border p-2 w-full min-w-0" />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            Descripción adicional del servicio realizado
          </div>
        </div>

        {precioUltimaCompra !== null && (
          <div className="col-span-full bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded">
            Precio última compra: ${Number(precioUltimaCompra).toFixed(2)}
          </div>
        )}

        <button type="submit" className="bg-blue-600 text-white  px-4 py-2 rounded col-span-full">
          {editId ? "Actualizar" : "Guardar Servicio"}
        </button>
      </form>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="date"
          className="border-blue-500 p-1 bg-lime-100"
          value={filtros.fechaDesde}
          onChange={(e) => setFiltros((prev)=>
            (
              { ...prev, fechaDesde: e.target.value }
            )
          )}
        />
        <input
          type="date"
          className="border-blue-500 bg-lime-100 p-1"
          value={filtros.fechaHasta}
          onChange={(e) => setFiltros((prev)=>(
            { ...prev, fechaHasta: e.target.value }
            )
        )}
        />

        {/* Autocompletado filtro Vehículo */}
        <div className="relative group col-span-2 md:col-span-1">
          <input
            type="text"
            value={busquedaVehiculoFiltro}
            placeholder="Vehículo"
            className="border p-2 w-full min-w-0"
            onChange={(e) => {
              setBusquedaVehiculoFiltro(e.target.value)
              setMostrarListaVehiculoFiltro(true)
              setIndiceVehiculoFiltro(-1)
            }}
            onFocus={() => setMostrarListaVehiculoFiltro(true)}
            onKeyDown={(e) => {
              if (!mostrarListaVehiculoFiltro || vehiculosFiltradosFiltro.length === 0) return

              if (e.key === "ArrowDown") {
                e.preventDefault()
                setIndiceVehiculoFiltro((prev) => (prev < vehiculosFiltradosFiltro.length - 1 ? prev + 1 : 0))
              }
              if (e.key === "ArrowUp") {
                e.preventDefault()
                setIndiceVehiculoFiltro((prev) => (prev > 0 ? prev - 1 : vehiculosFiltradosFiltro.length - 1))
              }
              if (e.key === "Enter") {
                e.preventDefault()
                if (indiceVehiculoFiltro >= 0) {
                  const v = vehiculosFiltradosFiltro[indiceVehiculoFiltro]
                  setBusquedaVehiculoFiltro(`${v.patente} - ${v.marca}`)
                  setFiltros({ ...filtros, idVehiculo: v.id })
                  setMostrarListaVehiculoFiltro(false)
                }
              }
              if (e.key === "Escape") setMostrarListaVehiculoFiltro(false)
            }}
          />
          {mostrarListaVehiculoFiltro && busquedaVehiculoFiltro && vehiculosFiltradosFiltro.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full min-w-0 max-h-40 overflow-y-auto rounded shadow">
              {vehiculosFiltradosFiltro.map((v, index) => (
                <li
                  key={v.id}
                  onClick={() => {
                    setBusquedaVehiculoFiltro(`${v.patente} - ${v.marca}`)
                    setFiltros({ ...filtros, idVehiculo: v.id })
                    setMostrarListaVehiculoFiltro(false)
                  }}
                  className={`p-2 cursor-pointer ${
                    index === indiceVehiculoFiltro ? "bg-blue-200" : "hover:bg-blue-100"
                  }`}
                >
                  {v.numerointerno ? `[${v.numerointerno}] ` : ""}
                  {v.patente} - {v.marca}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Autocompletado filtro Artículo */}
        <div className="relative group col-span-2 md:col-span-1">
          <input
            type="text"
            value={busquedaArticuloFiltro}
            placeholder="Artículo"
            className="border p-2 w-full min-w-0"
            onChange={(e) => {
              setBusquedaArticuloFiltro(e.target.value)
              setMostrarListaArticuloFiltro(true)
              setIndiceArticuloFiltro(-1)
            }}
            onFocus={() => setMostrarListaArticuloFiltro(true)}
            onKeyDown={(e) => {
              if (!mostrarListaArticuloFiltro || articulosFiltradosFiltro.length === 0) return

              if (e.key === "ArrowDown") {
                e.preventDefault()
                setIndiceArticuloFiltro((prev) => (prev < articulosFiltradosFiltro.length - 1 ? prev + 1 : 0))
              }
              if (e.key === "ArrowUp") {
                e.preventDefault()
                setIndiceArticuloFiltro((prev) => (prev > 0 ? prev - 1 : articulosFiltradosFiltro.length - 1))
              }
              if (e.key === "Enter") {
                e.preventDefault()
                if (indiceArticuloFiltro >= 0) {
                  const a = articulosFiltradosFiltro[indiceArticuloFiltro]
                  setBusquedaArticuloFiltro(a.nombre)
                  setFiltros({ ...filtros, idArticulo: a.id })
                  setMostrarListaArticuloFiltro(false)
                }
              }
              if (e.key === "Escape") setMostrarListaArticuloFiltro(false)
            }}
          />
          {mostrarListaArticuloFiltro && busquedaArticuloFiltro && articulosFiltradosFiltro.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full min-w-0 max-h-40 overflow-y-auto rounded shadow">
              {articulosFiltradosFiltro.map((a, index) => (
                <li
                  key={a.id}
                  onClick={() => {
                    setBusquedaArticuloFiltro(a.nombre)
                    setFiltros({ ...filtros, idArticulo: a.id })
                    setMostrarListaArticuloFiltro(false)
                  }}
                  className={`p-2 cursor-pointer ${
                    index === indiceArticuloFiltro ? "bg-blue-200" : "hover:bg-blue-100"
                  }`}
                >
                  {a.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={() => setPagina(1)} className="bg-blue-600 text-white px-3 py-1 rounded">
          Buscar
        </button>
        <button onClick={exportarPDF} className="bg-yellow-600 text-white px-3 py-1 rounded">
          PDF
        </button>
        <button onClick={exportarExcel} className="bg-green-600 text-white px-3 py-1 rounded">
          Excel
        </button>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto -mx-4 px-4" ref={tablaRef}>
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort("fecha_servicio")}>
                Fecha{renderSortIcon("fecha_servicio")}
              </th>
              <th className="px-2 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort("vehiculo")}>
                Vehículo{renderSortIcon("vehiculo")}
              </th>
              <th className="px-2 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort("nombreArticulo")}>
                Artículo{renderSortIcon("nombreArticulo")}
              </th>
              <th className="px-2 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort("categoria")}>
                Categoría{renderSortIcon("categoria")}
              </th>
              <th className="px-2 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort("cantidad")}>
                Cant.{renderSortIcon("cantidad")}
              </th>
              <th
                className="px-2 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("totalitemservicio")}
              >
                Total{renderSortIcon("totalitemservicio")}
              </th>
              <th className="px-2 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort("kmRecorridos")}>
                Km{renderSortIcon("kmRecorridos")}
              </th>
              <th className="px-2 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort("persona")}>
                Persona{renderSortIcon("persona")}
              </th>
              <th className="px-2 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort("descripcion")}>
                Descripción{renderSortIcon("descripcion")}
              </th>
              <th
                className="px-2 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("idserviciomonitoreable")}
              >
                Servicio Monitoreable{renderSortIcon("idserviciomonitoreable")}
              </th>
              <th className="px-2 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedServicios.map((s, i) => (
              <tr key={i} className="text-center border-t hover:bg-gray-50">
                <td className="px-2 py-2 whitespace-nowrap">{formatearFechaHora(s.fecha_servicio)}</td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {s.numerointerno} - {s.patente} - {s.marca}
                </td>
                <td className="px-2 py-2">{s.nombreArticulo}</td>
                <td className="px-2 py-2">{s.categoria}</td>
                <td className="px-2 py-2">{s.cantidad}</td>
                <td className="px-2 py-2 whitespace-nowrap">${Number(s.totalitemservicio || 0).toFixed(2)}</td>
                <td className="px-2 py-2">{s.kmRecorridos || 0}</td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {s.nombrePersona} {s.apellido}
                </td>
                <td className="px-2 py-2">{s.descripcion}</td>
                <td className="px-2 py-2">
                  {s.idserviciomonitoreable
                    ? serviciosMonitoreables.find((sm) => sm.id === s.idserviciomonitoreable)?.nombre
                    : "Ninguno"}
                </td>
                <td className="px-2 py-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => editar(s)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-2 rounded text-sm"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => eliminar(s.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-2 rounded text-sm"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              className={`px-2 py-1 rounded ${pagina === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700">Total Gastado en Servicios:</span>
            <span className="text-2xl font-bold text-blue-700">${totalGastado.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
