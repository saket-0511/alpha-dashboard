# Alpha — Admin Dashboard

A full-featured product management dashboard built with React + TypeScript.

## Features

- **Dashboard Overview** — stats, charts, top products
- **Product Listing** — table + grid view, search (debounced), multi-category filter, sort by name/price/rating, pagination, URL state sync
- **Product Detail** — image carousel, full info, inventory stats
- **Analytics** — category breakdown, price & rating distribution, inventory value charts
- **Settings** — profile, notifications, appearance
- **Responsive** — works on desktop, tablet, mobile
- **Performance** — React.memo, useMemo, useCallback, lazy loading, API caching, debounced search

## Tech Stack

- React 18 + TypeScript
- React Router v6 (URL state sync)
- Recharts (analytics)
- Lucide React (icons)
- API: https://dummyjson.com/products

## Setup

```bash
npm install
npm start       # dev server at localhost:3000
npm run build   # production build
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

## URL State Example

```
/products?category=smartphones,laptops&sort=price&order=asc&page=2&search=apple
```
