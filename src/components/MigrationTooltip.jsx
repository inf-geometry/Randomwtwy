import { GROUPS } from '../data.js'

const groupByKey = Object.fromEntries(GROUPS.map((g) => [g.key, g]))

// Maps a dataKey like "nonEu_cum" back to its group + a readable suffix.
function describe(dataKey) {
  const [groupKey, kind] = dataKey.split('_')
  const group = groupByKey[groupKey] || { short: 'Overall', color: '#64748b' }
  const kindLabel = {
    net: 'net',
    cum: 'cumulative',
    in: 'inflow',
    out: 'outflow',
    share: 'share',
    cumShare: 'cumulative share',
    inShare: 'share of arrivals',
    emRatio: 'leave ÷ arrive',
    yoy: 'change vs prior yr',
  }[kind]
  return { group, kindLabel }
}

export default function MigrationTooltip({ active, payload, label, metric }) {
  if (!active || !payload || !payload.length) return null

  const fmt = (v) => {
    if (v == null) return '—'
    if (metric === 'composition') return `${v.toFixed(1)}%`
    if (metric === 'share') return `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}%`
    if (metric === 'emigration') return `${v.toFixed(2)}×`
    return `${v >= 0 ? '+' : '−'}${(Math.abs(v) / 1000).toFixed(2)}M`
  }

  return (
    <div className="chart-tip">
      <div className="chart-tip__head">Year ending Dec {label}</div>
      <ul className="chart-tip__list">
        {payload.map((p) => {
          const { group, kindLabel } = describe(p.dataKey)
          return (
            <li key={p.dataKey}>
              <span className="chart-tip__dot" style={{ background: group.color }} />
              <span className="chart-tip__name">
                {group.short} <em>{kindLabel}</em>
              </span>
              <span className="chart-tip__val">{fmt(p.value)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
