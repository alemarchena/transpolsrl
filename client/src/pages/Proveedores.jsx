import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { useForm } from 'react-hook-form';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';
import Loading from '../components/Loader';
import { API_URLS } from "../api/api";
import { toast } from 'react-toastify';
import Alerta from "../pages/Alertas";
import { FaSyncAlt, FaTrash } from "react-icons/fa";

export default function Proveedores() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [proveedores, setProveedores] = useState([]);
  const [editId, setEditId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [ordenCampo, setOrdenCampo] = useState('');
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [cargando, setCargando] = useState(false);

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Proveedores')
  }

  const obtenerProveedores = async () => {
    setCargando(true);
    const res = await fetch(API_URLS.proveedores, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" })
    });
    const data = await res.json();
    setProveedores(data);
    setCargando(false);
  };

  const proveedoresFiltrados = proveedores.filter(p =>
    p.razon_social.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.cuit.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.contacto || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.direccion || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.telefono || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const proveedoresOrdenados = [...proveedoresFiltrados].sort((a, b) => {
    const valA = a[ordenCampo]?.toString().toLowerCase() || '';
    const valB = b[ordenCampo]?.toString().toLowerCase() || '';
    if (valA < valB) return ordenAsc ? -1 : 1;
    if (valA > valB) return ordenAsc ? 1 : -1;
    return 0;
  });

  const onSubmit = async (datos) => {
    const payload = editId ? { ...datos, id: editId, action: "update" } : { ...datos, action: "insert" };
    const res = await fetch(API_URLS.proveedores, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      toast.success(editId ? "Actualizado correctamente" : "Proveedor agregado");
      reset();
      setEditId(null);
      obtenerProveedores();
    } else {
      toast.error("Error al guardar");
    }
  };

  const editar = (prov) => {
    setEditId(prov.id);
    setValue("razon_social", prov.razon_social);
    setValue("cuit", prov.cuit);
    setValue("contacto", prov.contacto);
    setValue("direccion", prov.direccion);
    setValue("telefono", prov.telefono);
  };

const eliminar = async (id) => {
  if (await Alerta.confirmar({ texto: "¿Eliminar proveedor?" })) {
    const res = await fetch(API_URLS.proveedores, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id })
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Eliminado correctamente");
      obtenerProveedores();
    } else {
      toast.error(data.error || "Error al eliminar");
    }
  }
};


  const exportarPDF = async () => {
    const input = document.getElementById("tabla-proveedores");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const fecha = new Date();
    const titulo = `Listado de Proveedores - ${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}`;
    pdf.setFontSize(14);
    pdf.text(titulo, 10, 10);
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 20, pdfWidth, pdfHeight);
    pdf.save("proveedores.pdf");
  };

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Proveedores");
    sheet.columns = [
      { header: "Razón Social", key: "razon_social" },
      { header: "CUIT", key: "cuit" },
      { header: "Contacto", key: "contacto" },
      { header: "Dirección", key: "direccion" },
      { header: "Teléfono", key: "telefono" },
    ];
    proveedoresFiltrados.forEach((p) => sheet.addRow(p));
    const blob = await workbook.xlsx.writeBuffer();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([blob]));
    a.download = "proveedores.xlsx";
    a.click();
  };

  useEffect(() => {
    obtenerProveedores();
    registrarse()
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Proveedores</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-3 items-center rounded shadow">
        <input {...register("razon_social", { required: true })} placeholder="Razón Social" className="border p-2 w-full" />
        <input {...register("cuit")} placeholder="CUIT" className="border p-2 w-full" />
        <input {...register("contacto")} placeholder="Contacto" className="border p-2 w-full" />
        <input {...register("telefono")} placeholder="Teléfono" className="border p-2 w-full" />
        <textarea {...register("direccion")} placeholder="Dirección" className="border p-2 w-full md:col-span-2" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">{editId ? "Actualizar" : "Agregar"}</button>
      </form>

      <div className="flex flex-col items-center mt-8 border p-8 rounded w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 w-full">
          <input
            type="text"
            placeholder="Buscar proveedor..."
            className="w-full border bg-lime-100 border-blue-500 p-2"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={obtenerProveedores}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaSyncAlt /> Actualizar
            </button>
            <button onClick={exportarPDF} className="bg-yellow-600 text-white hover:bg-yellow-700 px-4 py-2 rounded">PDF</button>
            <button onClick={exportarExcel} className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded">Excel</button>
          </div>
        </div>

        {cargando ? <Loading /> : (
          <div className="overflow-x-auto w-full">
            <table id="tabla-proveedores" className="table-auto w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border p-2">Razón Social</th>
                  <th className="border p-2">CUIT</th>
                  <th className="border p-2">Contacto</th>
                  <th className="border p-2">Dirección</th>
                  <th className="border p-2">Teléfono</th>
                  <th className="border p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proveedoresOrdenados.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 py-4">
                      No hay registros
                    </td>
                  </tr>
                )}
                {proveedoresOrdenados.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="border p-2">{p.razon_social}</td>
                    <td className="border p-2">{p.cuit}</td>
                    <td className="border p-2">{p.contacto}</td>
                    <td className="border p-2">{p.direccion}</td>
                    <td className="border p-2">{p.telefono}</td>
                    <td className="border p-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => editar(p)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(p.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        )}
      </div>
    </div>
  );
}
