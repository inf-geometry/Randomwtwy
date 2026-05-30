import useCountUp from './useCountUp.js'

// A headline number that counts up when scrolled into view.
export default function StatCard({ value, suffix = 'k', prefix = '', label, accent, sub }) {
  const [n, ref] = useCountUp(Math.abs(value))
  const sign = value < 0 ? '−' : prefix
  return (
    <div className="stat" ref={ref} style={{ '--accent': accent }}>
      <div className="stat__value">
        {sign}
        {Math.round(n).toLocaleString()}
        <span className="stat__suffix">{suffix}</span>
      </div>
      <div className="stat__label">{label}</div>
      {sub && <div className="stat__sub">{sub}</div>}
    </div>
  )
}
