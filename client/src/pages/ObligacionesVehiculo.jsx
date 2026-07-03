import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { useForm, Controller } from "react-hook-form";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Loader from "../components/Loader";
import { API_URLS } from "../api/api";
import { toast } from 'react-toastify';
import Alerta from "../pages/Alertas";
import { FaSyncAlt, FaTrash } from "react-icons/fa";

export default function ObligacionesVehiculo() {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [busqueda, setBusqueda] = useState("");

    const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Obligaciones Vehiculo')
  }

  const obtenerDatos = async () => {
    setLoading(true);
    const res = await fetch(API_URLS.obligacionesvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" })
    });
    const data = await res.json();
    setDatos(data);
    setLoading(false);
  };

  const onSubmit = async (formData) => {
    const payload = {
      action: editId ? "update" : "insert",
      id: editId,
      nombre: formData.nombre,
      loTiene: formData.loTiene ? 1 : 0,
      tieneVencimiento: formData.tieneVencimiento ? 1 : 0
    };

    const res = await fetch(API_URLS.obligacionesvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (result.success) {
      toast.success("Obligación guardada correctamente");
      obtenerDatos();
      reset();
      setEditId(null);
    } else {
      toast.error("Error al guardar");
    }
  };

  const editar = (item) => {
    setEditId(item.id);
    setValue("nombre", item.nombre);
    setValue("loTiene", item.lotiene === "1" || item.lotiene === 1);
    setValue("tieneVencimiento", item.tienevencimiento === "1" || item.tienevencimiento === 1);
  };

  const eliminar = async (id) => {
    if (!await Alerta.confirmar({ texto: "¿Deseas eliminar esta obligación?" })) return;

    const res = await fetch(API_URLS.obligacionesvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id })
    });

    const result = await res.json();
    if (result.success) {
      toast.success("Eliminado correctamente");
      obtenerDatos();
    } else {
      toast.error("Error al eliminar");
    }
  };

  const exportarPDF = () => {
    const input = document.getElementById("tabla-obligacionesvehiculo");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("obligaciones-vehiculo.pdf");
    });
  };

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("ObligacionesVehiculo");
    sheet.columns = [
      { header: "Nombre", key: "nombre" },
      { header: "Lo tiene", key: "lotiene" },
      { header: "Tiene Vencimiento", key: "tienevencimiento" }
    ];
    datos.forEach((d) => {
      sheet.addRow({
        nombre: d.nombre,
        lotiene: d.lotiene === 1 || d.lotiene === "1" ? "Sí" : "No",
        tienevencimiento: d.tienevencimiento === 1 || d.tienevencimiento === "1" ? "Sí" : "No"
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "obligaciones-vehiculo.xlsx");
  };

  useEffect(() => {
    obtenerDatos();
    registrarse()
  }, []);

  const datosFiltrados = datos.filter((d) =>
    d.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Obligaciones del Vehículo</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-wrap items-center gap-2 mb-4"
      >
        <input
          {...register("nombre", { required: true })}
          placeholder="Nombre"
          className="border p-2 rounded w-60"
        />
        <label className="flex items-center gap-2">
          <Controller
            name="loTiene"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                /> Obligación activa
              </>
            )}
          />
        </label>
        <label className="flex items-center gap-2">
          <Controller
            name="tieneVencimiento"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                /> Tiene Vencimiento
              </>
            )}
          />
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 w-full border p-4 rounded">
        <input
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-2 border bg-lime-100 border-blue-500 rounded w-full md:w-1/2"
        />
        <div className="flex gap-2">
          <button
            onClick={obtenerDatos}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <FaSyncAlt /> Actualizar
          </button>
          <button
            onClick={exportarPDF}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            PDF
          </button>
          <button
            onClick={exportarExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Excel
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div id="tabla-obligacionesvehiculo" className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">Nombre</th>
                <th className="border px-2 py-1 text-center">Obligación activa</th>
                <th className="border px-2 py-1 text-center">Tiene Vencimiento</th>
                <th className="border px-2 py-1 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{item.nombre}</td>
                  <td className="border px-2 py-1 text-center">{item.lotiene == 1 ? "Sí" : "No"}</td>
                  <td className="border px-2 py-1 text-center">{item.tienevencimiento == 1 ? "Sí" : "No"}</td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => editar(item)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(item.id)}
                      className="bg-red-600 text-white px-2 py-2 rounded hover:bg-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {datosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No hay datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
