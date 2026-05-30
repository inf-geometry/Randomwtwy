# What's Behind Net Migration?

An interactive React site exploring **UK long-term migration flows by nationality
group, 2020–2025**. One headline net-migration number hides three very different
stories — this app lets you pull them apart.

![Annual net migration view](https://img.shields.io/badge/React-18-61dafb) ![Vite](https://img.shields.io/badge/Vite-5-646cff) ![Recharts](https://img.shields.io/badge/Recharts-2-22b5bf)

## Features

- **Four interactive views**, switchable from a segmented control:
  - **Annual net** — net migration per year, grouped bars.
  - **Cumulative net** — a running total since 2020 (area + line).
  - **In vs out** — diverging stacked bars of inflows (up) and outflows (down).
  - **Share of UK-born** — net migration against a fixed ~57.4m UK-born benchmark.
- **Toggleable nationality groups** — turn Non-EU+, EU+ and British on/off with
  colour-coded chips; charts and tooltips update instantly.
- **Hover-to-learn explainers** — dotted-underlined terms (*cumulative*,
  *net migration*, *UK-born benchmark*…) reveal plain-English definitions, plus a
  full glossary section.
- **Animated headline stats**, custom chart tooltips, responsive layout, and
  `prefers-reduced-motion` support.

## Data

All figures are embedded in [`src/data.js`](src/data.js) and come from the ONS
long-term international immigration, emigration and net migration series
(YE December estimates, rounded to the nearest thousand). The latest endpoint is
YE December 2025, released 21 May 2026 — figures are **provisional**. See the
in-app methodology notes and [the original chart set](migration_charts_complete_2020_2025.zip)
for the source charts and CSVs.

> The "UK-born benchmark" (~57.4m) is a fixed, illustrative yardstick for scale,
> not a real year-by-year denominator: the ONS annual population-by-country-of-birth
> series was discontinued after June 2021.

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:5173)
npm run build   # production build into dist/
npm run preview # preview the production build
```

## Project structure

```
src/
  data.js                 ONS series + pre-computed chart series
  glossary.js             plain-English term definitions
  App.jsx                 page layout, view + group state
  index.css               styling (modern light theme, dark hero)
  components/
    MigrationChart.jsx     Recharts renderer for all four views
    MigrationTooltip.jsx   custom chart tooltip
    Term.jsx               hover/focus glossary popover
    StatCard.jsx           animated headline stat
    useCountUp.js          count-up-on-scroll hook
```

## Tech

React 18 · Vite 5 · Recharts 2. No backend — fully static, deployable anywhere.
