import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
} from 'recharts'
import { SERIES, GROUPS } from '../data.js'
import MigrationTooltip from './MigrationTooltip.jsx'

// Values are stored in thousands; show them in millions on screen.
const axisFmtMillions = (v) => `${v < 0 ? '−' : ''}${(Math.abs(v) / 1000).toFixed(2)}M`
const axisFmtPct = (v) => `${v}%`

// Renders the right Recharts shapes for the active metric, filtered to the
// currently-enabled nationality groups.
export default function MigrationChart({ metric, active }) {
  const groups = GROUPS.filter((g) => active.includes(g.key))
  const isPct = metric === 'share'

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={440}>
        <ComposedChart
          data={SERIES}
          margin={{ top: 16, right: 12, bottom: 8, left: 4 }}
          barGap={metric === 'flows' ? 2 : 4}
          barCategoryGap={metric === 'flows' ? '22%' : '28%'}
        >
          <defs>
            {GROUPS.map((g) => (
              <linearGradient key={g.key} id={`fill-${g.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={g.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={g.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 6" stroke="rgba(15,23,42,0.08)" vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={{ stroke: 'rgba(15,23,42,0.15)' }}
            tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }}
            dy={6}
          />
          <YAxis
            tickFormatter={isPct ? axisFmtPct : axisFmtMillions}
            tickLine={false}
            axisLine={false}
            width={60}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <ReferenceLine y={0} stroke="rgba(15,23,42,0.35)" strokeWidth={1.5} />
          <Tooltip
            cursor={{ fill: 'rgba(79,70,229,0.06)' }}
            content={<MigrationTooltip metric={metric} />}
          />

          {/* Annual net migration — grouped bars */}
          {metric === 'annual' &&
            groups.map((g) => (
              <Bar
                key={g.key}
                dataKey={`${g.key}_net`}
                fill={g.color}
                radius={[5, 5, 0, 0]}
                maxBarSize={46}
                animationDuration={650}
              />
            ))}

          {/* Cumulative net migration — soft areas + accent lines */}
          {metric === 'cumulative' &&
            groups.map((g) => (
              <Area
                key={g.key}
                type="monotone"
                dataKey={`${g.key}_cum`}
                stroke={g.color}
                strokeWidth={3}
                fill={`url(#fill-${g.key})`}
                dot={{ r: 3, fill: g.color, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                animationDuration={650}
              />
            ))}

          {/* Inflows (up) and outflows (down) — diverging stacked bars */}
          {metric === 'flows' &&
            groups.map((g) => [
              <Bar
                key={`${g.key}_in`}
                dataKey={`${g.key}_in`}
                stackId="pos"
                fill={g.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={54}
                animationDuration={650}
              />,
              <Bar
                key={`${g.key}_out`}
                dataKey={`${g.key}_out`}
                stackId="neg"
                fill={g.color}
                fillOpacity={0.4}
                radius={[0, 0, 4, 4]}
                maxBarSize={54}
                animationDuration={650}
              />,
            ])}

          {/* Cumulative net as a share of the UK-born benchmark — lines */}
          {metric === 'share' &&
            groups.map((g) => (
              <Line
                key={g.key}
                type="monotone"
                dataKey={`${g.key}_cumShare`}
                stroke={g.color}
                strokeWidth={3}
                dot={{ r: 3, fill: g.color, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                animationDuration={650}
              />
            ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
