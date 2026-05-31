// Non-EU+ long-term migration by reason for migration (YE December, thousands).
// Source: ONS Table 4b in may2026publicationspreadsheet.xlsx. Non-EU+ only —
// British nationals have no visa reason, and EU+ reasons cover only the small
// post-2021 visa-holder subset, so this view is Non-EU+. Coverage 2019–2025.
// "Humanitarian" bundles BNO, resettlement and the Ukraine schemes (the 2022
// spike is almost entirely Ukraine). Bands sum to the Non-EU+ totals.

// Okabe–Ito colour-blind-safe categorical palette.
export const REASONS = [
  { key: 'work', label: 'Work', color: '#e69f00' },
  { key: 'study', label: 'Study', color: '#56b4e9' },
  { key: 'family', label: 'Family', color: '#009e73' },
  { key: 'humanitarian', label: 'Humanitarian', color: '#cc79a7' },
  { key: 'asylum', label: 'Asylum', color: '#d55e00' },
  { key: 'other', label: 'Other', color: '#999999' },
]

export const NONEU_REASONS = [
  { year: 2019, in: { work: 99, study: 120, family: 78, humanitarian: 6, asylum: 42, other: 23 }, net: { work: 47, study: 12, family: 66, humanitarian: 6, asylum: 40, other: 14 } },
  { year: 2020, in: { work: 71, study: 112, family: 56, humanitarian: 1, asylum: 35, other: 20 }, net: { work: 29, study: -11, family: 38, humanitarian: 1, asylum: 34, other: 11 } },
  { year: 2021, in: { work: 145, study: 259, family: 68, humanitarian: 57, asylum: 55, other: 26 }, net: { work: 117, study: 211, family: 59, humanitarian: 57, asylum: 55, other: 24 } },
  { year: 2022, in: { work: 291, study: 430, family: 67, humanitarian: 190, asylum: 85, other: 27 }, net: { work: 266, study: 359, family: 57, humanitarian: 190, asylum: 84, other: 25 } },
  { year: 2023, in: { work: 471, study: 461, family: 89, humanitarian: 75, asylum: 75, other: 16 }, net: { work: 430, study: 348, family: 73, humanitarian: 70, asylum: 73, other: 12 } },
  { year: 2024, in: { work: 272, study: 274, family: 84, humanitarian: 49, asylum: 87, other: 14 }, net: { work: 205, study: 114, family: 66, humanitarian: 36, asylum: 82, other: 7 } },
  { year: 2025, in: { work: 146, study: 294, family: 47, humanitarian: 35, asylum: 88, other: 18 }, net: { work: 83, study: 135, family: 22, humanitarian: 16, asylum: 83, other: 12 } },
]

// Flattened for Recharts: { year, work_in, work_net, study_in, ... }.
export const REASON_SERIES = NONEU_REASONS.map((r) => {
  const o = { year: r.year }
  for (const { key } of REASONS) {
    o[`${key}_in`] = r.in[key]
    o[`${key}_net`] = r.net[key]
  }
  return o
})

export const REASON_FIRST_YEAR = NONEU_REASONS[0].year
export const REASON_LAST_YEAR = NONEU_REASONS[NONEU_REASONS.length - 1].year
