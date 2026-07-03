import { useEffect, useState } from "react"

export function useDebounce(valor, delay = 500) {
  const [valorDebounce, setValorDebounce] = useState(valor)

  useEffect(() => {
    const handler = setTimeout(() => {
      setValorDebounce(valor)
    }, delay)

    return () => clearTimeout(handler)
  }, [valor, delay])

  return valorDebounce
}