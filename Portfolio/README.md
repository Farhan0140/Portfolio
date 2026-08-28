# Portfolio

A fully static personal portfolio site. All content — profile, about, skills, projects, education, certifications, social links, and coding profiles — lives in a single static JSON file, so the site has no backend server, database, or API to run.

- **Frontend:** Vite + React 19, Tailwind + a hand-built design system
- **Data:** `src/data/profile-information.json`, bundled at build time

## Project layout

```
src/                          React app
  data/profile-information.json   all portfolio content (profile, skills, projects, education, ...)
  context/PortfolioDataContext.jsx  reads the JSON and exposes it to the component tree
  sections/, components/          public site UI (unchanged)
```

## Local development

Requires Node 18+.

```
npm install
npm run dev     # Vite on :5173
```

## Production build

```
npm run build   # outputs to dist/
npm run preview # serve the build locally to sanity-check it
```

`dist/` is a static bundle — deploy it to any static host (Vercel, Netlify, GitHub Pages, etc.). No environment variables, backend process, or database are required.

## Updating portfolio content

Edit `src/data/profile-information.json` directly and rebuild/redeploy. The shape is:

```json
{
  "profile": { ... },
  "siteContent": { ... },
  "education": [ ... ],
  "skillCategories": [ { "items": [ ... ] } ],
  "projects": {
    "software": [ ... ],
    "iot": [ ... ]
  },
  "certifications": [ ... ],
  "socialLinks": [ ... ],
  "codingProfiles": [ ... ]
}
```

`projects` is split into `software` and `iot` lists so adding a new project to one never touches the other's numbering. Each project only needs a unique `slug` (used as its id everywhere — cards, links, the detail modal) and its position in the array sets its display order; there's no separate `id`/`order` field to keep in sync.

`PortfolioDataContext` (`src/context/PortfolioDataContext.jsx`) reads this file and derives the exact prop shapes each section/modal component expects — no other code needs to change when you edit content.
