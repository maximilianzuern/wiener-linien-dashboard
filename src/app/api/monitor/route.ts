import type { NextRequest } from "next/server";
// import { getRequestContext } from "@cloudflare/next-on-pages";
// const { env, cf, ctx } = getRequestContext();

export const runtime = "edge";

const API_BASE_URL = "https://www.wienerlinien.at/ogd_realtime/monitor";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams.getAll("stopID");
    const query = params.map((id) => `stopId=${id}`).join("&");

    const response = await fetch(`${API_BASE_URL}?${query}`, {
      method: "GET",
      headers: { "Accept-Language": "de" },
    });

    // checking !response.ok in page.tsx

    // if (!response.ok) {
    //   return new Response(JSON.stringify({ error: "Fetch failed" }), {
    //     status: response.status,
    //     statusText: response.statusText,
    //     headers: response.headers,
    //   });
    // }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
