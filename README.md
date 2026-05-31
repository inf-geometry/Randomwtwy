# What's Behind Net Migration?

An interactive React site exploring **UK long-term migration flows by nationality
group, 2012–2025**. One headline net-migration number hides three very different
stories — this app lets you pull them apart.

![Annual net migration view](https://img.shields.io/badge/React-18-61dafb) ![Vite](https://img.shields.io/badge/Vite-5-646cff) ![Recharts](https://img.shields.io/badge/Recharts-2-22b5bf)

## Features

- **Eight interactive views**, grouped in a side-nav (Levels · Flows &
  composition · Change over time):
  - **Annual net** — net migration per year, grouped bars.
  - **Cumulative net** — a running total since 2012 (area + line).
  - **Share of UK-born** — cumulative net against a fixed ~57.4m UK-born benchmark.
  - **In vs out** — diverging stacked bars of inflows (up) and outflows (down).
  - **Composition of arrivals** — 100% stacked share of total immigration by group.
  - **Emigration intensity** — outflow ÷ inflow per group (1.0× = net zero).
  - **Momentum** — year-over-year change in net migration.
  - **Year explorer** — an interactive play/scrub snapshot across the years.
- **Toggleable nationality groups** — turn Non-EU+, EU+ and British on/off with
  colour-coded chips; charts and tooltips update instantly.
- **Hover-to-learn explainers** — dotted-underlined terms (*cumulative*,
  *net migration*, *UK-born benchmark*…) reveal plain-English definitions, plus a
  full glossary section.
- **Animated headline stats**, custom chart tooltips, responsive layout, and
  `prefers-reduced-motion` support.

## Data

All figures are embedded in [`src/data.js`](src/data.js), transcribed from
**Table 1** of the ONS admin-based *Long-term international immigration,
emigration and net migration flows* series (YE December, 2012–2025, rounded to
the nearest thousand). The source workbook is committed as
[`may2026publicationspreadsheet.xlsx`](may2026publicationspreadsheet.xlsx). The
same admin-based method and EU+ definition apply across the whole span, so
2012–2025 is a single consistent series. Recent periods are **provisional**.

> The "UK-born benchmark" (~57.4m) is a fixed, illustrative yardstick for scale,
> not a real year-by-year denominator: the ONS annual population-by-country-of-birth
> series was discontinued after June 2021.
>
> ONS used different methods to estimate **British** nationals before vs after YE
> June 2021, so British figures either side of 2021 aren't perfectly comparable
> (a minor refinement, not a methodology break).

## Sources

- ONS — [Long-term international immigration, emigration and net migration flows, provisional](https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/internationalmigration/datasets/longterminternationalimmigrationemigrationandnetmigrationflowsprovisional) (the May 2026 publication spreadsheet, Table 1)
- ONS — [Estimating UK international migration: 2012 to 2021](https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/internationalmigration/articles/estimatingukinternationalmigration2012to2021/2023-11-23) (admin-based backdating)
- [Migration Observatory — Net migration to the UK](https://migrationobservatory.ox.ac.uk/resources/briefings/long-term-international-migration-flows-to-and-from-the-uk/)
- [House of Commons Library — Migration statistics (SN06077)](https://commonslibrary.parliament.uk/research-briefings/sn06077/)

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
