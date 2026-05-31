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
import { SERIES, GROUPS } from '../data.js'

const fmtM = (v) => `${v < 0 ? '−' : ''}${(Math.abs(v) / 1000).toFixed(2)}M`

// A stable, symmetric x-domain so bars don't jump around while scrubbing.
const MAX = Math.max(
  ...SERIES.flatMap((r) =>
    GROUPS.flatMap((g) => [Math.abs(r[`${g.key}_in`]), Math.abs(r[`${g.key}_out`])])
  )
)
const BOUND = Math.ceil(MAX / 100) * 100

function SnapTip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="chart-tip">
      <div className="chart-tip__head">{label}</div>
      <ul className="chart-tip__list">
        {payload.map((p) => (
          <li key={p.dataKey}>
            <span className="chart-tip__dot" style={{ background: p.color || p.fill }} />
            <span className="chart-tip__name">
              <em>{p.dataKey === 'inflow' ? 'arrived' : 'left'}</em>
            </span>
            <span className="chart-tip__val">{fmtM(Math.abs(p.value))}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// An interactive single-year snapshot with a play/scrub control across years.
export default function SnapshotChart({ active }) {
  const groups = GROUPS.filter((g) => active.includes(g.key))
  const [idx, setIdx] = useState(SERIES.length - 1)
  const [playing, setPlaying] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!playing) return
    timer.current = setInterval(() => {
      setIdx((i) => (i + 1) % SERIES.length)
    }, 850)
    return () => clearInterval(timer.current)
  }, [playing])

  const row = SERIES[idx]
  const data = groups.map((g) => ({
    name: g.short,
    color: g.color,
    inflow: row[`${g.key}_in`],
    outflow: row[`${g.key}_out`], // stored negative
    net: row[`${g.key}_net`],
  }))

  const overall = row.overall_net
  const yoy = row.overall_yoy

  return (
    <div className="snap">
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
          max={SERIES.length - 1}
          step={1}
          value={idx}
          aria-label="Choose a year"
          onChange={(e) => {
            setPlaying(false)
            setIdx(Number(e.target.value))
          }}
        />
        <div className="snap__year">{row.year}</div>
      </div>

      <div className="snap__summary">
        Overall net migration: <strong>{fmtM(overall)}</strong>
        {yoy != null && (
          <span className={`snap__delta ${yoy >= 0 ? 'up' : 'down'}`}>
            {yoy >= 0 ? '▲' : '▼'} {fmtM(Math.abs(yoy))} vs {row.year - 1}
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
          barGap={2}
        >
          <XAxis
            type="number"
            domain={[-BOUND, BOUND]}
            tickFormatter={(v) => fmtM(v)}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            width={72}
            tick={{ fill: '#334155', fontSize: 13, fontWeight: 600 }}
          />
          <ReferenceLine x={0} stroke="rgba(15,23,42,0.35)" strokeWidth={1.5} />
          <Tooltip cursor={{ fill: 'rgba(79,70,229,0.06)' }} content={<SnapTip />} />
          <Bar dataKey="outflow" radius={[4, 0, 0, 4]} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} fillOpacity={0.4} />
            ))}
          </Bar>
          <Bar dataKey="inflow" radius={[0, 4, 4, 0]} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="snap__nets">
        {data.map((d) => (
          <div className="snap__net" key={d.name} style={{ '--c': d.color }}>
            <span className="snap__net-dot" />
            {d.name} net <strong>{`${d.net >= 0 ? '+' : '−'}${fmtM(Math.abs(d.net))}`}</strong>
          </div>
        ))}
      </div>
      <p className="snap__legend">
        Solid bar = people who <strong>arrived</strong>; faded bar = people who{' '}
        <strong>left</strong>. Press play or drag the slider to move through the years.
      </p>
    </div>
  )
}
