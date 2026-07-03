import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { useForm } from "react-hook-form";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import { API_URLS } from "../api/api";
import Loader from "../components/Loader";
import { toast } from 'react-toastify';
import Alerta from "../pages/Alertas";
import { FaSyncAlt, FaTrash } from "react-icons/fa";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();
  const API_URL = API_URLS.roles;

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Roles')
  }


  const obtenerRoles = async () => {
    setLoading(true);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    });
    const data = await res.json();
    setRoles(data);
    setLoading(false);
  };

  const onSubmit = async (datos) => {
    const action = editId ? "update" : "insert";
    const payload = { ...datos, action };
    if (editId) payload.id = editId;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    reset();
    setEditId(null);
    obtenerRoles();
  };

  const eliminarRol = async (id) => {
    if (!await Alerta.confirmar({ texto: "¿Deseas eliminar este rol?" })) return;
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    const resultado = await res.json();
    if (resultado.success) {
      toast.success("Rol eliminado correctamente.");
    } else {
      toast.error(resultado.error || "No se pudo eliminar.");
    }
    obtenerRoles();
  };

  const editarRol = (item) => {
    setEditId(item.id);
    setValue("nombre", item.nombre);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rolesFiltrados = roles.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const rolesOrdenados = [...rolesFiltrados].sort((a, b) => {
    const valA = a.nombre.toLowerCase();
    const valB = b.nombre.toLowerCase();
    if (valA < valB) return ordenAsc ? -1 : 1;
    if (valA > valB) return ordenAsc ? 1 : -1;
    return 0;
  });

  const exportarExcel = async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Roles");

    ws.columns = [{ header: "Descripción", key: "nombre", width: 30 }];
    rolesOrdenados.forEach((item) => {
      ws.addRow({ nombre: item.nombre });
    });

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roles.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportarPDF = async () => {
    const tabla = document.getElementById("tabla-exportar");
    const tablaClone = tabla.cloneNode(true);
    tablaClone.style.display = "block";
    tablaClone.style.position = "absolute";
    tablaClone.style.top = "-9999px";
    document.body.appendChild(tablaClone);

    const canvas = await html2canvas(tablaClone);
    document.body.removeChild(tablaClone);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.text("Listado de Roles", 10, 10);
    pdf.addImage(imgData, "PNG", 10, 20, 190, 0);
    pdf.save("roles.pdf");
  };

  const cambiarOrden = () => setOrdenAsc(!ordenAsc);

  useEffect(() => {
    obtenerRoles();
    registrarse()
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Roles</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-4 gap-4 mb-6">
        <input
          {...register("nombre", { required: true })}
          placeholder="Descripción del rol"
          className="border p-2 rounded w-full"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Buscar por descripción..."
          className="p-2 border bg-lime-100 border-blue-500 rounded w-full md:w-1/3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <button onClick={obtenerRoles} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
            <FaSyncAlt /> Actualizar
          </button>
          <button onClick={exportarPDF} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
            PDF
          </button>
          <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table id="tabla-exportar" className="min-w-full bg-white border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border cursor-pointer" onClick={cambiarOrden}>Descripción {ordenAsc ? "↑" : "↓"}</th>
              <th className="p-2 border text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="2"><Loader mensaje="Cargando roles..." /></td></tr>
            ) : (
              rolesOrdenados.map((rol) => (
                <tr key={rol.id}>
                  <td className="border p-2">{rol.nombre}</td>
                  <td className="border p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => editarRol(rol)}
                        className="bg-yellow-500 text-white px-2 py-1 text-sm rounded"
                      >Editar</button>
                      <button
                        onClick={() => eliminarRol(rol.id)}
                        className="bg-red-600 text-white px-2 py-1 text-sm rounded"
                      ><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
