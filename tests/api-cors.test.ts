import { expect, it } from "vitest";
import api from "../worker/api";
import type { Env } from "../worker/index";
const env = { ALLOWED_ORIGIN: "https://gabespineli.vercel.app" } as Env;
it("allows the live portfolio preflight but rejects unrelated origins", async () => {
  const url = "https://golf.example/api/golf/shots";
  const accepted = await api.fetch(
    new Request(url, {
      method: "OPTIONS",
      headers: { Origin: env.ALLOWED_ORIGIN! },
    }),
    env,
  );
  expect(accepted.status).toBe(204);
  expect(accepted.headers.get("Access-Control-Allow-Origin")).toBe(
    env.ALLOWED_ORIGIN,
  );
  const denied = await api.fetch(
    new Request(url, {
      method: "OPTIONS",
      headers: { Origin: "https://untrusted.example" },
    }),
    env,
  );
  expect(denied.status).toBe(403);
  expect(denied.headers.get("Access-Control-Allow-Origin")).toBeNull();
});
it("serves only the API and does not upload the portfolio to Cloudflare", async () => {
  const response = await api.fetch(new Request("https://golf.example/"), env);
  expect(response.status).toBe(404);
});
