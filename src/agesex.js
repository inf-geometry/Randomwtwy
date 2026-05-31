// Long-term migration by age band and sex (YE December, thousands).
// Source: ONS Table 7a (British) and Table 7d (Non-EU+) in
// may2026publicationspreadsheet.xlsx. These two groups have clean single-table
// coverage; EU+ is split across visa/settled sub-tables so is omitted here.
// Coverage is recent only: YE December 2022–2025.
import { GROUPS } from './data.js'

export const AGE_BANDS = ['Under 16', '16–24', '25–34', '35–44', '45–54', '55–64', '65+']
export const AGE_YEARS = [2022, 2023, 2024, 2025]

// Per group → year → flow → { male:[7 bands], female:[7 bands] }, in thousands.
export const AGE_SEX = {
  brit: {
    2022: { in: { male: [8, 12, 29, 21, 11, 5, 2], female: [7, 13, 26, 14, 8, 6, 3] }, net: { male: [-16, -17, -5, -1, -3, -1, 0], female: [-14, -18, -2, -2, -3, 0, 0] } },
    2023: { in: { male: [8, 11, 26, 19, 10, 5, 2], female: [7, 11, 23, 13, 8, 5, 3] }, net: { male: [-16, -19, -9, -4, -4, -1, 0], female: [-14, -21, -7, -4, -4, -1, -1] } },
    2024: { in: { male: [8, 10, 23, 17, 10, 5, 2], female: [7, 10, 22, 12, 7, 5, 3] }, net: { male: [-15, -20, -12, -5, -5, -2, 0], female: [-13, -23, -10, -5, -4, -1, -1] } },
    2025: { in: { male: [6, 8, 18, 14, 8, 4, 2], female: [5, 8, 17, 10, 6, 4, 2] }, net: { male: [-15, -21, -16, -8, -6, -2, -1], female: [-13, -24, -14, -6, -5, -2, -2] } },
  },
  nonEu: {
    2022: { in: { male: [93, 137, 183, 91, 28, 10, 6], female: [89, 123, 183, 91, 32, 15, 10] }, net: { male: [89, 118, 163, 83, 25, 9, 6], female: [85, 104, 163, 84, 30, 14, 9] } },
    2023: { in: { male: [104, 138, 211, 107, 34, 8, 4], female: [100, 133, 215, 94, 26, 9, 6] }, net: { male: [96, 110, 175, 94, 29, 6, 3], female: [92, 103, 179, 82, 22, 7, 5] } },
    2024: { in: { male: [68, 128, 132, 56, 20, 6, 3], female: [65, 109, 119, 48, 15, 6, 5] }, net: { male: [55, 94, 74, 35, 13, 4, 2], female: [52, 73, 64, 30, 10, 4, 3] } },
    2025: { in: { male: [38, 123, 119, 39, 12, 4, 2], female: [36, 104, 100, 32, 10, 4, 3] }, net: { male: [25, 92, 55, 18, 4, 2, 1], female: [23, 70, 42, 12, 3, 1, 1] } },
  },
}

// Groups available for the age view, with their display metadata reused.
export const AGE_GROUPS = GROUPS.filter((g) => g.key === 'nonEu' || g.key === 'brit')
