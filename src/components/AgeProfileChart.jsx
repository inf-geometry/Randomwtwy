import { useEffect, useRef, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
} from 'recharts'
import { AGE_BANDS, AGE_YEARS, AGE_SEX, AGE_GROUPS } from '../agesex.js'

const fmtK = (v) => `${Math.abs(Math.round(v)).toLocaleString()}k`

// Arrivals = immigration; Departures = immigration − net (both positive).
const val = (cell, sex, flow, i) =>
  flow === 'in' ? cell.in[sex][i] : cell.in[sex][i] - cell.net[sex][i]

// Largest band value for a group across all years & both flows — keeps the
// x-axis stable while scrubbing years and toggling arrivals/departures.
function boundFor(groupKey) {
  let m = 0
  for (const y of AGE_YEARS) {
    const cell = AGE_SEX[groupKey][y]
    for (const sex of ['male', 'female']) {
      cell.in[sex].forEach((v, i) => {
        m = Math.max(m, v, v - cell.net[sex][i])
      })
    }
  }
  return Math.ceil(m / 10) * 10
}

function PyramidTip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const band = payload[0]?.payload?.band
  return (
    <div className="chart-tip">
      <div className="chart-tip__head">Age {band}</div>
      <ul className="chart-tip__list">
        {payload.map((p) => (
          <li key={p.dataKey}>
            <span className="chart-tip__dot" style={{ background: p.color || p.fill }} />
            <span className="chart-tip__name">{p.dataKey === 'male' ? 'Male' : 'Female'}</span>
            <span className="chart-tip__val">{fmtK(p.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Population pyramid of migration flows: male left, female right, by age band.
export default function AgeProfileChart() {
  const [groupKey, setGroupKey] = useState('nonEu')
  const [flow, setFlow] = useState('in')
  const [idx, setIdx] = useState(AGE_YEARS.length - 1)
  const [playing, setPlaying] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!playing) return
    timer.current = setInterval(() => setIdx((i) => (i + 1) % AGE_YEARS.length), 900)
    return () => clearInterval(timer.current)
  }, [playing])

  const group = AGE_GROUPS.find((g) => g.key === groupKey)
  const year = AGE_YEARS[idx]
  const cell = AGE_SEX[groupKey][year]
  const bound = boundFor(groupKey)

  // Oldest band at the top (conventional pyramid); male stored negative (left).
  const rows = AGE_BANDS.map((band, i) => ({
    band,
    male: -val(cell, 'male', flow, i),
    female: val(cell, 'female', flow, i),
  })).reverse()

  return (
    <div className="age">
      <div className="age__controls">
        <div className="reason-toggle" role="group" aria-label="Choose a group">
          {AGE_GROUPS.map((g) => (
            <button
              key={g.key}
              className={groupKey === g.key ? 'is-active' : ''}
              onClick={() => {
                setGroupKey(g.key)
                setPlaying(false)
              }}
            >
              {g.short}
            </button>
          ))}
        </div>
        <div className="reason-toggle" role="group" aria-label="Choose a flow">
          <button className={flow === 'in' ? 'is-active' : ''} onClick={() => setFlow('in')}>
            Arrivals
          </button>
          <button className={flow === 'out' ? 'is-active' : ''} onClick={() => setFlow('out')}>
            Departures
          </button>
        </div>
      </div>

      <div className="snap__controls">
        <button
          className="snap__play"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause' : 'Play through the years'}
        >
          {playing ? '❚❚' : '▶'}
        </button>
        <input
          className="snap__slider"
          type="range"
          min={0}
          max={AGE_YEARS.length - 1}
          step={1}
          value={idx}
          aria-label="Choose a year"
          onChange={(e) => {
            setPlaying(false)
            setIdx(Number(e.target.value))
          }}
        />
        <div className="snap__year">{year}</div>
      </div>

      <div className="age__axislabels">
        <span>◀ Male</span>
        <span>Female ▶</span>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart layout="vertical" data={rows} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
          <XAxis
            type="number"
            domain={[-bound, bound]}
            tickFormatter={fmtK}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="band"
            tickLine={false}
            axisLine={false}
            width={56}
            tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
          />
          <ReferenceLine x={0} stroke="rgba(15,23,42,0.35)" strokeWidth={1.5} />
          <Tooltip cursor={{ fill: 'rgba(79,70,229,0.06)' }} content={<PyramidTip />} />
          <Bar dataKey="male" radius={[4, 0, 0, 4]} isAnimationActive={false}>
            {rows.map((d) => (
              <Cell key={d.band} fill={group.color} />
            ))}
          </Bar>
          <Bar dataKey="female" radius={[0, 4, 4, 0]} isAnimationActive={false}>
            {rows.map((d) => (
              <Cell key={d.band} fill={group.color} fillOpacity={0.5} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="snap__legend">
        {group.label}, {flow === 'in' ? 'arrivals' : 'departures'} by age and sex, {year}. Darker =
        male, lighter = female. Recent years only (2022–2025).
      </p>
    </div>
  )
}
