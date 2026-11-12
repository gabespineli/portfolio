import assert from "node:assert/strict";
const base = "http://127.0.0.1:8787";
const get = async () => {
  const r = await fetch(`${base}/api/golf/counts`);
  assert.equal(r.status, 200);
  return r.json();
};
const post = (path, body, headers = {}) =>
  fetch(`${base}/api/golf/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
const before = await get(),
  id = crypto.randomUUID();
assert.equal(
  (
    await post(
      "shots",
      { id, vx: -2.6, vy: 0 },
      { Origin: "https://untrusted.example" },
    )
  ).status,
  403,
);
assert.equal((await post("shots", { id: "bad", vx: 0, vy: 0 })).status, 400);
assert.equal(
  (
    await post(
      "shots",
      { id, vx: -2.6, vy: 0 },
      { Origin: "http://127.0.0.1:5173" },
    )
  ).status,
  200,
);
assert.equal((await post("shots", { id, vx: -2.6, vy: 0 })).status, 200);
assert.equal(
  (await get()).attempts,
  before.attempts + 1,
  "duplicate starts must not count twice",
);
assert.equal(
  (await post(`shots/${id}/finish`, {})).status,
  409,
  "cannot finish a still-rolling shot",
);
await new Promise((resolve) => setTimeout(resolve, 5000));
const finishes = await Promise.all(
  Array.from({ length: 4 }, () => post(`shots/${id}/finish`, { made: false })),
);
assert(finishes.every((r) => r.status === 200));
const after = await get();
assert.equal(
  after.made,
  before.made + 1,
  "server result overrides client claim and concurrent finishes count once",
);
assert.equal(after.scope, "local");
assert.equal(
  (await post(`shots/${crypto.randomUUID()}/finish`, {})).status,
  404,
);
const unknown = await fetch(`${base}/api/missing`);
assert.equal(unknown.status, 404);
const duplicates = await Promise.all(
  Array.from({ length: 32 }, () => post("shots", { id, vx: -2.6, vy: 0 })),
);
assert(
  duplicates.some((r) => r.status === 429),
  "burst must hit the persistent rate limit",
);
assert.equal(
  (await get()).attempts,
  after.attempts,
  "duplicate bursts must not inflate totals",
);
console.log(
  "Passed local D1 integration: shared totals, origin validation, invalid shots, duplicate start, timing, concurrent finish, server scoring, unknown routes, burst rate limiting.",
);
