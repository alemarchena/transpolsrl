import { useEffect, useState, useRef } from "react"
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { useForm } from "react-hook-form";
import { API_URLS } from "../api/api";
import Loader from "../components/Loader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import { toast } from 'react-toastify';
import Alerta from "../pages/Alertas";
import { FaSyncAlt, FaTrash } from "react-icons/fa";
import { formatearFechaDDMMYYYY } from '../utils/formatoFechas';

export default function Rrhh() {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [registros, setRegistros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editId, setEditId] = useState(null);
  const [orden, setOrden] = useState("persona");
  const [personas, setPersonas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorDuplicado, setErrorDuplicado] = useState("");

  const API_URL = API_URLS.personas;
  const ROL_URL = API_URLS.roles;

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Asignación del Rol')
  }

  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0];
    setValue("fecha_inicio", hoy);
    registrarse()
  }, []);

  const obtenerDatos = async () => {
    setLoading(true);
    const res = await fetch(API_URLS.rrhh, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" })
    });
    const data = await res.json();
    setRegistros(data);
    setLoading(false);
  };

  const obtenerPersonas = async () => {
    setLoading(true);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" })
    });
    const data = await res.json();
    setPersonas(data);
    setLoading(false);
  };

  const obtenerRoles = async () => {
    setLoading(true);
    const res = await fetch(ROL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" })
    });
    const data = await res.json();
    setRoles(data);
    setLoading(false);
  };

  useEffect(() => {
    obtenerDatos();
    obtenerPersonas();
    obtenerRoles();
  }, []);

  const onSubmit = async (formData) => {
    setErrorDuplicado("");
    const action = editId ? "update" : "insert";
    const payload = {
      ...formData,
      id: editId,
      idPersona: parseInt(formData.idPersona),
      idRol: parseInt(formData.idRol),
      activo: formData.activo ? 1 : 0,
      action
    };

    if (!editId) {
      const yaExiste = registros.some(
        (r) => r.idPersona === payload.idPersona && parseInt(r.activo) === 1
      );
      if (yaExiste) {
        setErrorDuplicado("Esta persona ya tiene un rol activo asignado.");
        return;
      }
    }

    await fetch(API_URLS.rrhh, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    reset();
    setEditId(null);
    obtenerDatos();
  };

  const editar = (item) => {
    setEditId(item.id);
    setValue("idPersona", item.idPersona);
    setValue("idRol", item.idRol);
    setValue("fecha_inicio", item.fecha_inicio);
    setValue("activo", item.activo === "1" || item.activo === 1);
    setErrorDuplicado("");
  };

  const eliminar = async (id) => {
    if (!await Alerta.confirmar({ texto: "¿Deseas eliminar esta asignación?" })) return;

    const res = await fetch(API_URLS.rrhh, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id })
    });

    const resultado = await res.json();
    if (resultado.success) {
      toast.success("Asignación eliminada correctamente.");
    } else {
      toast.error(resultado.error || "No se pudo eliminar.");
    }
    obtenerDatos();
  };


  const exportarPDF = async () => {
    const input = document.getElementById("lista-rrhh");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.text("Asignación de Roles", 10, 10);
    pdf.addImage(imgData, "PNG", 10, 20, 180, 0);
    pdf.save(`rrhh_${Date.now()}.pdf`);
  };

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("RRHH");
    worksheet.addRow(["Persona", "Rol", "Fecha Inicio", "Activo"]);
    registrosFiltrados.forEach((item) => {
      worksheet.addRow([
        item.persona,
        item.rol,
        item.fecha_inicio,
        item.activo ? "Sí" : "No"
      ]);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rrhh_${Date.now()}.xlsx`;
    a.click();
  };

  const registrosFiltrados = registros
    .filter((item) => {
      const texto = `${item.persona} ${item.rol}`.toLowerCase();
      return texto.includes(busqueda.toLowerCase());
    })
    .sort((a, b) => a[orden].localeCompare(b[orden]));

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Asignación de Rol</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-5 gap-4 mb-4">
        <select {...register("idPersona", { required: true })} className="w-full border p-2">
          <option value="">Seleccionar persona</option>
          {personas.map((p) => (
            <option key={p.id} value={p.id}>{p.apellido}, {p.nombre}</option>
          ))}
        </select>
        <select {...register("idRol", { required: true })} className="w-full border p-2">
          <option value="">Seleccionar rol</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>
        <input type="date" {...register("fecha_inicio", { required: true })} className="border p-2" />
        <label className="col-span-1 flex items-center">
          <input type="checkbox" {...register("activo")} className="mr-2" /> Activo
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {errorDuplicado && <p className="text-red-600 font-semibold mt-2">{errorDuplicado}</p>}

      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <input type="text" className="border p-1 bg-lime-100 border-blue-500 rounded h-10 px-2 w-full md:w-1/3" placeholder="Buscar asignación..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          <button onClick={obtenerDatos} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"><FaSyncAlt /> Actualizar</button>
          <button onClick={exportarPDF} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">PDF</button>
          <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Excel</button>
        </div>
      </div>

      {loading ? <Loader mensaje="Cargando datos..." /> : (
        <div id="lista-rrhh" className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Persona</th>
                <th className="p-2 border">Rol</th>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Estado</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.map((item) => (
                <tr key={item.id} className="text-center border-t">
                  <td className="p-2 border">{item.persona}</td>
                  <td className="p-2 border">{item.rol}</td>
                  <td className="p-2 border">{formatearFechaDDMMYYYY(item.fecha_inicio)}</td>
                  <td className="p-2 border">{item.activo == 1 ? "Activo" : "Inactivo"}</td>
                  <td className="p-2 border">
                    <button onClick={() => editar(item)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-2 rounded text-sm">Editar</button>
                    <button onClick={() => eliminar(item.id)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-2 rounded text-sm ml-2"><FaTrash /></button>
                  </td>
                </tr>
              ))}
              {registrosFiltrados.length === 0 && (
                <tr><td colSpan="5" className="text-center py-4 text-gray-500">No hay registros</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
