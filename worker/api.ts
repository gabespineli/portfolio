import golf, { type Env } from "./index";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const url = new URL(request.url);
    const local = ["127.0.0.1", "localhost"].includes(url.hostname);
    const allowed =
      origin === env.ALLOWED_ORIGIN ||
      origin === url.origin ||
      (local && origin === "http://127.0.0.1:5173");
    if (origin && !allowed)
      return Response.json({ error: "Origin not allowed" }, { status: 403 });
    const response =
      request.method === "OPTIONS"
        ? new Response(null, { status: 204 })
        : await golf.fetch(request, env);
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "no-store");
    headers.set("Vary", "Origin");
    if (origin && allowed) {
      headers.set("Access-Control-Allow-Origin", origin);
      headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      headers.set("Access-Control-Allow-Headers", "Content-Type");
      headers.set("Access-Control-Max-Age", "86400");
    }
    return new Response(response.body, { status: response.status, headers });
  },
  scheduled: golf.scheduled,
};
