import { useEffect, useRef, useState } from 'react'

// Counts from 0 up to `target` once the element scrolls into view.
// Returns [displayValue, ref]. Respects prefers-reduced-motion.
export default function useCountUp(target, duration = 1100) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const run = () => {
      if (started.current) return
      started.current = true
      if (reduce) {
        setValue(target)
        return
      }
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
        setValue(target * eased)
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.4 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [target, duration])

  return [value, ref]
}
