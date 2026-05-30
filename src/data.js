// UK long-term international migration, YE December estimates (thousands).
// Source: ONS long-term immigration, emigration and net migration flows.
// Latest annual endpoint: YE December 2025, released 21 May 2026 (provisional).
// Values rounded to the nearest thousand; group sums can differ slightly from
// separately published headline totals because of rounding.

// A fixed, illustrative benchmark of UK-born residents (thousands):
// ONS mid-2021 UK population estimate of 67.0m less the ONS estimate of
// 9.6m non-UK-born residents in YE June 2021. NOT an annual denominator.
export const UK_BORN_BENCHMARK = 57400

// Per-year, per-group flows in thousands.
// net is published net migration (rounded), which can differ from in - out.
export const RAW = [
  {
    year: 2020,
    nonEu: { in: 294, out: 192, net: 101 },
    eu: { in: 316, out: 247, net: 70 },
    brit: { in: 52, out: 130, net: -78 },
  },
  {
    year: 2021,
    nonEu: { in: 610, out: 88, net: 522 },
    eu: { in: 173, out: 159, net: 15 },
    brit: { in: 164, out: 233, net: -69 },
  },
  {
    year: 2022,
    nonEu: { in: 1091, out: 110, net: 981 },
    eu: { in: 141, out: 151, net: -9 },
    brit: { in: 166, out: 247, net: -81 },
  },
  {
    year: 2023,
    nonEu: { in: 1188, out: 182, net: 1005 },
    eu: { in: 103, out: 156, net: -53 },
    brit: { in: 150, out: 255, net: -104 },
  },
  {
    year: 2024,
    nonEu: { in: 780, out: 269, net: 511 },
    eu: { in: 91, out: 155, net: -63 },
    brit: { in: 140, out: 257, net: -117 },
  },
  {
    year: 2025,
    nonEu: { in: 627, out: 278, net: 350 },
    eu: { in: 76, out: 118, net: -42 },
    brit: { in: 110, out: 246, net: -136 },
  },
]

// The three nationality groups, with display metadata.
export const GROUPS = [
  {
    key: 'nonEu',
    label: 'Non-EU+ nationals',
    short: 'Non-EU+',
    color: '#4f46e5',
    soft: 'rgba(79, 70, 229, 0.12)',
  },
  {
    key: 'eu',
    label: 'EU+ nationals',
    short: 'EU+',
    color: '#f59e0b',
    soft: 'rgba(245, 158, 11, 0.12)',
  },
  {
    key: 'brit',
    label: 'British nationals',
    short: 'British',
    color: '#10b981',
    soft: 'rgba(16, 185, 129, 0.12)',
  },
]

const pct = (v) => (v / UK_BORN_BENCHMARK) * 100

// Pre-compute every series the charts need, in one tidy pass.
function buildSeries() {
  const cum = { nonEu: 0, eu: 0, brit: 0 }
  return RAW.map((row) => {
    cum.nonEu += row.nonEu.net
    cum.eu += row.eu.net
    cum.brit += row.brit.net

    const overallNet = row.nonEu.net + row.eu.net + row.brit.net
    const overallIn = row.nonEu.in + row.eu.in + row.brit.in
    const overallOut = row.nonEu.out + row.eu.out + row.brit.out

    return {
      year: row.year,

      // Annual net migration
      nonEu_net: row.nonEu.net,
      eu_net: row.eu.net,
      brit_net: row.brit.net,
      overall_net: overallNet,

      // Cumulative net migration since 2020
      nonEu_cum: cum.nonEu,
      eu_cum: cum.eu,
      brit_cum: cum.brit,
      overall_cum: cum.nonEu + cum.eu + cum.brit,

      // Inflows / outflows (outflows stored negative for diverging charts)
      nonEu_in: row.nonEu.in,
      eu_in: row.eu.in,
      brit_in: row.brit.in,
      nonEu_out: -row.nonEu.out,
      eu_out: -row.eu.out,
      brit_out: -row.brit.out,
      overall_in: overallIn,
      overall_out: -overallOut,

      // Net as a share of the fixed UK-born benchmark (%)
      nonEu_share: pct(row.nonEu.net),
      eu_share: pct(row.eu.net),
      brit_share: pct(row.brit.net),
      overall_share: pct(overallNet),
    }
  })
}

export const SERIES = buildSeries()

// Headline figures used in the animated stat cards.
const last = SERIES[SERIES.length - 1]
const peak = SERIES.reduce((a, b) => (b.overall_net > a.overall_net ? b : a))

export const HEADLINES = {
  latestYear: last.year,
  overallNetLatest: last.overall_net,
  peakYear: peak.year,
  peakNet: peak.overall_net,
  nonEuCumulative: last.nonEu_cum,
  britCumulative: last.brit_cum,
}
