# Wiener Linien Dashboard

A compact dashboard for Vienna public transport departures.

It renders HTML server-side, groups departure data by stop, highlights disruptions, accepts custom stop IDs through the query string, and shows whether vehicles are air-conditioned.

<p align="center">
    <img height="400" alt="Screenshot of the Dashboard" src="https://github.com/user-attachments/assets/64984569-f2d3-4777-b67a-d6f8924ee89c" />
</p>

## Stack

- TypeScript and React
- React Router v8 in Framework Mode with Vite v8 and SSR to load data from the Wiener Linien server before rendering HTML
- Tailwind CSS v4 for styling
- lucide-react icons
- Oxlint and Oxfmt for fast linting and formatting
- Cloudflare Workers for deploying the app on the edge close to the Wiener Linien API server to minimize latency

## Usage

By default, the app shows demo stops. Pass Wiener Linien stop IDs with `stopID` or `id`:

```txt
http://<url>/?stopID=123&stopID=456&id=789
```

The dashboard accepts up to 10 stop IDs.

The A/C indicator uses the API's `vehicle.cooling` value for each departure, including buses, trams, and metros.

The requests to the Wiener Linien API are made on the server in [`app/services/wienerLinien.server.ts`](app/services/wienerLinien.server.ts).

## Local Development

```bash
npm i
npm run dev
```

Open the app at [http://localhost:5173](http://localhost:5173).
