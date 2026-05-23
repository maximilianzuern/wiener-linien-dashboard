# Wiener Linien Dashboard

A compact dashboard for Vienna public transport departures.

It renders HTML server-side, groups departure data by stop, highlights disruptions, accepts custom stop IDs through the query string, and shows whether metros are air-conditioned.

<p align="center">
    <img height="400" alt="Screenshot of the Dashboard" src="https://github.com/user-attachments/assets/60952e12-05d9-41a4-b0dc-b4bd2096098c" />
</p>

## Stack

- TypeScript and React
- React Router v7 in framework mode with Vite v7 and SSR to load the data from the Wiener Linien server before rendering HTML
- Tailwind CSS v4 for styling
- lucide-react icons
- Oxlint and Oxfmt for fast linting and formatting
- Cloudflare Workers for deploying the app on the edge close to the Wiener Linien API server to minimize latency

## Usage

By default, the app shows demo stops. Pass Wiener Linien stop IDs with `stopID` or `id`:

```txt
http://<url>/?stopID=123&stopID=456&id=789
```

The dashboard accepts up to 10 custom stop IDs.

Metro A/C is not officially exposed as an air-conditioning field in the API. The app infers it from the `vehicle.foldingRamp` value in each departure.

The requests to the Wiener Linien API are made on the server in [`app/services/wienerLinien.server.ts`](app/services/wienerLinien.server.ts).

## Local Development

```bash
npm i
npm run dev
```

Open the app at [http://localhost:5173](http://localhost:5173).
