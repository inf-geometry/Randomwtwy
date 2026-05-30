import { useEffect, useState } from 'react'

// Returns a counter that bumps (debounced) whenever the window resizes.
// Used as part of a chart's React key so Recharts remounts and re-measures —
// it otherwise leaves Area/Line plots blank after the container changes size
// (e.g. on phone orientation changes or post-load layout shifts).
export default function useResizeKey() {
  const [key, setKey] = useState(0)
  useEffect(() => {
    let timer
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setKey((k) => k + 1), 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(timer)
    }
  }, [])
  return key
}
