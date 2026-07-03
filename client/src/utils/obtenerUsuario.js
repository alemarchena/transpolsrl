export const getEmailFromLocalStorage = () => {
  try {
    const usuario = localStorage.getItem("usuario")
    if (!usuario) return null

    const parsed = JSON.parse(usuario)
    return parsed.email || null
  } catch (e) {
    console.error("Usuario malformado en localStorage", e)
    return null
  }
}

export const registrarIngreso = async (apiurl, emailuser,pantalla) => {
    try {
      const res = await fetch(apiurl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "registroingreso",
          email: emailuser,
          pantalla: pantalla || "",
        }),
      })
      const text = await res.text()
      if (!text || text.trim() === "") {
        throw new Error("Error al registrar el ingreso")
      }
     
    } catch (error) {
      console.error("Error al verificar usuario en backend:", error)
      return null
    }
  }
