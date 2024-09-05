# Wiener Linien Dashboard

This is a [Next.js](https://nextjs.org/) project that provides real-time public transport information for Vienna using the Wiener Linien API.

Built with:
- Next.js 14
- TailwindCSS
- Hosted on Cloudflare Pages via [next-on-pages](https://github.com/cloudflare/next-on-pages)

## Getting Started

### Prerequisites
- npm
- [wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update)
- [Cloudflare Workers/Pages](https://developers.cloudflare.com/workers/platform/pricing/) to deploy as Full Stack Application

### Steps

1. Clone the repo
2. Install dependencies via `npm install` in the root directory
3. Run the development server `npm run dev`:


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cloudflare Integration

This project integrates with Cloudflare Pages. Besides the dev script mentioned above, there are a few extra scripts for Cloudflare integration:

- pages:build: Build the application for Pages using the @cloudflare/next-on-pages CLI.
- preview: Locally preview your Pages application using the Wrangler CLI.
- deploy: Deploy your Pages application using the Wrangler CLI.

Note: While the dev script is optimal for local development, you should periodically preview your Pages application to ensure it works properly in the Pages environment. 

For more details, see the @cloudflare/next-on-pages [recommended workflow](https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md).

## API Routes

`/api/monitor`

Fetches real-time public transport information from the Wiener Linien API.

#### Query Parameters

- `stopID`: The ID of the stop to fetch information for.

#### Example

```bash
"http://localhost:3000/?stopID=12345"
```
