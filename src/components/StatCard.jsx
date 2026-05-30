import useCountUp from './useCountUp.js'

// A headline number that counts up when scrolled into view.
export default function StatCard({
  value,
  suffix = 'M',
  decimals = 2,
  prefix = '',
  label,
  accent,
  sub,
}) {
  const [n, ref] = useCountUp(Math.abs(value))
  const sign = value < 0 ? '−' : prefix
  const display =
    decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString()
  return (
    <div className="stat" ref={ref} style={{ '--accent': accent }}>
      <div className="stat__value">
        {sign}
        {display}
        <span className="stat__suffix">{suffix}</span>
      </div>
      <div className="stat__label">{label}</div>
      {sub && <div className="stat__sub">{sub}</div>}
    </div>
  )
}
