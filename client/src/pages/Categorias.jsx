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

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [editId, setEditId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [ordenCampo, setOrdenCampo] = useState('');
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [cargando, setCargando] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();

  const CAT_URL = API_URLS.categorias;

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Categorias')

  }

  const ordenarPor = (campo) => {
    if (ordenCampo === campo) {
      setOrdenAsc(!ordenAsc);
    } else {
      setOrdenCampo(campo);
      setOrdenAsc(true);
    }
  };

  const categoriasFiltradas = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (cat.descripcion || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const categoriasOrdenadas = [...categoriasFiltradas].sort((a, b) => {
    const valA = a[ordenCampo]?.toString().toLowerCase() || '';
    const valB = b[ordenCampo]?.toString().toLowerCase() || '';
    if (valA < valB) return ordenAsc ? -1 : 1;
    if (valA > valB) return ordenAsc ? 1 : -1;
    return 0;
  });

  const obtenerCategorias = async () => {
    setCargando(true);
    const res = await fetch(CAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" }),
    });
    const data = await res.json();
    setCategorias(data);
    setCargando(false);
  };

  useEffect(() => {
    obtenerCategorias();
    registrarse()
  }, []);

  const onSubmit = async (datos) => {
    const action = editId ? "update" : "insert";
    const payload = { ...datos, action };
    if (editId) payload.id = editId;

    await fetch(CAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    reset();
    setEditId(null);
    obtenerCategorias();
  };

  const eliminarCategoria = async (id) => {
    if (!await Alerta.confirmar({ texto: "¿Deseas eliminar este categoría?" })) return;
    
    const res = await fetch(CAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    
    const resultado = await res.json();
    if (resultado.success) {
      toast.success("Categoría eliminada correctamente.");
    } else {
      toast.error(resultado.error || "No se pudo eliminar.");
    }
    obtenerCategorias();
  };


  const editarCategoria = (cat) => {
    setEditId(cat.id);
    setValue("nombre", cat.nombre);
    setValue("descripcion", cat.descripcion);
  };

  const exportarPDF = () => {
    const elemento = document.getElementById('lista-categorias');
    html2canvas(elemento).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const fecha = new Date();
      const titulo = `Listado de Categorías - ${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}`;
      pdf.setFontSize(14);
      pdf.text(titulo, 10, 10);
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
      pdf.save('categorias.pdf');
    });
  };

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Categorías');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Descripción', key: 'descripcion', width: 50 },
    ];

    categoriasFiltradas.forEach((cat) => {
      worksheet.addRow(cat);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const fecha = new Date();
    link.download = `categorias_${fecha.toLocaleDateString().replace(/\//g, '-')}_${fecha.toLocaleTimeString().replace(/:/g, '-')}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categorías del Artículo</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-3 items-center rounded shadow">
        <div>
          <label className="block font-semibold">Nombre</label>
          <input
            {...register("nombre", { required: true })}
            className="w-full border p-2"
            placeholder="Nombre de la categoría"
          />
        </div>
        <div>
          <label className="block font-semibold">Descripción</label>
          <textarea
            {...register("descripcion")}
            className="w-full border p-2"
            placeholder="Descripción opcional"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <div className="flex flex-col items-center mt-8 border p-8 rounded w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 w-full">
          <input
            type="text"
            placeholder="Buscar categoría..."
            className="w-full border bg-lime-100 border-blue-500 p-2"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={obtenerCategorias}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaSyncAlt /> Actualizar
            </button>
            <button onClick={exportarPDF} className="bg-yellow-600 text-white hover:bg-yellow-700 px-4 py-2 rounded">PDF</button>
            <button onClick={exportarExcel} className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded">Excel</button>
          </div>
        </div>

        {cargando ? <Loading /> : (
          <ul id="lista-categorias" className="divide-y border-t w-full">
            <li className="grid grid-cols-3 font-semibold py-2 text-gray-700 border-b">
              <button onClick={() => ordenarPor("nombre")}>Nombre {ordenCampo === "nombre" && (ordenAsc ? "↑" : "↓")}</button>
              <button onClick={() => ordenarPor("descripcion")}>Descripción {ordenCampo === "descripcion" && (ordenAsc ? "↑" : "↓")}</button>
              <span>Acciones</span>
            </li>
            {categoriasOrdenadas.map((cat) => (
              <li key={cat.id} className="grid grid-cols-3 gap-2 py-2 items-center">
                <div>{cat.nombre}</div>
                <div>{cat.descripcion}</div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => editarCategoria(cat)} className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 text-sm">Editar</button>
                  <button onClick={() => eliminarCategoria(cat.id)} className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm">
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
