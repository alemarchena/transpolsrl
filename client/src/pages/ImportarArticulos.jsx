import { useState } from "react"
import {
  AiOutlineUpload,
  AiOutlineFileExcel,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineExclamationCircle,
} from "react-icons/ai"
import * as ExcelJS from "exceljs"
import { API_URLS } from "../api/api";

export default function ImportarArticulos() {
  const [archivo, setArchivo] = useState(null)
  const [articulosPreview, setArticulosPreview] = useState([])
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setArchivo(file)
    setResultado(null)

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(arrayBuffer)

        const worksheet = workbook.worksheets[0]
        const jsonData = []

        // Leer las filas del worksheet (saltando el encabezado)
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return // Saltar encabezado

          const rowData = {}
          row.eachCell((cell, colNumber) => {
            // Mapear columnas según el orden esperado: nombre, idCategoria, descripcion, activo, stock_minimo
            const headers = ["nombre", "idCategoria", "descripcion", "activo", "stock_minimo"]
            if (headers[colNumber - 1]) {
              rowData[headers[colNumber - 1]] = cell.value
            }
          })
          if (Object.keys(rowData).length > 0) {
            jsonData.push(rowData)
          }
        })

        // Mapear los datos del Excel a nuestro formato
        const articulos = jsonData.map((row) => ({
          nombre: row.nombre || "",
          idCategoria: Number.parseInt(row.idCategoria) || 0,
          descripcion: row.descripcion || "",
          activo: Number.parseInt(row.activo) || 1,
          stock_minimo: Number.parseFloat(row.stock_minimo) || 0,
        }))

        setArticulosPreview(articulos)
      } catch (error) {
        console.error("Error al leer el archivo:", error)
        alert("Error al leer el archivo Excel. Verifica el formato.")
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const importarArticulos = async () => {
    if (articulosPreview.length === 0) {
      alert("No hay datos para importar")
      return
    }

    setCargando(true)
    try {
      const response = await fetch(API_URLS.importararticulos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "importar",
          articulos: articulosPreview,
        }),
      })

      const data = await response.json()
      setResultado(data)
    } catch (error) {
      console.error("Error al importar:", error)
      alert("Error al importar los artículos")
    } finally {
      setCargando(false)
    }
  }

  const limpiarFormulario = () => {
    setArchivo(null)
    setArticulosPreview([])
    setResultado(null)
    // Resetear el input file
    const fileInput = document.getElementById("file-input")
    if (fileInput) fileInput.value = ""
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Importar Artículos desde Excel</h1>
          <p className="text-gray-600 mb-6">
            Sube un archivo Excel con las columnas: nombre, idCategoria, descripcion, activo, stock_minimo
          </p>

          {/* Sección de carga de archivo */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input id="file-input" type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
            <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center justify-center">
              <AiOutlineUpload className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {archivo ? archivo.name : "Selecciona un archivo Excel"}
              </p>
              <p className="text-sm text-gray-500">Haz clic para seleccionar o arrastra el archivo aquí</p>
            </label>
          </div>

          {/* Preview de datos */}
          {articulosPreview.length > 0 && !resultado && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <AiOutlineFileExcel className="w-5 h-5" />
                  Vista previa ({articulosPreview.length} artículos)
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={limpiarFormulario}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={importarArticulos}
                    disabled={cargando}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {cargando ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Importando...
                      </>
                    ) : (
                      "Importar Artículos"
                    )}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Mínimo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {articulosPreview.slice(0, 10).map((art, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{art.nombre}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{art.idCategoria}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{art.descripcion}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              art.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {art.activo ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{art.stock_minimo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {articulosPreview.length > 10 && (
                  <div className="bg-gray-50 px-4 py-3 text-sm text-gray-600 text-center border-t">
                    Mostrando 10 de {articulosPreview.length} artículos
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resultado de la importación */}
          {resultado && (
            <div className="mt-6">
              <div className="bg-white border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  {resultado.errores.length === 0 ? (
                    <AiOutlineCheckCircle className="w-8 h-8 text-green-500" />
                  ) : resultado.insertados > 0 ? (
                    <AiOutlineExclamationCircle className="w-8 h-8 text-yellow-500" />
                  ) : (
                    <AiOutlineCloseCircle className="w-8 h-8 text-red-500" />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Importación Completada</h2>
                    <p className="text-gray-600">
                      {resultado.insertados} de {resultado.total} artículos importados correctamente
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium mb-1">Exitosos</p>
                    <p className="text-3xl font-bold text-green-700">{resultado.insertados}</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600 font-medium mb-1">Errores</p>
                    <p className="text-3xl font-bold text-red-700">{resultado.errores.length}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium mb-1">Total</p>
                    <p className="text-3xl font-bold text-blue-700">{resultado.total}</p>
                  </div>
                </div>

                {resultado.errores.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Errores detectados:</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                      {resultado.errores.map((error, idx) => (
                        <div key={idx} className="text-sm text-red-700 mb-2">
                          <span className="font-medium">Fila {error.fila}:</span> {error.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={limpiarFormulario}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Importar otro archivo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Formato del archivo Excel</h3>
          <p className="text-blue-800 mb-3">El archivo debe contener las siguientes columnas en la primera fila:</p>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>
              <strong>nombre</strong>: Nombre del artículo (obligatorio)
            </li>
            <li>
              <strong>idCategoria</strong>: ID de la categoría (número)
            </li>
            <li>
              <strong>descripcion</strong>: Descripción del artículo
            </li>
            <li>
              <strong>activo</strong>: 1 para activo, 0 para inactivo
            </li>
            <li>
              <strong>stock_minimo</strong>: Stock mínimo (número decimal)
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
