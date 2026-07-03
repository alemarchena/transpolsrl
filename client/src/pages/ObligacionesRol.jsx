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

export default function ObligacionesRol() {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const [datos, setDatos] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [ordenCampo, setOrdenCampo] = useState('');
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [loading, setLoading] = useState(false);

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Obligaciones Rol')
  }

  const obtenerDatos = async () => {
    setLoading(true);
    const res = await fetch(API_URLS.obligacionesrol, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    });
    const data = await res.json();
    setDatos(data);
    setLoading(false);
  };

  const obtenerRoles = async () => {
    const res = await fetch(API_URLS.roles, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    });
    const data = await res.json();
    setRoles(data);
  };

  useEffect(() => {
    obtenerDatos();
    obtenerRoles();
    registrarse()
  }, []);

  const onSubmit = async (data) => {
    const res = await fetch(API_URLS.obligacionesrol, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: editId ? "update" : "insert",
        id: editId,
        idRol: Number(data.idRol),
        nombre: data.nombre,
        loTiene: data.loTiene ? 1 : 0,
        vencimiento: data.vencimiento ? 1 : 0,
      }),
    });
    const resultado = await res.text();
    if (resultado === "1") {
      toast.success("Obligación guardada correctamente.");
      reset();
      setEditId(null);
      obtenerDatos();
    } else {
      toast.error("Error al agregar.");
    }
  };

  const eliminar = async (id) => {
    if (!await Alerta.confirmar({ texto: "¿Deseas eliminar esta obligación?" })) return;

    const res = await fetch(API_URLS.obligacionesrol, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    const resultado = await res.text();
    if (resultado === "1") {
      toast.success("Obligación eliminada correctamente.");
      obtenerDatos();
    } else {
      toast.error("No se pudo eliminar. Hay personas con la obligación asignada");
    }
  };

  const editar = (dato) => {
    setEditId(dato.id);
    setValue("idRol", dato.idRol);
    setValue("nombre", dato.nombre);
    setValue("loTiene", dato.loTiene === "1");
    setValue("vencimiento", dato.vencimiento === "1");
  };

  const exportarPDF = () => {
    const tabla = document.getElementById("tabla");
    html2canvas(tabla).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.text("Obligaciones del Rol", 10, 10);
      pdf.addImage(imgData, "PNG", 10, 20, 190, 0);
      pdf.save("obligaciones_rol.pdf");
    });
  };

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ObligacionesRol");
    worksheet.columns = [
      { header: "ID", key: "id" },
      { header: "Rol", key: "rolNombre" },
      { header: "Nombre", key: "nombre" },
      { header: "Lo Tiene", key: "loTiene" },
      { header: "Vencimiento", key: "vencimiento" },
    ];
    datos.forEach((d) => worksheet.addRow(d));
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "obligaciones_rol.xlsx");
  };

  const datosFiltrados = Array.isArray(datos)
    ? datos
        .filter((d) =>
          Object.values(d).some((valor) =>
            String(valor).toLowerCase().includes(busqueda.toLowerCase())
          )
        )
        .sort((a, b) => {
          if (!ordenCampo) return 0;
          const valorA = a[ordenCampo];
          const valorB = b[ordenCampo];
          return ordenAsc ? valorA > valorB ? 1 : -1 : valorA < valorB ? 1 : -1;
        })
    : [];

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Obligaciones del Rol</h2>
      {loading && <Loader />}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-6">
        <div>
          <label className="block font-semibold mb-1">Rol</label>
          <select {...register("idRol", { required: true })} className="w-full border rounded px-3 py-2">
            <option value="">Seleccione</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Nombre</label>
          <input {...register("nombre", { required: true })} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="flex items-center gap-2">
          <Controller
            name="loTiene"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                <span>Obligación activa</span>
              </label>
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <Controller
            name="vencimiento"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                <span>Tiene vencimiento</span>
              </label>
            )}
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-2 border bg-lime-100 border-blue-500 rounded w-full md:w-1/3"
        />
        <div className="flex flex-wrap gap-2">
          <button onClick={obtenerDatos} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
            <FaSyncAlt /> Actualizar
          </button>
          <button onClick={exportarPDF} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">PDF</button>
          <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Excel</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table id="tabla" className="min-w-full bg-white border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border cursor-pointer" onClick={() => ordenar("id")}>ID</th>
              <th className="p-2 border cursor-pointer" onClick={() => ordenar("rolNombre")}>Rol</th>
              <th className="p-2 border cursor-pointer" onClick={() => ordenar("nombre")}>Nombre</th>
              <th className="p-2 border cursor-pointer" onClick={() => ordenar("loTiene")}>Obligación activa</th>
              <th className="p-2 border cursor-pointer" onClick={() => ordenar("vencimiento")}>Vencimiento</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((d) => (
              <tr key={d.id} className="text-center border-t">
                <td className="p-2 border">{d.id}</td>
                <td className="p-2 border">{d.rolNombre}</td>
                <td className="p-2 border">{d.nombre}</td>
                <td className="p-2 border">{d.loTiene == 1 ? "Sí" : "No"}</td>
                <td className="p-2 border">{d.vencimiento == 1 ? "Sí" : "No"}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <button onClick={() => editar(d)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                  <button onClick={() => eliminar(d.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  function ordenar(campo) {
    if (ordenCampo === campo) {
      setOrdenAsc(!ordenAsc);
    } else {
      setOrdenCampo(campo);
      setOrdenAsc(true);
    }
  }
}
