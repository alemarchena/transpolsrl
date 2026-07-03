import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { API_URLS } from "../api/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Usamos email para obtener permisos
          const res = await fetch(API_URLS.usuarios, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "getPermisos",
              email: user.email,
            }),
          });

          const data = await res.json();

          if (Array.isArray(data)) {
            // const rutas = data.map((p) => p.ruta);
            const rutas = data.map((p) => p.ruta).filter(Boolean); // ⬅️ evita "undefined"

            // console.log(rutas)
            setUsuario(user); // Solo si se trae bien
            setPermisos(rutas);
            localStorage.setItem("permisos", JSON.stringify(rutas));
          } else {
            setUsuario(user);
            setPermisos([]);
          }
        } catch (error) {
          setUsuario(user);
          setPermisos([]);
        }
      } else {
        setUsuario(null);
        setPermisos([]);
      }

      setCargando(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, permisos, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}
