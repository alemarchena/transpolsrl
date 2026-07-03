import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { useForm, useFieldArray } from "react-hook-form"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import Swal from "sweetalert2"

import { API_URLS } from "../api/api"
import Loader from "../components/Loader"
import { toast } from "react-toastify"
import { FaTrash } from "react-icons/fa"
import { separarFechaHora } from "../utils/formatoFechas"
import { calcularBrutoDesdeNeto, OPCIONES_REDONDEO } from "../utils/calculoPrecios"

export default function Compras() {
  const { register, handleSubmit, reset, control, watch, setValue } = useForm({
    defaultValues: { detalles: [{ iva: 21, esnuevo: 1 }] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: "detalles" })

  const [articulos, setArticulos] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [compras, setCompras] = useState([])
  const [loading, setLoading] = useState(false)
  const [filtros, setFiltros] = useState({
    fechaDesde: "",
    fechaHasta: "",
    tipo_factura: "",
    nro_factura: "",
  })
  const [editandoId, setEditandoId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})
  const tablaRef = useRef()

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Compras')
  }

  const obtenerDatos = async () => {
    setLoading(true)
    const res = await fetch(API_URLS.compras, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get", ...filtros }),
    })
    const data = await res.json()
    setCompras(data)
    setLoading(false)
  }

  useEffect(() => {
    const fetchAll = async () => {
      const urls = [API_URLS.articulos, API_URLS.proveedores, API_URLS.usuarios]
      const setters = [setArticulos, setProveedores, setUsuarios]
      for (let i = 0; i < urls.length; i++) {
        const res = await fetch(urls[i], {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get" }),
        })
        const data = await res.json()
        setters[i](data)
      }
    }
    fetchAll()
    registrarse()
  }, [])

  const onSubmit = async (data) => {
    const dataConIVA = {
      ...data,
      detalles: data.detalles.map((item) => {
        const cantidad = Number.parseFloat(item.cantidad || 0)
        const bruto = Number.parseFloat(item.precio_unitario || 0)
        const neto = Number.parseFloat(item.total_neto || 0)
        const porcentajeIVA = Number.parseFloat(item.iva || 0)
        const ivaUnitario = porcentajeIVA === 0 ? 0 : bruto - neto

        return {
          ...item,
          total_iva: +(ivaUnitario * cantidad).toFixed(OPCIONES_REDONDEO.decimales),
          total_neto: +(neto * cantidad).toFixed(OPCIONES_REDONDEO.decimales),
          total_bruto: +(bruto * cantidad).toFixed(OPCIONES_REDONDEO.decimales),
          precio_unitario: +bruto.toFixed(OPCIONES_REDONDEO.decimales),
        }
      }),
    }

    const res = await fetch(API_URLS.compras, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "insert", ...dataConIVA }),
    })

    const json = await res.json()
    if (json.success) {
      toast.success("Compra guardada correctamente")
      reset({ detalles: [] })
      obtenerDatos()
    } else {
      toast.error("Error: " + json.error)
    }
  }

  const eliminarDetalle = async (idDetalle) => {
    const result = await Swal.fire({
      title: "¿Eliminar este detalle?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      background: "#ffffff",
      customClass: {
        popup: "rounded-xl shadow-2xl border-0",
        title: "text-2xl font-bold text-gray-800",
        htmlContainer: "text-gray-600",
        confirmButton: "px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors",
        cancelButton: "px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-500 transition-colors",
      },
      buttonsStyling: true,
    })

    if (!result.isConfirmed) return

    const res = await fetch(API_URLS.compras, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteDetalle", id: idDetalle }),
    })

    const json = await res.json()
    if (json.success) {
      toast.success("Detalle eliminado correctamente")
      obtenerDatos()
    } else {
      toast.error("Error: " + json.error)
    }
  }

  const comenzarEdicion = (item) => {
    setEditandoId(item.idDetalle)
    setEditForm({
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      total_neto: item.total_neto,
      total_iva: item.total_iva,
    })
  }

  const guardarEdicion = async (idCompra) => {
    const res = await fetch(API_URLS.compras, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        id: idCompra,
        idProveedor: editData.idProveedor,
      }),
    })
    const json = await res.json()
    if (json.success) {
      toast.success("Compra actualizada")
      setEditId(null)
      setEditData({})
      obtenerDatos()
    } else {
      toast.error("Error: " + json.error)
    }
  }

  const cancelarEdicion = () => {
    setEditId(null)
    setEditData({})
  }

  const totalizador = {}
  compras.forEach((c) => {
    const key = `${c.tipo_factura}-${c.nro_factura}`
    if (!totalizador[key]) totalizador[key] = { neto: 0, iva: 0 }
    totalizador[key].neto += Number.parseFloat(c.total_neto)
    totalizador[key].iva += Number.parseFloat(c.total_iva)
  })

  const [editandoDetalleId, setEditandoDetalleId] = useState(null)
  const [detalleEditado, setDetalleEditado] = useState({})

  const comenzarEdicionDetalle = (detalle) => {
    setEditandoDetalleId(detalle.idDetalle)
    setDetalleEditado({
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario,
      iva: detalle.iva,
    })
  }

  const cancelarEdicionDetalle = () => {
    setEditandoDetalleId(null)
    setDetalleEditado({})
  }

  const guardarDetalleEditado = async (idDetalle) => {
    const { cantidad, precio_unitario, iva } = detalleEditado
    const bruto = Number.parseFloat(precio_unitario)
    const cant = Number.parseFloat(cantidad)
    const porcentajeIVA = Number.parseFloat(iva)
    const totalBruto = +(bruto * cant).toFixed(OPCIONES_REDONDEO.decimales)

    const netoUnitario = porcentajeIVA === 0 ? bruto : bruto / (1 + porcentajeIVA / 100)

    const ivaUnitario = porcentajeIVA === 0 ? 0 : bruto - netoUnitario

    const totalNeto = +(netoUnitario * cant).toFixed(OPCIONES_REDONDEO.decimales)
    const totalIVA = +(ivaUnitario * cant).toFixed(OPCIONES_REDONDEO.decimales)

    const detalleOriginal = compras.find((c) => c.idDetalle === idDetalle)
    const esnuevo = detalleOriginal?.esnuevo ?? 1

    const res = await fetch(API_URLS.compras, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateDetalle",
        id: idDetalle,
        cantidad: cant,
        precio_unitario: bruto,
        iva: porcentajeIVA,
        total_neto: totalNeto,
        total_iva: totalIVA,
        total_bruto: totalBruto,
        esnuevo: esnuevo,
      }),
    })

    const data = await res.json()
    if (data.success) {
      toast.success("Detalle actualizado")
      cancelarEdicionDetalle()
      obtenerDatos()
    } else {
      toast.error("Error al actualizar")
    }
  }

  const exportarPDF = async () => {
    const tabla = tablaRef.current
    if (!tabla) return

    const canvas = await html2canvas(tabla, {
      scale: 2, // Aumenta la resolución
      useCORS: true,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("l", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.setFontSize(12)
    pdf.text("Listado de Compras", 14, 15)
    pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight)
    pdf.save(`compras_${new Date().toLocaleDateString("es-AR")}.pdf`)
  }

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Compras")

    // Encabezados
    sheet.addRow([
      "Fecha",
      "Tipo",
      "Factura",
      "Proveedor",
      "Usuario",
      "Artículo",
      "Cantidad",
      "Precio Unitario",
      "Total Bruto",
      "Total Neto",
      "Total IVA",
    ])

    // Filas
    compras.forEach((c) => {
      const fila = sheet.addRow([
        c.fecha,
        c.tipo_factura,
        c.nro_factura,
        c.proveedor,
        c.usuario,
        c.articulo,
        Number.parseFloat(c.cantidad),
        Number.parseFloat(c.precio_unitario.toString().replace(".", ",")),
        Number.parseFloat(c.total_bruto.toString().replace(".", ",")),
        Number.parseFloat(c.total_neto.toString().replace(".", ",")),
        Number.parseFloat(c.total_iva.toString().replace(".", ",")),
      ])

      fila.height = 25 // aumenta la altura de la fila
    })

    // Estilos generales (opcional)
    sheet.columns.forEach((col) => {
      col.width = 18
      col.alignment = { vertical: "middle", horizontal: "center", wrapText: true }
    })

    // Generar y descargar
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    saveAs(blob, `compras_${new Date().toLocaleDateString("es-AR")}.xlsx`)
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Compras</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-5 gap-2 mb-6">
        <div className="group relative">
          <input
            type="datetime-local"
            {...register("fecha", { required: true })}
            className="border p-2 w-full"
            title="Fecha y hora de la compra"
          />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Fecha y hora de la compra
          </div>
        </div>

        <div className="group relative">
          <select
            {...register("tipo_factura", { required: true })}
            className="border p-2 w-full"
            title="Tipo de factura (A, B, C, E, M, T)"
          >
            <option value="">Tipo</option>
            {["A", "B", "C", "E", "M", "T"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Tipo de factura
          </div>
        </div>

        <div className="group relative">
          <input
            type="text"
            {...register("nro_factura", { required: true })}
            placeholder="N° Factura"
            className="border p-2 w-full"
            title="Número de factura"
          />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Número de factura
          </div>
        </div>

        <div className="group relative">
          <select
            {...register("idProveedor", { required: true })}
            className="border p-2 w-full"
            title="Seleccionar proveedor"
          >
            <option value="">Proveedor</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.razon_social}
              </option>
            ))}
          </select>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Seleccionar proveedor
          </div>
        </div>

        <div className="group relative">
          <select
            {...register("email", { required: true })}
            className="border p-2 w-full"
            title="Usuario que registra la compra"
          >
            <option value="">Usuario</option>
            {usuarios.map((u) => (
              <option key={u.email} value={u.email}>
                {u.email}
              </option>
            ))}
          </select>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Usuario que registra
          </div>
        </div>

        <div className="col-span-full">
          <h2 className="font-bold my-2">Detalles de compra</h2>
          {fields.map((item, index) => {
            const porcentajeIVA = watch(`detalles.${index}.iva`) || 0

            const handleFieldChange = (index, field, value) => {
              const porcentajeIVA = Number.parseFloat(watch(`detalles.${index}.iva`) || 0)
              const cantidad = Number.parseFloat(watch(`detalles.${index}.cantidad`) || 1)

              let neto = 0,
                bruto = 0

              if (field === "total_neto") {
                neto = Number.parseFloat(value) || 0
                bruto = porcentajeIVA === 0 ? neto : calcularBrutoDesdeNeto(neto, porcentajeIVA)
              } else if (field === "precio_unitario") {
                bruto = Number.parseFloat(value) || 0
                neto = porcentajeIVA === 0 ? bruto : bruto / (1 + porcentajeIVA / 100)
              }

              setValue(`detalles.${index}.total_neto`, neto.toFixed(2))
              setValue(`detalles.${index}.precio_unitario`, bruto.toFixed(2))
            }

            return (
              <div key={item.id} className="grid md:grid-cols-6 gap-2 items-center mb-2">
                <div className="group relative">
                  <select
                    {...register(`detalles.${index}.idArticulo`, { required: true })}
                    className="border p-1 w-full"
                    title="Seleccionar artículo"
                  >
                    <option value="">Artículo</option>
                    {articulos.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nombre}
                      </option>
                    ))}
                  </select>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Seleccionar artículo
                  </div>
                </div>

                <div className="group relative">
                  <input
                    type="number"
                    step="0.01"
                    {...register(`detalles.${index}.cantidad`, { required: true })}
                    placeholder="Cantidad"
                    className="border p-1 w-full"
                    title="Cantidad de artículos"
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Cantidad de unidades
                  </div>
                </div>

                <div className="group relative">
                  <input
                    type="number"
                    step="0.01"
                    {...register(`detalles.${index}.total_neto`)}
                    placeholder="Neto"
                    className="border p-1 w-full"
                    onBlur={(e) => handleFieldChange(index, "total_neto", e.target.value)}
                    title="Valor neto sin IVA"
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Valor neto unitario sin IVA
                  </div>
                </div>

                <div className="group relative">
                  <input
                    type="number"
                    step="0.01"
                    {...register(`detalles.${index}.precio_unitario`)}
                    placeholder="Bruto"
                    className="border p-1 w-full"
                    onBlur={(e) => handleFieldChange(index, "precio_unitario", e.target.value)}
                    title="Valor bruto con IVA"
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Valor bruto unitario con IVA
                  </div>
                </div>

                <div className="group relative">
                  <input
                    type="number"
                    step="0.01"
                    {...register(`detalles.${index}.iva`)}
                    placeholder="% IVA"
                    className="border p-1 w-full"
                    onBlur={() => {
                      const bruto = Number.parseFloat(watch(`detalles.${index}.precio_unitario`)) || 0
                      const neto = Number.parseFloat(watch(`detalles.${index}.total_neto`)) || 0
                      handleFieldChange(index, bruto ? "precio_unitario" : "total_neto", bruto || neto)
                    }}
                    title="Porcentaje de IVA (0, 10.5, 21, 27)"
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Porcentaje de IVA
                  </div>
                </div>

                <button type="button" onClick={() => remove(index)} className="text-red-600" title="Eliminar detalle">
                  <FaTrash />
                </button>
              </div>
            )
          })}

          <button
            type="button"
            onClick={() => append({ iva: 21, esnuevo: 1 })}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            + Agregar Detalle
          </button>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded col-span-full">
          Guardar Compra
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="date"
          className="border p-1 bg-lime-100 border-blue-500"
          value={filtros.fechaDesde}
          onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
          placeholder="Desde"
        />
        <input
          type="date"
          className="border p-1 bg-lime-100 border-blue-500"
          value={filtros.fechaHasta}
          onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
          placeholder="Hasta"
        />
        <input
          type="text"
          className="border p-1"
          placeholder="Tipo"
          onChange={(e) => setFiltros({ ...filtros, tipo_factura: e.target.value })}
        />
        <input
          type="text"
          className="border p-1"
          placeholder="N° Factura"
          onChange={(e) => setFiltros({ ...filtros, nro_factura: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-2" onClick={obtenerDatos}>
          Buscar
        </button>
      </div>

      <div className="border rounded p-4">
        <div className="flex gap-2 justify-end my-4">
          <button className="bg-yellow-600 text-white px-4 py-1 rounded" onClick={exportarPDF}>
            PDF
          </button>
          <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={exportarExcel}>
            Excel
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div id="tabla-mensaje" className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-gray-200 text-center border-t min-h-[40px] h-12 align-middle">
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Factura</th>
                    <th>Proveedor</th>
                    <th>Usuario</th>
                    <th>Artículo</th>
                    <th>Cant.</th>
                    <th>Precio Unitario</th>
                    <th>Total Bruto</th>
                    <th>Total Neto</th>
                    <th>Total IVA</th>
                    <th>🗑</th>
                  </tr>
                </thead>
                <tbody>
                  {compras.map((c, i) => {
                    const { fecha, hora } = separarFechaHora(c.fecha)
                    const esEdicion = editId === c.id

                    return (
                      <tr key={i} className="text-center border-t min-h-[40px] h-12 align-middle">
                        <td>
                          {fecha} {hora}
                        </td>
                        <td>{c.tipo_factura}</td>
                        <td>{c.nro_factura}</td>
                        <td>
                          {esEdicion ? (
                            <select
                              className="border p-1"
                              value={editData.idProveedor || ""}
                              onChange={(e) => setEditData({ ...editData, idProveedor: e.target.value })}
                            >
                              <option value="">Proveedor</option>
                              {proveedores.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.razon_social}
                                </option>
                              ))}
                            </select>
                          ) : (
                            c.proveedor
                          )}
                        </td>
                        <td>{c.usuario}</td>
                        <td>{c.articulo}</td>
                        <td>
                          {editandoDetalleId === c.idDetalle ? (
                            <input
                              type="number"
                              step="0.01"
                              className="border p-1 w-16"
                              value={detalleEditado.cantidad}
                              onChange={(e) => setDetalleEditado({ ...detalleEditado, cantidad: e.target.value })}
                            />
                          ) : (
                            c.cantidad
                          )}
                        </td>

                        <td>
                          {editandoDetalleId === c.idDetalle ? (
                            <input
                              type="number"
                              step="0.01"
                              className="border p-1 w-16"
                              value={detalleEditado.precio_unitario}
                              onChange={(e) =>
                                setDetalleEditado({ ...detalleEditado, precio_unitario: e.target.value })
                              }
                            />
                          ) : (
                            c.precio_unitario
                          )}
                        </td>
                        <td>{(Number.parseFloat(c.precio_unitario) * Number.parseFloat(c.cantidad)).toFixed(2)}</td>

                        <td>{c.total_neto}</td>
                        <td>{c.total_iva}</td>

                        <td className="flex gap-1 justify-center">
                          {esEdicion ? (
                            <>
                              <button onClick={() => guardarEdicion(c.id)} className="text-green-600">
                                💾
                              </button>
                              <button onClick={cancelarEdicion} className="text-gray-500">
                                ❌
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditId(c.id)
                                  setEditData({
                                    idProveedor: proveedores.find((p) => p.razon_social === c.proveedor)?.id || "",
                                  })
                                }}
                                className="text-blue-600"
                              >
                                ✏️
                              </button>
                              <button onClick={() => eliminarDetalle(c.idDetalle)} className="text-red-600">
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="font-bold mb-3">Total por factura:</h3>
              <div className="space-y-1">
                {Object.entries(totalizador).map(([key, val], i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span>
                      {key}: Neto ${val.neto.toFixed(2)} + IVA ${val.iva.toFixed(2)} =
                    </span>
                    <strong>${(val.neto + val.iva).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
