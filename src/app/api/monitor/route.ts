import type { NextRequest } from "next/server";
// import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(request: NextRequest) {

  // In the edge runtime you can use Bindings that are available in your application
  // (for more details see:
  //    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
  //    - https://developers.cloudflare.com/pages/functions/bindings/
  // )
  //
  // KV Example:
  // const myKv = getRequestContext().env.MY_KV_NAMESPACE
  // await myKv.put('suffix', ' from a KV store!')
  // const suffix = await myKv.get('suffix')
  // responseText += suffix

  const url = new URL(request.url);
  const params = url.searchParams.getAll("stopID");
  const query = params.map((id) => `stopId=${id}`).join("&");

  const headers = { "Accept-Language": "de" };
  const response = await fetch(
    "https://www.wienerlinien.at/ogd_realtime/monitor?" + query,
    {method: "GET", headers}
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
