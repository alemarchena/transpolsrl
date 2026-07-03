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
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <p className="text-center m-1 p-2 bg-yellow-300">Deuda vencida al 10 de enero de 2026</p>

        {mensaje && (
          <div
            className={`text-sm mb-4 text-center rounded p-2 ${
              tipoMensaje === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {mensaje}
          </div>
        )}

        <input
          type="email"
          className="w-full p-2 mb-3 border border-gray-300 rounded"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={loginEmail} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-3">
          Ingresar con Email
        </button>

        <div className="flex gap-3 mb-3">
          <button
            onClick={registrarEmail}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 text-sm rounded"
          >
            Registrarse
          </button>

          <button
            onClick={recuperarClave}
            className="flex-1 bg-yellow-600 hover:bg-yellow-600 text-white py-1 text-sm rounded"
          >
            Recuperar Contraseña
          </button>
        </div>

        <div className="text-center text-sm text-gray-500 my-2">o</div>

        <button onClick={loginGoogle} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
          Ingresar con Google
        </button>

        <button onClick={cerrarSesion} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded mt-4">
          Cerrar Sesión
        </button>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center mb-3">Acceso Público</p>
          <div className="flex flex-col gap-2">
            <Link
              to="/acceso-vehiculos"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-center text-sm transition-colors"
              target="_blank"
            >
              Documentos de Vehículos de terceros
            </Link>
            <Link
              to="/verbonos"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-center text-sm transition-colors"
              target="_blank"
            >
              Bonos de Sueldo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
