import { useState } from 'react'
import {
  GROUPS,
  HEADLINES,
  UK_BORN_BENCHMARK,
  SERIES,
  FIRST_YEAR,
  LAST_YEAR,
  ANNOTATIONS,
} from './data.js'
import { REASONS, REASON_SERIES, REASON_FIRST_YEAR, REASON_LAST_YEAR } from './reasons.js'

// A couple of data-driven facts used in captions, so nothing is hardcoded.
const latest = SERIES[SERIES.length - 1]
const nonEuShareNow = Math.round(latest.nonEu_cumShare)
const compStart = SERIES[0]
const compPeak = SERIES.reduce((a, b) => (b.nonEu_inShare > a.nonEu_inShare ? b : a))
const r23 = REASON_SERIES.find((r) => r.year === 2023)
const studyWorkPct23 = Math.round(
  ((r23.work_in + r23.study_in) / REASONS.reduce((s, x) => s + r23[`${x.key}_in`], 0)) * 100
)
import { GLOSSARY } from './glossary.js'
import Term from './components/Term.jsx'
import MigrationChart from './components/MigrationChart.jsx'
import SnapshotChart from './components/SnapshotChart.jsx'
import ReasonChart from './components/ReasonChart.jsx'
import AgeProfileChart from './components/AgeProfileChart.jsx'
import StatCard from './components/StatCard.jsx'
import HeadlineStat from './components/HeadlineStat.jsx'
import useResizeKey from './components/useResizeKey.js'

// Views are grouped into these categories, shown in order in the side-nav.
const CATEGORIES = [
  'Levels',
  'Flows & composition',
  'Why people come',
  'Change over time',
  'Demographics',
]

const METRICS = [
  {
    id: 'annual',
    cat: 'Levels',
    label: 'Annual net',
    tag: 'Per year',
    title: 'Annual net migration by group',
    caption: (
      <>
        Each bar is one year’s <Term id="net migration">net migration</Term> — long-term{' '}
        <Term id="inflow">arrivals</Term> minus <Term id="outflow">departures</Term> — for that{' '}
        <Term id="ye december">year ending December</Term>. Bars above zero mean more people
        arrived than left.
      </>
    ),
  },
  {
    id: 'cumulative',
    cat: 'Levels',
    label: 'Cumulative net',
    tag: 'Running total',
    title: `Cumulative net migration since ${FIRST_YEAR}`,
    caption: (
      <>
        A <Term id="cumulative">cumulative</Term> view adds up every year’s net figure from{' '}
        {FIRST_YEAR} onward, so the line shows the combined effect over the whole period rather than
        any single year.
      </>
    ),
  },
  {
    id: 'share',
    cat: 'Levels',
    label: 'Share of UK-born',
    tag: 'For scale',
    title: 'Cumulative net migration vs the UK-born benchmark',
    caption: (
      <>
        The <Term id="cumulative">cumulative</Term> net figure since {FIRST_YEAR} shown as a share
        of a fixed <Term id="uk-born benchmark">UK-born benchmark</Term> of ~
        {(UK_BORN_BENCHMARK / 1000).toFixed(1)} million — an illustrative yardstick for scale, not a
        real annual denominator. By {LAST_YEAR}, Non-EU+ arrivals net to roughly {nonEuShareNow}% of
        that baseline.
      </>
    ),
  },
  {
    id: 'flows',
    cat: 'Flows & composition',
    label: 'In vs out',
    tag: 'Both directions',
    title: 'Inflows and outflows',
    caption: (
      <>
        Bars above the line are <Term id="inflow">inflows</Term> (people arriving); bars below are{' '}
        <Term id="outflow">outflows</Term> (people leaving). The gap between them is that group’s
        net migration.
      </>
    ),
  },
  {
    id: 'composition',
    cat: 'Flows & composition',
    label: 'Composition of arrivals',
    tag: 'Who arrives',
    title: 'Composition of arrivals',
    caption: (
      <>
        The <Term id="composition">composition</Term> of each year’s arrivals — every group’s share
        of total <Term id="inflow">immigration</Term>. Non-EU+ nationals rose from about{' '}
        {Math.round(compStart.nonEu_inShare)}% of arrivals in {compStart.year} to roughly{' '}
        {Math.round(compPeak.nonEu_inShare)}% in {compPeak.year}. (Always shows all three groups.)
      </>
    ),
  },
  {
    id: 'emigration',
    cat: 'Flows & composition',
    label: 'Emigration intensity',
    tag: 'Stay vs leave',
    title: 'Emigration intensity — who leaves vs who arrives',
    caption: (
      <>
        <Term id="emigration intensity">Emigration intensity</Term> is{' '}
        <Term id="outflow">outflows</Term> divided by <Term id="inflow">inflows</Term>. Above the
        dashed “net zero” line, a group is shrinking through migration: British nationals leave more
        than twice as fast as they arrive.
      </>
    ),
  },
  {
    id: 'reasons',
    cat: 'Why people come',
    label: 'By reason (Non-EU+)',
    tag: 'Study · work · asylum',
    title: 'Non-EU+ migration by reason',
    caption: (
      <>
        What actually drives the numbers. <Term id="study">Study</Term> and{' '}
        <Term id="work">work</Term> powered the surge — together about {studyWorkPct23}% of Non-EU+
        arrivals in 2023 — while the 2022 <Term id="humanitarian">humanitarian</Term> spike is the
        Ukraine and BN(O) routes. Non-EU+ only, {REASON_FIRST_YEAR}–{REASON_LAST_YEAR} (British have
        no visa reason).
      </>
    ),
  },
  {
    id: 'momentum',
    cat: 'Change over time',
    label: 'Momentum (YoY)',
    tag: 'Turning points',
    title: 'Year-over-year change in net migration',
    caption: (
      <>
        <Term id="momentum">Momentum</Term> — how much each group’s{' '}
        <Term id="net migration">net migration</Term> changed versus the year before. The surge of
        2021–22 gives way to a sharp reversal in 2024–25.
      </>
    ),
  },
  {
    id: 'snapshot',
    cat: 'Change over time',
    label: 'Year explorer',
    tag: 'Interactive',
    title: 'Year-by-year explorer',
    caption: (
      <>
        Press play or drag the slider to move through the years and watch{' '}
        <Term id="inflow">arrivals</Term> and <Term id="outflow">departures</Term> shift for each
        group. The gap between the two bars is that group’s net migration.
      </>
    ),
  },
  {
    id: 'agesex',
    cat: 'Demographics',
    label: 'Age & sex profile',
    tag: 'Population pyramid',
    title: 'Migration by age and sex',
    caption: (
      <>
        A population pyramid of arrivals (or departures) by age band and sex. Non-EU+ arrivals skew
        heavily to ages 16–34; British departures spread more evenly across ages. British and
        Non-EU+ only — recent years (2022–2025).
      </>
    ),
  },
]

const AXIS_NOTES = {
  share: `Vertical axis: cumulative net migration since ${FIRST_YEAR} as a share of the fixed UK-born benchmark.`,
  composition: 'Vertical axis: share of each year’s total immigration (sums to 100%).',
  emigration: 'Vertical axis: people leaving per person arriving (1.0× = net zero).',
}

export default function App() {
  const [metric, setMetric] = useState('annual')
  const [active, setActive] = useState(GROUPS.map((g) => g.key))
  const [showEvents, setShowEvents] = useState(false)
  const resizeKey = useResizeKey()

  const current = METRICS.find((m) => m.id === metric)
  // Bespoke views (own controls/legends); the rest are nationality time-series.
  const isTimeSeries = !['snapshot', 'reasons', 'agesex'].includes(metric)
  const usesChips = metric !== 'reasons' && metric !== 'agesex'
  // Remount the chart only when the viewport *width* changes, so Recharts
  // re-measures (Area/Line plots otherwise blank after an orientation change).
  // Switching views does NOT remount, keeping transitions smooth.
  const chartKey = `chart-${resizeKey}`

  const toggleGroup = (key) => {
    setActive((prev) => {
      const has = prev.includes(key)
      // Never let the user turn off the last remaining group.
      if (has && prev.length === 1) return prev
      return has ? prev.filter((k) => k !== key) : [...prev, key]
    })
  }

  return (
    <div className="page">
      {/* ---------- Hero ---------- */}
      <header className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="hero__inner">
          <span className="hero__eyebrow">
            UK migration · {FIRST_YEAR} – {HEADLINES.latestYear}
          </span>
          <h1 className="hero__title">
            What’s behind <span className="hero__accent">net migration?</span>
          </h1>
          <p className="hero__lede">
            One headline number hides three very different stories. Explore the UK’s long-term
            migration flows by nationality group — and see who is really driving the change.
          </p>
          <a className="hero__cta" href="#explore">
            Start exploring ↓
          </a>
        </div>
      </header>

      {/* ---------- Headline stats ---------- */}
      <section className="stats">
        <StatCard
          value={HEADLINES.peakNet / 1000}
          label={`Overall net migration peaked in ${HEADLINES.peakYear}`}
          sub="sum of all three groups"
          accent="#7c3aed"
        />
        <StatCard
          value={HEADLINES.overallNetLatest / 1000}
          label={`Overall net migration, ${HEADLINES.latestYear}`}
          sub="down sharply from the peak"
          accent="#d97706"
        />
        <StatCard
          value={HEADLINES.nonEuCumulative / 1000}
          label={`Non-EU+ net, added up ${FIRST_YEAR}–${LAST_YEAR}`}
          sub="the main driver of the rise"
          accent="#dc2626"
        />
        <StatCard
          value={HEADLINES.britCumulative / 1000}
          label={`British net, added up ${FIRST_YEAR}–${LAST_YEAR}`}
          sub="a steady, growing net outflow"
          accent="#2563eb"
        />
      </section>

      {/* ---------- Explorer ---------- */}
      <section className="explorer" id="explore">
        <HeadlineStat />

        <div className="explorer__intro">
          <h2>Explore the data</h2>
          <p>
            Switch between views and toggle the nationality groups on and off. Hover any{' '}
            <span className="term term--demo">underlined term</span> for a plain-English
            explanation, and hover the chart for exact figures.
          </p>
        </div>

        <div className="explorer__grid">
          {/* View side-nav, grouped by category */}
          <nav className="viewnav" aria-label="Choose a view">
            {CATEGORIES.map((cat) => (
              <div className="viewnav__group" key={cat}>
                <div className="viewnav__cat">{cat}</div>
                {METRICS.filter((m) => m.cat === cat).map((m) => (
                  <button
                    key={m.id}
                    aria-current={metric === m.id}
                    className={`viewnav__btn ${metric === m.id ? 'is-active' : ''}`}
                    onClick={() => setMetric(m.id)}
                  >
                    <span className="viewnav__label">{m.label}</span>
                    <span className="viewnav__tag">{m.tag}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="viewmain">
            {/* Group chips — only for the nationality time-series + snapshot */}
            {usesChips && (
              <div className="chips" role="group" aria-label="Toggle nationality groups">
                {GROUPS.map((g) => {
                  const on = active.includes(g.key)
                  return (
                    <button
                      key={g.key}
                      className={`chip ${on ? 'is-on' : ''}`}
                      style={{ '--chip': g.color, '--chip-soft': g.soft }}
                      aria-pressed={on}
                      onClick={() => toggleGroup(g.key)}
                    >
                      <span className={`chip__dot chip__dot--${g.marker}`} />
                      {g.label}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Chart card */}
            <div className="card">
              <div className="card__head">
                <div>
                  <h3 className="card__title">{current.title}</h3>
                  <p className="card__caption">{current.caption}</p>
                </div>
                {isTimeSeries && (
                  <label className="events-toggle">
                    <input
                      type="checkbox"
                      checked={showEvents}
                      onChange={(e) => setShowEvents(e.target.checked)}
                    />
                    Show events
                  </label>
                )}
              </div>

              {metric === 'snapshot' ? (
                <SnapshotChart key={chartKey} active={active} />
              ) : metric === 'reasons' ? (
                <ReasonChart key={chartKey} />
              ) : metric === 'agesex' ? (
                <AgeProfileChart key={chartKey} />
              ) : (
                <MigrationChart key={chartKey} metric={metric} active={active} showEvents={showEvents} />
              )}

              {isTimeSeries && (
                <p className="card__axis-note">
                  {AXIS_NOTES[metric] ||
                    'Vertical axis: millions of people (M). All figures are provisional ONS estimates.'}
                </p>
              )}
              {isTimeSeries && showEvents && (
                <ol className="events-legend">
                  {ANNOTATIONS.map((a, i) => (
                    <li key={a.year}>
                      <span className="events-legend__num">{i + 1}</span>
                      {a.year} · {a.label}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Glossary ---------- */}
      <section className="glossary">
        <h2>Glossary</h2>
        <p className="glossary__lede">
          The terms behind the charts, in plain English. These also pop up wherever they’re used
          above.
        </p>
        <div className="glossary__grid">
          {Object.values(GLOSSARY).map((g) => (
            <div className="glossary__item" key={g.title}>
              <h4>{g.title}</h4>
              <p>{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Methodology / footer ---------- */}
      <footer className="foot">
        <div className="foot__inner">
          <h3>About these figures</h3>
          <ul>
            <li>
              Source: ONS “Long-term international immigration, emigration and net migration flows”
              (admin-based estimates from Home Office Borders &amp; Immigration data, DWP RAPID and
              the ONS International Passenger Survey), {FIRST_YEAR}–{HEADLINES.latestYear} on a
              consistent methodology. Latest endpoint{' '}
              <Term id="ye december">YE December</Term> {HEADLINES.latestYear}, released May 2026;
              recent periods are <Term id="provisional">provisional</Term> and figures are rounded to
              the nearest thousand. Compiled from the ONS May 2026 publication spreadsheet
              (<code>may2026publicationspreadsheet.xlsx</code>, Table 1).
            </li>
            <li>
              “<Term id="long-term">Long-term</Term>” migration counts moves of 12 months or more.{' '}
              <Term id="eu+">EU+</Term> covers EU nationals plus EUSS holders, EU+ visa holders and
              Irish nationals. Overall values are sums of the rounded group components and can differ
              by ~1k from separately published headline totals.
            </li>
            <li>
              ONS used different methods to estimate <Term id="british">British</Term> nationals
              before versus after YE June 2021, so British figures either side of 2021 aren’t
              perfectly comparable — a minor refinement, not a methodology break.
            </li>
            <li>
              The <Term id="uk-born benchmark">UK-born benchmark</Term> (~57.4m) is fixed and
              illustrative. The ONS annual population-by-country-of-birth series was discontinued
              after June 2021, so the “share of UK-born” view is a yardstick for scale, not a true
              year-by-year ratio.
            </li>
          </ul>
          <p className="foot__sig">
            An interactive exploration of the ONS {FIRST_YEAR}–{LAST_YEAR} migration series.
          </p>
        </div>
      </footer>
    </div>
  )
}
