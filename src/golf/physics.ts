export type Ball = ReturnType<typeof createBall>;
export interface Point {
  x: number;
  y: number;
  time: number;
}
/* Metre/second rolling model on a flat putting green. No arcade wall bounces. */
const course = {
  length: 6,
  start: { x: 5.32, y: 0 },
  cup: { x: 0.68, y: 0 },
  ballRadius: 0.075,
  cupRadius: 0.145,
  greenHalfWidth: 0.27,
};
const rollingDeceleration = 0.62,
  roughDeceleration = 2.8;
const createBall = () => ({
  ...course.start,
  vx: 0,
  vy: 0,
  rotation: 0,
  sunk: false,
  missed: false,
});
function shoot(ball: Ball, vx: number, vy = 0) {
  if (
    ball.sunk ||
    ball.missed ||
    Math.hypot(ball.vx, ball.vy) > 0 ||
    !Number.isFinite(vx) ||
    !Number.isFinite(vy)
  )
    return false;
  const speed = Math.hypot(vx, vy);
  if (speed < 0.12) return false;
  const scale = Math.min(1, 4.2 / speed);
  ball.vx = vx * scale;
  ball.vy = vy * scale;
  return true;
}
function step(ball: Ball, dt: number) {
  if (ball.sunk) return "sunk";
  if (ball.missed) return "missed";
  if (!Number.isFinite(dt) || dt <= 0)
    return Math.hypot(ball.vx, ball.vy) > 0 ? "moving" : "idle";
  const time = Math.min(dt, 0.05),
    steps = Math.ceil(time * 480),
    h = time / steps;
  for (let i = 0; i < steps; i++) {
    const speed = Math.hypot(ball.vx, ball.vy);
    if (!speed) return "idle";
    const decel =
      Math.abs(ball.y) > course.greenHalfWidth
        ? roughDeceleration
        : rollingDeceleration;
    const next = Math.max(0, speed - decel * h),
      distance = (speed + next) * 0.5 * h;
    const fromX = ball.x,
      fromY = ball.y;
    ball.x += (ball.vx / speed) * distance;
    ball.y += (ball.vy / speed) * distance;
    ball.rotation += distance / course.ballRadius;
    const factor = next / speed;
    ball.vx *= factor;
    ball.vy *= factor;
    // Capture on overlap alone, at any speed. Check the entire travelled
    // segment so a fast ball cannot skip over the cup between updates.
    // This generous threshold also includes every 80%-overlapping entry.
    const captureRadius = course.cupRadius + course.ballRadius * 0.25;
    const dx = ball.x - fromX,
      dy = ball.y - fromY;
    const lengthSquared = dx * dx + dy * dy;
    const t =
      lengthSquared > 0
        ? Math.max(
            0,
            Math.min(
              1,
              ((course.cup.x - fromX) * dx + (course.cup.y - fromY) * dy) /
                lengthSquared,
            ),
          )
        : 0;
    const offset = Math.hypot(
      fromX + t * dx - course.cup.x,
      fromY + t * dy - course.cup.y,
    );
    if (offset <= captureRadius) {
      ball.x = course.cup.x;
      ball.y = course.cup.y;
      ball.vx = ball.vy = 0;
      ball.sunk = true;
      return "sunk";
    }
    if (
      ball.x < -0.1 ||
      ball.x > course.length + 0.1 ||
      Math.abs(ball.y) > 0.6
    ) {
      ball.vx = ball.vy = 0;
      ball.missed = true;
      return "missed";
    }
    if (next < 0.005) {
      ball.vx = ball.vy = 0;
      return "idle";
    }
  }
  return "moving";
}
function impact(previous: Point | null, current: Point, ball: Ball) {
  if (!previous || current.time <= previous.time) return null;
  const dt = (current.time - previous.time) / 1000,
    dx = current.x - previous.x,
    dy = current.y - previous.y,
    face = ball.x + course.ballRadius;
  if (dt > 0.15 || dx >= 0 || previous.x < face || current.x > face)
    return null;
  const fraction = (face - previous.x) / dx,
    y = previous.y + dy * fraction;
  if (Math.abs(y - ball.y) > course.ballRadius + 0.055) return null;
  const vx = Math.max(-4.2, (dx / dt) * 0.88),
    vy = Math.max(-0.65, Math.min(0.65, (dy / dt) * 0.22));
  return vx <= -0.12 ? { vx, vy } : null;
}
export { course, rollingDeceleration, createBall, shoot, step, impact };

// Compress hand-speed variation and soften small vertical mouse wobbles.
// Tiny taps still fall short; every stroke crossing the cup is captured.
export function assistedStroke(vx: number, vy = 0) {
  const raw = Math.hypot(vx, vy);
  if (raw < 0.12 || !Number.isFinite(raw)) return { vx, vy };
  const speed = Math.min(3.6, 2.65 * (raw / 2.8) ** 0.35);
  const angle = Math.atan2(vy, Math.abs(vx)) * 0.16;
  return {
    vx: Math.sign(vx) * speed * Math.cos(angle),
    vy: speed * Math.sin(angle),
  };
}

// Thumb drags use CSS-pixel travel, not elapsed time: a slow drag is a putt
// too. Positive travel retains the existing pull-back-and-release gesture.
export function thumbStroke(dx: number, dy: number) {
  if (
    !Number.isFinite(dx) ||
    !Number.isFinite(dy) ||
    Math.abs(dx) < 10 ||
    Math.abs(dy) > Math.abs(dx) * 1.5
  )
    return null;
  return {
    vx: -Math.min(4.2, 1.9 + Math.abs(dx) / 35),
    vy: Math.max(-0.25, Math.min(0.25, dy / 300)),
  };
}
