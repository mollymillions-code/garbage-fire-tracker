# Garbage Fire Tracker

Live fire hotspot monitoring for New Town, Kolkata using free NASA FIRMS NRT feeds and WAQI air quality data.

## Data Sources (Free)

- NASA FIRMS NRT (`VIIRS_SNPP_NRT`, `VIIRS_NOAA20_NRT`, `VIIRS_NOAA21_NRT`, `MODIS_NRT`)
- WAQI AQI API

## API Keys (Free and Easy)

1. NASA FIRMS map key (free): https://firms.modaps.eosdis.nasa.gov/api/map_key/
2. WAQI token (free tier): https://aqicn.org/data-platform/token/

Both keys are used only on the server through environment variables.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env.local
```

3. Fill in `.env.local`:

```env
FIRMS_MAP_KEY=your_free_nasa_firms_key
WAQI_TOKEN=your_free_waqi_token
```

4. Run dev server:

```bash
npm run dev
```

5. Open:

```text
http://localhost:3000
```

## Fire API

`GET /api/firms`

Query params:
- `days`: `1-30`
- `sources`: optional comma-separated FIRMS source list
- `source`: optional single source override

Behavior:
- Merges multiple FIRMS sources
- Deduplicates overlapping detections
- Adaptive refresh/cache: 2 to 5 minutes depending on selected range

## Scripts

- `npm run dev` - start local dev server
- `npm run lint` - run ESLint
- `npm run build` - production build check
