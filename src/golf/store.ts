export interface Counts {
  attempts: number;
  made: number;
  scope: "local" | "global";
}

async function request(path: string, body?: object): Promise<Counts> {
  const response = await fetch(`/api/golf/${path}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Golf API returned ${response.status}`);
  return response.json() as Promise<Counts>;
}

export function createPuttingStore() {
  return {
    getCounts: () => request("counts"),
    beginShot: (id: string, vx: number, vy: number, objectScale = 1) =>
      request("shots", { id, vx, vy, objectScale }),
    // The server calculates the result from velocity; it never trusts a claimed score.
    finishShot: (id: string, _made: boolean) =>
      request(`shots/${id}/finish`, {}),
  };
}
