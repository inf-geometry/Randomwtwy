import { useState } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
} from 'recharts'
import { REASONS, REASON_SERIES } from '../reasons.js'

const fmtM = (v) => `${v < 0 ? '−' : ''}${(Math.abs(v) / 1000).toFixed(2)}M`
const byKey = Object.fromEntries(REASONS.map((r) => [r.key, r]))

function ReasonTip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  const total = payload.reduce((s, p) => s + (p.value || 0), 0)
  return (
    <div className="chart-tip">
      <div className="chart-tip__head">Year ending Dec {label}</div>
      <ul className="chart-tip__list">
        {[...payload].reverse().map((p) => {
          const r = byKey[p.dataKey.split('_')[0]]
          return (
            <li key={p.dataKey}>
              <span className="chart-tip__dot" style={{ background: r.color }} />
              <span className="chart-tip__name">{r.label}</span>
              <span className="chart-tip__val">{fmtM(p.value)}</span>
            </li>
          )
        })}
      </ul>
      <div className="chart-tip__total">Total {fmtM(total)}</div>
    </div>
  )
}

// Non-EU+ migration broken down by reason. Arrivals = stacked area (all
// positive, shows the surge); Net = stacked bars (handles negative bands).
export default function ReasonChart() {
  const [flow, setFlow] = useState('in')

  return (
    <div>
      <div className="reason-toggle" role="tablist" aria-label="Choose a flow">
        <button
          role="tab"
          aria-selected={flow === 'in'}
          className={flow === 'in' ? 'is-active' : ''}
          onClick={() => setFlow('in')}
        >
          Arrivals
        </button>
        <button
          role="tab"
          aria-selected={flow === 'net'}
          className={flow === 'net' ? 'is-active' : ''}
          onClick={() => setFlow('net')}
        >
          Net
        </button>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={420}>
          <ComposedChart data={REASON_SERIES} margin={{ top: 16, right: 12, bottom: 8, left: 4 }}>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(15,23,42,0.08)" vertical={false} />
            <XAxis
              dataKey="year"
              tickFormatter={(y) => `’${String(y).slice(2)}`}
              tickLine={false}
              axisLine={{ stroke: 'rgba(15,23,42,0.15)' }}
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
              dy={6}
            />
            <YAxis
              tickFormatter={fmtM}
              tickLine={false}
              axisLine={false}
              width={60}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <ReferenceLine y={0} stroke="rgba(15,23,42,0.35)" strokeWidth={1.5} />
            <Tooltip cursor={{ fill: 'rgba(79,70,229,0.06)' }} content={<ReasonTip />} />
            {flow === 'in'
              ? REASONS.map((r) => (
                  <Area
                    key={r.key}
                    type="monotone"
                    dataKey={`${r.key}_in`}
                    stackId="reason"
                    stroke={r.color}
                    strokeWidth={1}
                    fill={r.color}
                    fillOpacity={0.85}
                    animationDuration={650}
                  />
                ))
              : REASONS.map((r) => (
                  <Bar
                    key={r.key}
                    dataKey={`${r.key}_net`}
                    stackId="reason"
                    fill={r.color}
                    maxBarSize={48}
                    animationDuration={650}
                  />
                ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="reason-legend">
        {REASONS.map((r) => (
          <span className="reason-legend__item" key={r.key}>
            <span className="reason-legend__dot" style={{ background: r.color }} />
            {r.label}
          </span>
        ))}
      </div>
    </div>
  )
}
