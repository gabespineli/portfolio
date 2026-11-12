import { createBall, shoot, step } from "../src/golf/physics";

export interface Env {
  DB: D1Database;
  ASSETS?: Fetcher;
  ALLOWED_ORIGIN?: string;
}
const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function simulate(vx: number, vy: number, objectScale = 1) {
  const ball = createBall();
  if (!shoot(ball, vx, vy)) return null;
  let frames = 0;
  while (frames++ < 1000 && step(ball, 1 / 60, objectScale) === "moving") {
    /* deterministic server simulation */
  }
  return { made: ball.sunk ? 1 : 0, duration: Math.ceil((frames * 1000) / 60) };
}

async function counts(env: Env, request: Request) {
  const row = await env.DB.prepare(
    "SELECT attempts, made FROM golf_counts WHERE id = 1",
  ).first();
  return json({
    ...row,
    scope: ["127.0.0.1", "localhost"].includes(new URL(request.url).hostname)
      ? "local"
      : "global",
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/"))
      return env.ASSETS
        ? env.ASSETS.fetch(request)
        : json({ error: "Not found" }, 404);
    try {
      if (request.method === "GET" && url.pathname === "/api/golf/counts")
        return counts(env, request);
      if (request.method !== "POST") return json({ error: "Not found" }, 404);
      const origin = request.headers.get("Origin");
      const localDev =
        ["127.0.0.1", "localhost"].includes(url.hostname) &&
        origin === "http://127.0.0.1:5173";
      if (
        origin &&
        origin !== url.origin &&
        origin !== env.ALLOWED_ORIGIN &&
        !localDev
      )
        return json({ error: "Origin not allowed" }, 403);
      if (!request.headers.get("Content-Type")?.startsWith("application/json"))
        return json({ error: "Expected JSON" }, 415);
      if (Number(request.headers.get("Content-Length")) > 512)
        return json({ error: "Body too large" }, 413);
      const reader = request.body?.getReader();
      let body = "";
      if (reader) {
        const decoder = new TextDecoder();
        let size = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > 512) {
            await reader.cancel();
            return json({ error: "Body too large" }, 413);
          }
          body += decoder.decode(value, { stream: true });
        }
      }
      let input: Record<string, unknown>;
      try {
        input = JSON.parse(body);
        if (!input || Array.isArray(input) || typeof input !== "object")
          throw Error();
      } catch {
        return json({ error: "Invalid JSON" }, 400);
      }
      const now = Date.now();
      if (url.pathname === "/api/golf/shots") {
        const { id, vx, vy, objectScale = 1 } = input;
        if (
          typeof id !== "string" ||
          !uuid.test(id) ||
          typeof vx !== "number" ||
          typeof vy !== "number" ||
          !Number.isFinite(vx) ||
          !Number.isFinite(vy) ||
          Math.hypot(vx, vy) > 50 ||
          typeof objectScale !== "number" ||
          !Number.isFinite(objectScale) ||
          objectScale < 1 ||
          objectScale > 4
        )
          return json({ error: "Invalid shot" }, 400);
        const result = simulate(vx, vy, objectScale);
        if (!result) return json({ error: "Invalid velocity" }, 400);
        const minute = Math.floor(now / 60000);
        // Retain only a short-lived hash, never a raw visitor IP.
        const hash = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(
            `${minute}:${request.headers.get("CF-Connecting-IP") || "local"}`,
          ),
        );
        const key = Array.from(new Uint8Array(hash), (x) =>
          x.toString(16).padStart(2, "0"),
        ).join("");
        const results = await env.DB.batch([
          env.DB.prepare(
            "INSERT INTO golf_rate_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
          ).bind(key, now + 120000),
          env.DB.prepare(
            "INSERT INTO golf_shots (id,made,created_at,ready_at) SELECT ?,?,?,? WHERE (SELECT count FROM golf_rate_limits WHERE key=?)<=30 ON CONFLICT(id) DO NOTHING",
          ).bind(id, result.made, now, now + result.duration, key),
        ]);
        if (Number((results[0].results[0] as { count: number })?.count) > 30)
          return json({ error: "Please wait before taking more shots" }, 429);
        return counts(env, request);
      }
      const match = url.pathname.match(/^\/api\/golf\/shots\/([^/]+)\/finish$/);
      if (match && uuid.test(match[1])) {
        const shot = await env.DB.prepare(
          "SELECT ready_at FROM golf_shots WHERE id=?",
        )
          .bind(match[1])
          .first<{ ready_at: number }>();
        if (!shot) return json({ error: "Unknown shot" }, 404);
        // Allow small browser/server frame differences.
        if (now + 250 < shot.ready_at)
          return json({ error: "Shot still rolling" }, 409);
        await env.DB.prepare(
          "UPDATE golf_shots SET finished=1 WHERE id=? AND finished=0",
        )
          .bind(match[1])
          .run();
        return counts(env, request);
      }
      return json({ error: "Not found" }, 404);
    } catch (error) {
      console.error(
        "Golf API failure",
        error instanceof Error ? error.message : "Unknown error",
      );
      return json({ error: "Shared statistics unavailable" }, 503);
    }
  },
  async scheduled(_event: ScheduledController, env: Env) {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM golf_rate_limits WHERE expires_at < ?").bind(
        Date.now(),
      ),
      env.DB.prepare("DELETE FROM golf_shots WHERE created_at < ?").bind(
        Date.now() - 7 * 86400000,
      ),
    ]);
  },
};
