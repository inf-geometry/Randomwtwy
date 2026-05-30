import { useState } from 'react'
import { GROUPS, HEADLINES, UK_BORN_BENCHMARK } from './data.js'
import { GLOSSARY } from './glossary.js'
import Term from './components/Term.jsx'
import MigrationChart from './components/MigrationChart.jsx'
import StatCard from './components/StatCard.jsx'

const METRICS = [
  {
    id: 'annual',
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
    label: 'Cumulative net',
    tag: 'Running total',
    title: 'Cumulative net migration since 2020',
    caption: (
      <>
        A <Term id="cumulative">cumulative</Term> view adds up every year’s net figure from 2020
        onward, so the line shows the combined effect over the whole period rather than any single
        year.
      </>
    ),
  },
  {
    id: 'flows',
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
    id: 'share',
    label: 'Share of UK-born',
    tag: 'For scale',
    title: 'Net migration vs the UK-born benchmark',
    caption: (
      <>
        Each year’s net figure shown as a share of a fixed{' '}
        <Term id="uk-born benchmark">UK-born benchmark</Term> of ~
        {(UK_BORN_BENCHMARK / 1000).toFixed(1)} million — an illustrative yardstick for scale, not a
        real annual denominator.
      </>
    ),
  },
]

export default function App() {
  const [metric, setMetric] = useState('annual')
  const [active, setActive] = useState(GROUPS.map((g) => g.key))

  const current = METRICS.find((m) => m.id === metric)

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
          <span className="hero__eyebrow">UK migration · 2020 – {HEADLINES.latestYear}</span>
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
          value={HEADLINES.peakNet}
          label={`Overall net migration peaked in ${HEADLINES.peakYear}`}
          sub="sum of all three groups"
          accent="#4f46e5"
        />
        <StatCard
          value={HEADLINES.overallNetLatest}
          label={`Overall net migration, ${HEADLINES.latestYear}`}
          sub="down sharply from the peak"
          accent="#0ea5e9"
        />
        <StatCard
          value={HEADLINES.nonEuCumulative}
          label="Non-EU+ net, added up 2020–2025"
          sub="the main driver of the rise"
          accent="#f59e0b"
        />
        <StatCard
          value={HEADLINES.britCumulative}
          label="British net, added up 2020–2025"
          sub="a steady, growing net outflow"
          accent="#10b981"
        />
      </section>

      {/* ---------- Explorer ---------- */}
      <section className="explorer" id="explore">
        <div className="explorer__intro">
          <h2>Explore the data</h2>
          <p>
            Switch between views and toggle the nationality groups on and off. Hover any{' '}
            <span className="term term--demo">underlined term</span> for a plain-English
            explanation, and hover the chart for exact figures.
          </p>
        </div>

        {/* Metric switcher */}
        <div className="segmented" role="tablist" aria-label="Choose a view">
          {METRICS.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={metric === m.id}
              className={`segmented__btn ${metric === m.id ? 'is-active' : ''}`}
              onClick={() => setMetric(m.id)}
            >
              <span className="segmented__tag">{m.tag}</span>
              <span className="segmented__label">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Group chips */}
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
                <span className="chip__dot" />
                {g.label}
              </button>
            )
          })}
        </div>

        {/* Chart card */}
        <div className="card">
          <div className="card__head">
            <div>
              <h3 className="card__title">{current.title}</h3>
              <p className="card__caption">{current.caption}</p>
            </div>
          </div>
          <MigrationChart metric={metric} active={active} />
          <p className="card__axis-note">
            {metric === 'share'
              ? 'Vertical axis: net migration as a share of the fixed UK-born benchmark.'
              : 'Vertical axis: thousands of people (k). All figures are provisional ONS estimates.'}
          </p>
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
              Source: ONS long-term international immigration, emigration and net migration flows.
              Latest endpoint <Term id="ye december">YE December</Term> {HEADLINES.latestYear},
              released 21 May 2026. Figures are <Term id="provisional">provisional</Term> and
              rounded to the nearest thousand.
            </li>
            <li>
              “<Term id="long-term">Long-term</Term>” migration counts moves of 12 months or more.
              Overall values are sums of the rounded group components and can differ slightly from
              separately published headline totals.
            </li>
            <li>
              The <Term id="uk-born benchmark">UK-born benchmark</Term> (~57.4m) is fixed and
              illustrative. The ONS annual population-by-country-of-birth series was discontinued
              after June 2021, so the “share of UK-born” view is a yardstick for scale, not a true
              year-by-year ratio.
            </li>
          </ul>
          <p className="foot__sig">
            Built as an interactive companion to the 2020–2025 migration chart set.
          </p>
        </div>
      </footer>
    </div>
  )
}
