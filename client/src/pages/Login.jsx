"use client"

import { useState } from "react"
import { auth, googleProvider } from "../firebase"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth"
import { useNavigate, Link } from "react-router-dom"
import { API_URLS } from "../api/api"
import { toast } from "react-toastify"

export default function Login() {
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("")
  const navigate = useNavigate()

  const mostrarMensaje = (texto, tipo = "exito") => {
    setMensaje(texto)
    setTipoMensaje(tipo)
    setTimeout(() => setMensaje(""), 3000)
  }

  const loginEmail = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password)
      await verificarUsuarioEnBackend(userCred.user)
      navigate("/inicio")
    } catch (error) {
      mostrarMensaje("Error: " + error.message, "error")
    }
  }

  const loginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      await verificarUsuarioEnBackend(result.user)
      navigate("/inicio")
    } catch (error) {
      mostrarMensaje("Error: " + error.message, "error")
    }
  }

  const registrarEmail = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      await verificarUsuarioEnBackend(userCred.user)
      mostrarMensaje("Registro exitoso", "exito")
      navigate("/inicio")
    } catch (error) {
      mostrarMensaje("Error al registrar: " + error.message, "error")
    }
  }

  const recuperarClave = async () => {
    if (!email) return mostrarMensaje("Ingresa tu email para recuperar la contraseña", "error")
    try {
      await sendPasswordResetEmail(auth, email)
      mostrarMensaje("Correo enviado para restablecer la contraseña", "exito")
    } catch (error) {
      mostrarMensaje("Error al enviar el correo: " + error.message, "error")
    }
  }

  const verificarUsuarioEnBackend = async (user) => {
    try {
      const res = await fetch(API_URLS.usuarios, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verificarOInsertar",
          userid: user.uid,
          email: user.email,
          nombre: user.displayName || "",
        }),
      })
      const text = await res.text()
      if (!text || text.trim() === "") {
        throw new Error("Respuesta vacía del backend")
      }

      const data = JSON.parse(text)
      if (!data || !data.usuario || !data.usuario.email) {
        throw new Error("Respuesta inválida del backend")
      }

      localStorage.setItem("usuario", JSON.stringify(data.usuario))
      return data.usuario
    } catch (error) {
      console.error("Error al verificar usuario en backend:", error)
      mostrarMensaje("Error al comunicarse con backend", "error")
      return null
    }
  }

  const cerrarSesion = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("usuario")
      navigate("/")
      toast.success("Sesión de usuario cerrada.")
    } catch (error) {
      mostrarMensaje("Error al cerrar sesión", "error")
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-sm">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center pb-2">Transpol S.R.L</h1>

        {mensaje && (
          <div
            className={`text-sm mb-4 text-center rounded p-2 ${
              tipoMensaje === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {mensaje}
          </div>
        )}

        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 text-sm font-medium transition ${
              activeTab === "login" ? "border-b-2 border-blue-600 text-blue-600 " : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setActiveTab("public")}
            className={`flex-1 py-2 text-sm font-medium transition ${
              activeTab === "public"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Acceso Externo
          </button>
        </div>

        {activeTab === "login" && (
          <div className="space-y-3">
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={loginEmail} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
              Ingresar con Email
            </button>

            <div className="flex gap-2">
              <button
                onClick={registrarEmail}
                className="flex-1 bg-blue-900 hover:bg-blue-700 text-white py-2 rounded text-sm"
              >
                Registrarse
              </button>
              <button
                onClick={recuperarClave}
                className="flex-1 bg-blue-900 hover:bg-blue-700 text-white py-2 rounded text-sm"
              >
                Recuperar Contraseña
              </button>
            </div>

            <div className="text-center text-sm text-gray-500 my-2">o</div>

            <button
              onClick={loginGoogle}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#fff"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#fff"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fff"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#fff"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Ingresar con Google
            </button>

            <button onClick={cerrarSesion} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded">
              Cerrar Sesión
            </button>
          </div>
        )}

        {activeTab === "public" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-600 text-center mb-3">Acceso Público</p>
            <Link
              to="/acceso-vehiculos"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-center text-sm transition-colors"
              target="_blank"
            >
              Documentos de Vehículos de terceros
            </Link>
            <Link
              to="/verbonos"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-center text-sm transition-colors"
              target="_blank"
            >
              Bonos de Sueldo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
