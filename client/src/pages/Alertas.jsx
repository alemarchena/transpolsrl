import { toast } from "react-toastify"
import Swal from "sweetalert2"

const Alerta = {
  exito: (mensaje = "Operación exitosa") => {
    toast.success(mensaje)
  },

  error: (mensaje = "Ocurrió un error") => {
    toast.error(mensaje)
  },

  info: (mensaje = "Procesando") => {
    toast.info(mensaje)
  },

  confirmar: async ({
    titulo = "¿Estás seguro?",
    texto = "Esta acción no se puede deshacer.",
    confirmarTexto = "Sí, confirmar",
    cancelarTexto = "Cancelar",
  } = {}) => {
    const resultado = await Swal.fire({
      title: titulo,
      text: texto,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: confirmarTexto,
      cancelButtonText: cancelarTexto,
    })

    return resultado.isConfirmed
  },
}

export default Alerta
