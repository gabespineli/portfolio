import { describe, it, expect } from "vitest";
import { createBall, shoot, step, impact } from "../src/golf/physics";
import { simulate } from "../worker/index";

describe("putting physics shared by browser and API", () => {
  it("accepts a controlled putt and rejects an overpowered one", () => {
    expect(simulate(-2.6, 0)?.made).toBe(1);
    expect(simulate(-4.2, 0)?.made).toBe(0);
    expect(simulate(0, 0)).toBeNull();
    expect(simulate(NaN, 0)).toBeNull();
  });
  it("produces the same result across browser frame rates", () => {
    for (const dt of [1 / 30, 1 / 60, 1 / 144]) {
      const ball = createBall();
      shoot(ball, -2.6);
      for (let i = 0; i < 4000 && step(ball, dt) === "moving"; i++) {
        /* advance */
      }
      expect(ball.sunk).toBe(true);
    }
  });
  it("requires a valid right-to-left mouse impact", () => {
    const ball = createBall();
    expect(
      impact({ x: 5.5, y: 0, time: 0 }, { x: 5.3, y: 0, time: 73 }, ball)?.vx,
    ).toBeLessThan(0);
    expect(
      impact({ x: 5.3, y: 0, time: 0 }, { x: 5.5, y: 0, time: 73 }, ball),
    ).toBeNull();
    expect(
      impact({ x: 5.5, y: 0, time: 0 }, { x: 5.3, y: 0, time: 500 }, ball),
    ).toBeNull();
  });
});
