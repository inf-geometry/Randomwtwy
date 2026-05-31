// UK long-term international migration, YE December estimates (thousands).
// Source: ONS "Long-term international immigration, emigration and net migration
// flows" — admin-based estimates built from Home Office Borders & Immigration
// data, DWP RAPID, and ONS International Passenger Survey data. Consistent
// methodology and EU+ definition across the whole 2012–2025 span.
// Inflow, outflow and net are taken directly from ONS Table 1 (YE December).
// ONS computes net on unrounded numbers, so net can differ from (in − out) by
// ~1k. Latest periods are provisional. See may2026publicationspreadsheet.xlsx.
//
// EU+ = EU members plus EUSS holders, EU+ visa holders and Irish nationals.
// Caveat: ONS used different methods for British nationals before vs after
// YE June 2021, so British figures either side of 2021 aren't perfectly
// comparable (a minor refinement, not a methodology break).

// A fixed, illustrative benchmark of UK-born residents (thousands):
// ONS mid-2021 UK population estimate of 67.0m less the ONS estimate of
// 9.6m non-UK-born residents in YE June 2021. NOT an annual denominator.
export const UK_BORN_BENCHMARK = 57400

// Per-year, per-group flows in thousands.
// net is published net migration (rounded), which can differ from in - out.
export const RAW = [
  {
    year: 2012,
    nonEu: { in: 230, out: 169, net: 61 },
    eu: { in: 334, out: 128, net: 206 },
    brit: { in: 79, out: 151, net: -72 },
  },
  {
    year: 2013,
    nonEu: { in: 234, out: 171, net: 63 },
    eu: { in: 402, out: 141, net: 262 },
    brit: { in: 76, out: 157, net: -81 },
  },
  {
    year: 2014,
    nonEu: { in: 241, out: 154, net: 87 },
    eu: { in: 457, out: 180, net: 277 },
    brit: { in: 81, out: 161, net: -80 },
  },
  {
    year: 2015,
    nonEu: { in: 238, out: 150, net: 88 },
    eu: { in: 481, out: 193, net: 287 },
    brit: { in: 78, out: 151, net: -73 },
  },
  {
    year: 2016,
    nonEu: { in: 237, out: 147, net: 90 },
    eu: { in: 465, out: 213, net: 253 },
    brit: { in: 70, out: 163, net: -94 },
  },
  {
    year: 2017,
    nonEu: { in: 257, out: 144, net: 114 },
    eu: { in: 411, out: 235, net: 176 },
    brit: { in: 84, out: 164, net: -81 },
  },
  {
    year: 2018,
    nonEu: { in: 330, out: 152, net: 178 },
    eu: { in: 421, out: 250, net: 170 },
    brit: { in: 74, out: 147, net: -72 },
  },
  {
    year: 2019,
    nonEu: { in: 368, out: 182, net: 186 },
    eu: { in: 349, out: 269, net: 80 },
    brit: { in: 71, out: 153, net: -82 },
  },
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
// Colours chosen for colour-blind legibility: British blue, EU+ green, Non-EU+ red.
// `dash`/`marker` add a second, non-colour channel (line style + point shape).
export const GROUPS = [
  {
    key: 'nonEu',
    label: 'Non-EU+ nationals',
    short: 'Non-EU+',
    color: '#dc2626',
    soft: 'rgba(220, 38, 38, 0.12)',
    dash: '2 4',
    marker: 'triangle',
  },
  {
    key: 'eu',
    label: 'EU+ nationals',
    short: 'EU+',
    color: '#059669',
    soft: 'rgba(5, 150, 105, 0.12)',
    dash: '7 4',
    marker: 'square',
  },
  {
    key: 'brit',
    label: 'British nationals',
    short: 'British',
    color: '#2563eb',
    soft: 'rgba(37, 99, 235, 0.12)',
    dash: '',
    marker: 'circle',
  },
]

// Notable policy / events to annotate on the time-series charts.
export const ANNOTATIONS = [
  { year: 2016, label: 'Brexit referendum' },
  { year: 2020, label: 'Pandemic; IPS suspended' },
  { year: 2021, label: 'Points-based system' },
  { year: 2022, label: 'Ukraine & BN(O) routes' },
  { year: 2024, label: 'Visa rules tightened' },
]

const pct = (v) => (v / UK_BORN_BENCHMARK) * 100

// Pre-compute every series the charts need, in one tidy pass.
function buildSeries() {
  const cum = { nonEu: 0, eu: 0, brit: 0 }
  let prev = null
  return RAW.map((row) => {
    cum.nonEu += row.nonEu.net
    cum.eu += row.eu.net
    cum.brit += row.brit.net

    const overallNet = row.nonEu.net + row.eu.net + row.brit.net
    const overallIn = row.nonEu.in + row.eu.in + row.brit.in
    const overallOut = row.nonEu.out + row.eu.out + row.brit.out

    // Share of each year's total immigration (inflows) by group (%)
    const inShare = (g) => (g.in / overallIn) * 100
    // How many people leave for each one who arrives (outflow ÷ inflow)
    const emRatio = (g) => g.out / g.in
    // Change in net migration versus the previous year (thousands)
    const yoy = (key) => (prev ? row[key].net - prev[key].net : null)

    const out = {
      year: row.year,

      // Annual net migration
      nonEu_net: row.nonEu.net,
      eu_net: row.eu.net,
      brit_net: row.brit.net,
      overall_net: overallNet,

      // Cumulative net migration since the first year in the series
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

      // Single-year net as a share of the fixed UK-born benchmark (%)
      nonEu_share: pct(row.nonEu.net),
      eu_share: pct(row.eu.net),
      brit_share: pct(row.brit.net),
      overall_share: pct(overallNet),

      // Cumulative net (since first year) as a share of the UK-born benchmark (%)
      nonEu_cumShare: pct(cum.nonEu),
      eu_cumShare: pct(cum.eu),
      brit_cumShare: pct(cum.brit),
      overall_cumShare: pct(cum.nonEu + cum.eu + cum.brit),

      // Composition of arrivals — each group's share of total immigration (%)
      nonEu_inShare: inShare(row.nonEu),
      eu_inShare: inShare(row.eu),
      brit_inShare: inShare(row.brit),

      // Emigration intensity — outflow per inflow (>1 means net-leaving)
      nonEu_emRatio: emRatio(row.nonEu),
      eu_emRatio: emRatio(row.eu),
      brit_emRatio: emRatio(row.brit),

      // Momentum — change in net migration vs the previous year (thousands)
      nonEu_yoy: yoy('nonEu'),
      eu_yoy: yoy('eu'),
      brit_yoy: yoy('brit'),
      overall_yoy: prev
        ? overallNet - (prev.nonEu.net + prev.eu.net + prev.brit.net)
        : null,
    }
    prev = row
    return out
  })
}

export const SERIES = buildSeries()

// First and last years in the series — derived so nothing hardcodes the range.
export const FIRST_YEAR = SERIES[0].year
export const LAST_YEAR = SERIES[SERIES.length - 1].year

// Headline figures used in the animated stat cards.
const last = SERIES[SERIES.length - 1]
const peak = SERIES.reduce((a, b) => (b.overall_net > a.overall_net ? b : a))

export const HEADLINES = {
  firstYear: FIRST_YEAR,
  latestYear: last.year,
  overallNetLatest: last.overall_net,
  peakYear: peak.year,
  peakNet: peak.overall_net,
  // Cumulative totals across the full series (since FIRST_YEAR).
  nonEuCumulative: last.nonEu_cum,
  britCumulative: last.brit_cum,
}
