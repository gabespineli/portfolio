import { describe, it, expect } from "vitest";
import {
  createBall,
  shoot,
  step,
  impact,
  assistedStroke,
  course,
} from "../src/golf/physics";
import { simulate } from "../worker/index";

describe("putting physics shared by browser and API", () => {
  it("sinks controlled and fast putts and rejects invalid shots", () => {
    expect(simulate(-2.6, 0)?.made).toBe(1);
    expect(simulate(-4.2, 0)?.made).toBe(1);
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

it("drops cup crossings at any speed but preserves off-line misses", () => {
  for (const dt of [1 / 30, 1 / 60, 1 / 144]) {
    for (const [speed, offset, sunk] of [
      [1.1, 0, true],
      [1.1, 0.07, true],
      [3.8, 0, true],
      [1.1, 0.24, false],
    ] as const) {
      const ball = createBall();
      ball.x = 0.95;
      ball.y = offset;
      shoot(ball, -speed);
      for (let i = 0; i < 4000 && step(ball, dt) === "moving"; i++) {
        /* advance */
      }
      expect(ball.sunk).toBe(sunk);
    }
  }
});

it("helps ordinary mouse strokes reach the cup despite small hand wobbles", () => {
  for (const speed of [2.5, 3, 4, 5, 6]) {
    const shot = assistedStroke(-speed, 0.12);
    expect(simulate(shot.vx, shot.vy)?.made).toBe(1);
  }
  expect(simulate(assistedStroke(-0.2).vx, 0)?.made).toBe(0);
});

it("captures deeply overlapping fast entries consistently across frame rates", () => {
  for (const dt of [1 / 30, 1 / 60, 1 / 144]) {
    for (const speed of [1.1, 3.8, 4.2]) {
      const ball = createBall();
      ball.x = course.cup.x + 0.27;
      // 80% of the ball diameter extends inside the cup's near edge.
      ball.y = course.cupRadius - course.ballRadius * 0.6;
      shoot(ball, -speed);
      for (let i = 0; i < 4000 && step(ball, dt) === "moving"; i++) {
        /* advance */
      }
      expect(ball.sunk).toBe(true);
    }
  }
});

it("uses the full visible putter head at desktop and phone scales", () => {
  for (const scale of [40, 150]) {
    const ball = createBall();
    const head = { width: 21 / scale, halfHeight: 33 / scale };
    const face = ball.x + course.ballRadius;
    const y = ball.y + head.halfHeight + course.ballRadius * 0.5;
    expect(
      impact(
        { x: face + 0.12, y, time: 0 },
        { x: face - 0.12, y, time: 80 },
        ball,
        head,
      )?.vx,
    ).toBeLessThan(0);
    expect(
      impact(
        { x: face + 0.12, y: y + 0.2, time: 0 },
        { x: face - 0.12, y: y + 0.2, time: 80 },
        ball,
        head,
      ),
    ).toBeNull();
    expect(
      impact(
        { x: face - 0.01, y: 0, time: 0 },
        { x: face - 0.1, y: 0, time: 80 },
        ball,
        head,
      )?.vx,
    ).toBeLessThan(0);
    expect(
      impact(
        { x: face - 0.12, y: 0, time: 0 },
        { x: face + 0.12, y: 0, time: 80 },
        ball,
        head,
      ),
    ).toBeNull();
  }
});
