"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

const MENU_ESTRUCTURA = [
  { titulo: "Inicio", ruta: "/", icono: "🏠" },
  {
    titulo: "Stock",
    icono: "📦",
    submenus: [
      { titulo: "Artículos", ruta: "/articulos" },
      { titulo: "Categorías", ruta: "/categorias" },
      { titulo: "Proveedores", ruta: "/proveedores" },
      { titulo: "Compras", ruta: "/compras" },
      { titulo: "Ajustes", ruta: "/ajustes" },
      { titulo: "Importar Artículos", ruta: "/importar-articulos", divider: true },
    ],
  },
  {
    titulo: "Vehículos",
    icono: "🚐",
    submenus: [
      { titulo: "Administrar Vehículos", ruta: "/vehiculos" },
      { titulo: "Obligaciones del vehículo", ruta: "/obligacionesvehiculo" },
      { titulo: "Asignar obligación de vehículo", ruta: "/asignacionobligacionesvehiculo" },
      { titulo: "Completar obligación de vehículo", ruta: "/vencimientosvehiculo", divider: true },
      { titulo: "Centros de Carga", ruta: "/centroscarga" },
      { titulo: "Tipos de Combustible", ruta: "/tiposcombustible" },
      { titulo: "Registro de Uso del Vehículo", ruta: "/usovehiculo", divider: true },
      { titulo: "Servicios Monitoreables", ruta: "/serviciosmonitoreables" },
      { titulo: "Servicios al Vehículo", ruta: "/serviciosvehiculo", divider: true  },
      { titulo: "Personal Externo", ruta: "/personasexternas"},
      { titulo: "Documentación del vehículo", ruta: "/documentosvehiculo"},
    ],
  },
  {
    titulo: "RRHH",
    icono: "🧑‍💼",
    submenus: [
      {
        titulo: "Roles",
        submenus: [
          { titulo: "Administrar Roles", ruta: "/roles" },
          { titulo: "Obligaciones del Rol", ruta: "/obligacionesrol" },
        ],
      },
      { titulo: "Personas", ruta: "/personas" },
      { titulo: "Asignación de Rol", ruta: "/rrhh" },
      { titulo: "Completar obligación de Rol", ruta: "/vencimientosrol" },
    ],
  },
  {
    titulo: "Administración",
    icono: "📊",
    submenus: [
      { titulo: "Empresas", ruta: "/empresas" },
      { titulo: "Carga de Bonos de sueldo", ruta: "/bonosadmin" },
      { titulo: "Dividir Bonos de sueldo", ruta: "/bonosapp", externo: true, urlCompleta: "/bonos" },
      { titulo: "Ver Bonos de Sueldo", ruta: "/verbonosensistema" },
    ],
  },
  {
    titulo: "Monitoreo",
    icono: "🕵️‍♂️",
    submenus: [
      { titulo: "Monitoreo del Obligaciones de Rol", ruta: "/monitoreorol" },
      { titulo: "Monitoreo del Obligaciones de Vehículo", ruta: "/monitoreovehiculo" },
      { titulo: "Monitoreo de Bonos de sueldo", ruta: "/monitorbonos" },
      { titulo: "Monitor de Servicios", ruta: "/monitorservicios" },
      { titulo: "Monitor de Combustible", ruta: "/monitorcombustible" },
      { titulo: "Stock", ruta: "/stock" },
    ],
  },
  {
    titulo: "Seguridad",
    icono: "🛡️",
    submenus: [
      { titulo: "Grupo de Permisos", ruta: "/grupodepermisos" },
      { titulo: "Permisos por módulo", ruta: "/permisospormodulo" },
      { titulo: "Permisos Extra", ruta: "/permisosextrausuario" },
    ],
  },
]

export default function Navbar() {
  const [activo, setActivo] = useState(null)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [activoRolesRRHH, setActivoRolesRRHH] = useState(false)
  const location = useLocation()

  const toggle = (index) => {
    setActivo(activo === index ? null : index)
  }

  const manejarClick = (item) => {
    if (item.externo) {
      window.open(item.urlCompleta, "_blank")
    }
    setActivo(null)
    setMenuAbierto(false)
  }

  return (
    <header className="bg-gray-800 text-white w-full p-4 flex flex-wrap items-center justify-between shadow-md">
      <div className="text-xl font-bold">Transpol SRL</div>
      <button onClick={() => setMenuAbierto(!menuAbierto)} className="md:hidden text-2xl">
        ☰
      </button>
      <nav className={`w-full md:flex md:items-center md:space-x-6 ${menuAbierto ? "block" : "hidden md:block"}`}>
        {MENU_ESTRUCTURA.map((item, index) => (
          <div key={index} className="relative">
            {item.submenus ? (
              <>
                <button onClick={() => toggle(index)} className="flex items-center px-3 py-2 hover:bg-gray-700 rounded">
                  {item.icono} {item.titulo} <span className="ml-1">▾</span>
                </button>
                {activo === index && (
                  <div className="absolute z-10 left-0 mt-1 bg-gray-800 shadow-lg rounded">
                    {item.submenus.map((sub, i) => (
                      <div key={i}>
                        <div className="relative">
                          {sub.submenus ? (
                            <>
                              <button
                                onClick={() => setActivoRolesRRHH(!activoRolesRRHH)}
                                className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-700"
                              >
                                {sub.titulo} <span className="ml-2">▾</span>
                              </button>
                              {activoRolesRRHH && (
                                <div className="pl-4 bg-gray-800 shadow-inner rounded-b">
                                  {sub.submenus.map((subsub, j) => (
                                    <Link
                                      key={j}
                                      to={subsub.ruta}
                                      onClick={() => {
                                        setActivo(null)
                                        setMenuAbierto(false)
                                        setActivoRolesRRHH(false)
                                      }}
                                      className={`block whitespace-nowrap px-4 py-2 text-sm hover:bg-gray-700 ${
                                        location.pathname === subsub.ruta ? "bg-gray-700 font-bold" : ""
                                      }`}
                                    >
                                      {subsub.titulo}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : sub.externo ? (
                            <button
                              onClick={() => manejarClick(sub)}
                              className="block whitespace-nowrap px-4 py-2 text-sm hover:bg-gray-700 w-full text-left"
                            >
                              {sub.titulo}
                            </button>
                          ) : (
                            <Link
                              to={sub.ruta}
                              onClick={() => {
                                setActivo(null)
                                setMenuAbierto(false)
                              }}
                              className={`block whitespace-nowrap px-4 py-2 text-sm hover:bg-gray-700 ${
                                location.pathname === sub.ruta ? "bg-gray-700 font-bold" : ""
                              }`}
                            >
                              {sub.titulo}
                            </Link>
                          )}
                        </div>
                        {sub.divider && <div className="border-b-2 border-yellow-500 my-1 mx-2" />}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.ruta}
                onClick={() => setMenuAbierto(false)}
                className={`px-3 py-2 rounded hover:bg-gray-700 ${
                  location.pathname === item.ruta ? "bg-gray-700 font-bold" : ""
                }`}
              >
                {item.icono} {item.titulo}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </header>
  )
}
