import { useEffect, useState,useRef } from "react";
import {getEmailFromLocalStorage,registrarIngreso} from "../utils/obtenerUsuario"
import { API_URLS } from "../api/api";
import Loader from "../components/Loader";
import { toast } from 'react-toastify';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Alerta from "../pages/Alertas";
import { FaSyncAlt, FaTrash } from "react-icons/fa";

export default function AsignacionObligacionesVehiculo() {
  const [vehiculos, setVehiculos] = useState([]);
  const [obligaciones, setObligaciones] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState("");
  const [obligacionSeleccionada, setObligacionSeleccionada] = useState("");
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const yaregistrado = useRef(false)
  const registrarse = ()=> {
  
    if(yaregistrado.current) return
      yaregistrado.current = true

    const emaillocal = getEmailFromLocalStorage()

    if(!emaillocal) return

    registrarIngreso(API_URLS.usuarios,emaillocal,'Asignacion Obligaciones Vehiculo')

  }

  const obtenerVehiculos = async () => {
    setLoading(true);
    const res = await fetch(API_URLS.vehiculos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" })
    });
    const data = await res.json();
    setVehiculos(data);
    setLoading(false);
  };

  const obtenerObligaciones = async () => {
    setLoading(true);
    const res = await fetch(API_URLS.obligacionesvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" })
    });
    const data = await res.json();
    setObligaciones(data);
    setLoading(false);
  };

  const obtenerAsignaciones = async () => {
    setLoading(true);
    const res = await fetch(API_URLS.asignacionobligacionesvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get" })
    });
    const data = await res.json();
    setAsignaciones(data);
    setLoading(false);
  };

  const guardarAsignacion = async () => {
    if (!vehiculoSeleccionado || !obligacionSeleccionada) {
      toast.error("Debe seleccionar un vehículo y una obligación");
      return;
    }

    const existe = asignaciones.some(
      (a) => a.idVehiculo === parseInt(vehiculoSeleccionado) && a.idObligacionVehiculo === parseInt(obligacionSeleccionada)
    );
    if (existe) {
      toast.error("Esta obligación ya está asignada a este vehículo");
      return;
    }

    setLoading(true);
    const res = await fetch(API_URLS.asignacionobligacionesvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "insert",
        idVehiculo: vehiculoSeleccionado,
        idObligacionVehiculo: obligacionSeleccionada
      })
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Asignado correctamente");
      obtenerAsignaciones();
    } else {
      toast.error("La obligación ya está incluída en el vehículo");
    }
    setLoading(false);
  };

  const eliminarAsignacion = async (id) => {
    if (!await Alerta.confirmar({ texto: "¿Deseas eliminar esta asignación?" })) return;

    setLoading(true);
    const res = await fetch(API_URLS.asignacionobligacionesvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id })
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Eliminado correctamente");
      obtenerAsignaciones();
    } else {
      toast.error("Error al eliminar");
    }
    setLoading(false);
  };

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Asignaciones Vehículo");

    worksheet.columns = [
      { header: "Vehículo", key: "vehiculo", width: 30 },
      { header: "Obligación", key: "obligacion", width: 40 }
    ];

    asignaciones.forEach((a) => {
      worksheet.addRow({ vehiculo: `${a.marca} - ${a.patente}`, obligacion: a.obligacion });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `AsignacionesVehiculo_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportarPDF = async () => {
    const input = document.getElementById("tabla-asignaciones");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`AsignacionesVehiculo_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const asignacionesFiltradas = asignaciones.filter((a) =>
    (a.numerointerno + " " + a.patente + " " + a.obligacion + " " + a.marca).toLowerCase().includes(busqueda.toLowerCase())
  );

  const asignarObligacionATodos = async () => {
    if (!obligacionSeleccionada) {
      toast.error("Debe seleccionar una obligación");
      return;
    }

    if (!await Alerta.confirmar({ texto: "¿Está seguro que desea asignar esta obligación a todos los vehículos?" })) return;

    setLoading(true);
    const res = await fetch(API_URLS.asignacionobligacionesvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "asignarATodos",
        idObligacionVehiculo: obligacionSeleccionada,
      }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Obligación asignada a todos los vehículos");
      obtenerAsignaciones();
    } else {
      toast.error("Error al asignar a todos");
    }
    setLoading(false);
  };

  const eliminarObligacionDeTodos = async () => {
    if (!obligacionSeleccionada) {
      toast.error("Debe seleccionar una obligación");
      return;
    }

    if (!await Alerta.confirmar({ texto: "¿Está seguro que desea eliminar esta obligación de todos los vehículos?" })) return;

    setLoading(true);
    const res = await fetch(API_URLS.asignacionobligacionesvehiculo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "eliminarDeTodos",
        idObligacionVehiculo: obligacionSeleccionada,
      }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Obligación eliminada de todos los vehículos");
      obtenerAsignaciones();
    } else {
      toast.error("Error al eliminar de todos");
    }
    setLoading(false);
  };

  useEffect(() => {
    obtenerVehiculos();
    obtenerObligaciones();
    obtenerAsignaciones();
    registrarse()
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Asignación de Obligaciones a Vehículos</h2>
      {loading && <Loader />}

      <div className="mb-4 grid md:grid-cols-4 gap-4">
        <div>
          <label className="block font-semibold mb-1">Vehículo</label>
          <select
            value={vehiculoSeleccionado}
            onChange={(e) => setVehiculoSeleccionado(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccione...</option>
            {vehiculos.map((v) => (
              <option key={v.id} value={v.id}>{v.numerointerno + " - " + v.marca + " - " + v.patente}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Obligación</label>
          <select
            value={obligacionSeleccionada}
            onChange={(e) => setObligacionSeleccionada(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccione...</option>
            {obligaciones.map((o) => (
              <option key={o.id} value={o.id}>{o.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <button onClick={guardarAsignacion} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Asignar
          </button>
          <button onClick={asignarObligacionATodos} className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900">
            Asignar a Todos
          </button>
          <button onClick={eliminarObligacionDeTodos} className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
            Eliminar de Todos
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Buscar por vehículo u obligación"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-2 border bg-lime-100 border-blue-500 rounded w-full md:w-1/3"
        />
        <div className="flex flex-wrap gap-2">
          <button onClick={obtenerAsignaciones} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
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
        <table id="tabla-asignaciones" className="min-w-full bg-white border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nº interno</th>
              <th className="p-2 border">Vehículo</th>
              <th className="p-2 border">Obligación</th>
              <th className="p-2 border text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {asignacionesFiltradas.map((a) => (
              <tr key={a.id}>
                <td className="border p-2">{a.numerointerno}</td>
                <td className="border p-2">{a.patente + " - " + a.marca}</td>
                <td className="border p-2">{a.obligacion}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => eliminarAsignacion(a.id)}
                    className="bg-red-600 text-white px-2 py-2 rounded hover:bg-red-700"
                  >
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
}