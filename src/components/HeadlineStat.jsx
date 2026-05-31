import { useState } from 'react'
import { SERIES, GROUPS, FIRST_YEAR, LAST_YEAR } from '../data.js'

const fmtM = (v) =>
  `${v >= 0 ? '+' : '−'}${(Math.abs(v) / 1000).toFixed(2)}M`

// Group choices for the picker, plus an "all groups" (overall) option.
const GROUP_OPTS = [
  ...GROUPS.map((g) => ({ key: g.key, label: g.label, color: g.color })),
  { key: 'all', label: 'all groups', color: '#475569' },
]

const YEARS = SERIES.map((s) => s.year)

// Total net migration for a group from `since` through the latest year.
function netSince(groupKey, since) {
  const field = groupKey === 'all' ? 'overall_net' : `${groupKey}_net`
  return SERIES.filter((s) => s.year >= since).reduce((sum, s) => sum + s[field], 0)
}

// An interactive headline: "Total net migration for [group] since [year]".
export default function HeadlineStat() {
  const [groupKey, setGroupKey] = useState('nonEu')
  const [since, setSince] = useState(2021)

  const opt = GROUP_OPTS.find((g) => g.key === groupKey)
  const total = netSince(groupKey, since)

  const yrs = LAST_YEAR - since + 1
  const span = since === LAST_YEAR ? `in ${LAST_YEAR}` : `over ${yrs} years (${since}–${LAST_YEAR})`
  const direction = total >= 0 ? 'more arrivals than departures' : 'more departures than arrivals'
  const millions = (Math.abs(total) / 1000).toFixed(2)

  return (
    <div className="headline">
      <div className="headline__glow" aria-hidden="true" />
      <p className="headline__sentence">
        Total net migration of{' '}
        <span className="hl-field" style={{ '--c': opt.color }}>
          <select
            aria-label="Nationality group"
            value={groupKey}
            onChange={(e) => setGroupKey(e.target.value)}
          >
            {GROUP_OPTS.map((g) => (
              <option key={g.key} value={g.key}>
                {g.label}
              </option>
            ))}
          </select>
        </span>{' '}
        since{' '}
        <span className="hl-field" style={{ '--c': opt.color }}>
          <select
            aria-label="Start year"
            value={since}
            onChange={(e) => setSince(Number(e.target.value))}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </span>
      </p>

      <div className="headline__value" style={{ color: opt.color }}>
        {fmtM(total)}
      </div>

      <div className="headline__sub">
        ≈ {millions} million {direction} {span}
        {since === FIRST_YEAR ? ' — the full series' : ''}, on ONS estimates.
      </div>
    </div>
  )
}
