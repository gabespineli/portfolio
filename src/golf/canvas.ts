import * as P from "./physics";
import { createPuttingStore, type Counts } from "./store";
export function mountGolf(root: HTMLElement) {
  const events = new AbortController();
  let disposed = false;
  function listen<K extends keyof HTMLElementEventMap>(
    target: HTMLElement | Document,
    name: K,
    handler: (event: HTMLElementEventMap[K]) => void,
  ) {
    target.addEventListener(name, handler as EventListener, {
      signal: events.signal,
    });
  }
  const canvas = root.querySelector<HTMLCanvasElement>("#golf-course")!;
  const ctx = canvas.getContext("2d")!;
  if (!ctx) return () => {};
  const c = P.course,
    $ = (id: string) => root.querySelector<HTMLElement>("#" + id)!;
  const api = createPuttingStore(),
    format = new Intl.NumberFormat("en-US");
  let ball = P.createBall(),
    phase: string = "ready",
    previous: P.Point | null = null,
    drag: (P.Point & { id: number }) | null = null,
    raf = 0,
    last = 0,
    resetTimer: ReturnType<typeof setTimeout> | undefined,
    shotId = "",
    shotStarted: Promise<void>;
  let club: P.Point | null = null;
  let swing = "Address",
    followStart = 0,
    followX = 0,
    followY = 0;
  let drop: { start: number; x: number; y: number; rotation: number } | null =
    null;
  const dropDuration = 150;
  let audio: AudioContext | null = null;
  function unlockAudio() {
    try {
      audio ??= new AudioContext();
      void audio.resume().catch(() => {});
    } catch {
      /* Audio is optional. */
    }
  }
  function sound(cup = false) {
    unlockAudio();
    if (!audio) return;
    if (audio.state !== "running") {
      void audio
        .resume()
        .then(() => {
          if (!disposed && audio?.state === "running") sound(cup);
        })
        .catch(() => {});
      return;
    }
    const now = audio.currentTime;
    // Short filtered impacts model a face click and hollow plastic-cup rattle.
    // Noise transients avoid the pitched, electronic slide of an oscillator.
    for (let i = 0; i < (cup ? 4 : 1); i++) {
      const duration = cup ? 0.065 : 0.035;
      const buffer = audio.createBuffer(
        1,
        Math.ceil(audio.sampleRate * duration),
        audio.sampleRate,
      );
      const samples = buffer.getChannelData(0);
      for (let n = 0; n < samples.length; n++) {
        samples[n] =
          (Math.random() * 2 - 1) *
          Math.exp(-n / (audio.sampleRate * (cup ? 0.012 : 0.005)));
      }
      const source = audio.createBufferSource();
      source.buffer = buffer;
      const filter = audio.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = cup ? [820, 1250, 660, 1040][i] : 2400;
      filter.Q.value = cup ? 3.8 : 0.7;
      const gain = audio.createGain();
      gain.gain.value = (cup ? 0.85 : 0.65) * 0.65 ** i;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(audio.destination);
      source.start(now + (cup ? [0.035, 0.07, 0.11, 0.145][i] : 0));
    }
  }

  let width = 1000,
    height = 120,
    scale = 150,
    keyboardStart: number | null = null,
    keyboardAngle = 0,
    turfCache: HTMLCanvasElement | null = null;
  let touchStart: P.Point | null = null;
  const putterHead = () => ({ width: 21 / scale, halfHeight: 33 / scale });
  let objectScale = 1,
    shotScale = 1;
  const displayScale = () => (phase === "ready" ? objectScale : shotScale);
  const coarse = window.matchMedia?.("(pointer: coarse)").matches;
  const hint = coarse
    ? "Drag through the ball from right to left to putt."
    : "Move right to draw back, then sweep left to putt.";
  $("golf-instructions").textContent = hint;
  const say = (text: string) => {
    if (disposed) return;
    $("golf-status").textContent = text;
  };
  function showCounts(counts: Counts) {
    if (disposed) return;
    $("golf-scope").textContent =
      counts.scope === "local" ? "Local server" : "Global";
    $("golf-attempts").textContent = format.format(counts.attempts);
    $("golf-made").textContent = format.format(counts.made);
  }
  function sx(x: number) {
    return 28 + x * scale;
  }
  function sy(y: number) {
    return height / 2 + y * scale;
  }
  function point(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (((e.clientX - r.left) * width) / r.width - 28) / scale,
      y: (((e.clientY - r.top) * height) / r.height - height / 2) / scale,
      time: e.timeStamp,
    };
  }
  function resize() {
    const r = canvas.getBoundingClientRect();
    width = Math.max(240, r.width);
    height = r.height || 120;
    scale = (width - 56) / c.length;
    objectScale = window.matchMedia("(max-width: 720px)").matches
      ? Math.min(4, Math.max(1, 8 / (c.ballRadius * scale)))
      : 1;
    root.style.setProperty("--golf-ball-x", `${sx(c.start.x)}px`);
    root.style.setProperty("--golf-ball-y", `${height / 2}px`);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    previous = null;
    turfCache = buildTurf();
    draw();
  }
  function buildTurf() {
    // Render once per resize: thousands of fine, varied blades over sunlit turf.
    // The cached surface keeps ball movement independent of texture complexity.
    const texture = document.createElement("canvas"),
      dpr = Math.min(window.devicePixelRatio || 1, 2);
    texture.width = Math.ceil(width * dpr);
    texture.height = Math.ceil(height * dpr);
    const g = texture.getContext("2d")!;
    g.scale(dpr, dpr);
    const laneH = height - 20,
      top = (height - laneH) / 2;
    let seed = 1729;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    g.beginPath();
    const edge = window.matchMedia("(max-width: 720px)").matches ? 0 : 10;
    g.roundRect(edge, top, width - edge * 2, laneH, 12);
    g.clip();
    const base = g.createLinearGradient(0, top, 0, top + laneH);
    base.addColorStop(0, "#4f831c");
    base.addColorStop(0.33, "#79a82c");
    base.addColorStop(0.7, "#5e9523");
    base.addColorStop(1, "#42791a");
    g.fillStyle = base;
    g.fillRect(0, top, width, laneH);
    for (let i = 0; i < 32; i++) {
      const x = random() * width,
        y = top + random() * laneH,
        r = 18 + random() * 58;
      const patch = g.createRadialGradient(x, y, 0, x, y, r);
      patch.addColorStop(0, i % 3 ? "#b1c65320" : "#204f1828");
      patch.addColorStop(1, "#68932b00");
      g.fillStyle = patch;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    const shadows = ["#295513", "#315f14", "#46751a", "#53841e"];
    const lights = [
      "#96b94b",
      "#7eae37",
      "#abc75b",
      "#6b9b27",
      "#bad06b",
      "#568b24",
    ];
    // Short, closely mown grass viewed directly from above.
    for (let x = 0; x < width; x += 100) {
      g.fillStyle = x % 200 === 0 ? "#ffffff08" : "#153a1508";
      g.fillRect(x, top, 100, laneH);
    }
    const count = Math.floor(width * laneH * 0.32);
    g.lineCap = "round";
    for (let i = 0; i < count; i++) {
      const x = 8 + random() * (width - 16),
        y = top - 3 + random() * (laneH + 7),
        length = 0.5 + random() * 1.5;
      const lean = (random() - 0.5) * 4.3,
        light = random();
      g.strokeStyle = shadows[Math.floor(random() * shadows.length)];
      g.globalAlpha = 0.25 + random() * 0.25;
      g.lineWidth = 0.5 + random() * 0.55;
      g.beginPath();
      g.moveTo(x + 0.7, y + 1);
      g.quadraticCurveTo(
        x + lean * 0.4 + 0.7,
        y - length * 0.5 + 1,
        x + lean + 0.7,
        y - length + 1,
      );
      g.stroke();
      g.strokeStyle = lights[Math.floor(light * lights.length)];
      g.globalAlpha = 0.35 + random() * 0.42;
      g.lineWidth = 0.35 + random() * 0.45;
      g.beginPath();
      g.moveTo(x, y);
      g.quadraticCurveTo(
        x + lean * 0.3,
        y - length * 0.55,
        x + lean,
        y - length,
      );
      g.stroke();
    }
    g.globalAlpha = 1;
    const shade = g.createLinearGradient(0, top, 0, top + laneH);
    shade.addColorStop(0, "#203e1515");
    shade.addColorStop(0.25, "#d5eb8108");
    shade.addColorStop(0.75, "#d5eb8100");
    shade.addColorStop(1, "#1f40191f");
    g.fillStyle = shade;
    g.fillRect(0, top, width, laneH);
    return texture;
  }
  function drawPutter(x: number, y: number, angle = 0) {
    ctx.save();
    ctx.translate(sx(x), sy(y));
    ctx.rotate(angle);
    ctx.shadowColor = "#13241055";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 5;
    const steel = ctx.createLinearGradient(0, -23, 18, 23);
    steel.addColorStop(0, "#fafcfd");
    steel.addColorStop(0.3, "#9caab0");
    steel.addColorStop(0.48, "#f1f6f8");
    steel.addColorStop(0.6, "#65757e");
    steel.addColorStop(1, "#c8d1d6");
    // Shaft extends toward the golfer, perpendicular to the striking face.
    ctx.strokeStyle = "#c8d3d8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(12, 5);
    ctx.lineTo(62, 57);
    ctx.stroke();
    ctx.strokeStyle = "#34443c";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(49, 44);
    ctx.lineTo(70, 66);
    ctx.stroke();
    ctx.fillStyle = steel;
    ctx.beginPath();
    ctx.roundRect(0, -25, 21, 50, 5);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "#52636b";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#27383a";
    ctx.fillRect(1, -21, 3, 42);
    ctx.fillStyle = "#53646b";
    ctx.fillRect(9, -16, 7, 32);
    ctx.fillStyle = "#f9faf4";
    ctx.fillRect(6, -1, 13, 2);
    ctx.restore();
  }
  function draw() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    if (turfCache) ctx.drawImage(turfCache, 0, 0, width, height);
    const hx = sx(c.cup.x),
      hy = sy(c.cup.y),
      holeRadius = c.cupRadius * scale * displayScale();
    ctx.fillStyle = "#527a21";
    ctx.beginPath();
    ctx.arc(hx, hy, holeRadius + 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#14200c";
    ctx.beginPath();
    ctx.arc(hx, hy, holeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff70";
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.arc(hx, hy, holeRadius, 0, Math.PI);
    ctx.stroke();
    if (!ball.sunk || drop) {
      const progress = drop
        ? Math.min(1, (performance.now() - drop.start) / dropDuration)
        : 0;
      const settle = 1 - (1 - Math.min(1, progress / 0.55)) ** 3;
      const shrink = 1 - 0.28 * progress ** 2;
      const bx = drop ? sx(drop.x + (c.cup.x - drop.x) * settle) : sx(ball.x),
        by = drop
          ? sy(drop.y + (c.cup.y - drop.y) * settle) +
            progress ** 2 * holeRadius * 0.18
          : sy(ball.y),
        r = c.ballRadius * scale * displayScale() * shrink;
      ctx.save();
      if (drop) {
        ctx.globalAlpha = 1 - progress ** 4;
        if (progress > 0.2) {
          ctx.beginPath();
          ctx.arc(hx, hy, holeRadius - 0.5, 0, Math.PI * 2);
          ctx.clip();
        }
      }
      ctx.fillStyle = "#46533230";
      ctx.beginPath();
      ctx.ellipse(bx + 1, by + 2, r + 1, r * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      const shine = ctx.createRadialGradient(bx - 1, by - 2, 0, bx, by, r);
      shine.addColorStop(0, "#fff");
      shine.addColorStop(1, "#dde3d5");
      ctx.fillStyle = shine;
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.arc(bx, by, r - 0.4, 0, Math.PI * 2);
      ctx.clip();
      // Rotate a sphere of dimples across the visible hemisphere. Unlike a
      // shifting flat pattern, each dimple appears, foreshortens and disappears.
      const spin = (drop ? drop.rotation + progress * 3 : ball.rotation) * 0.42;
      const heading = Math.atan2(ball.vy, ball.vx || -1);
      for (let row = -4; row <= 4; row++) {
        const latitude = (row * Math.PI) / 10;
        const band = Math.cos(latitude);
        for (let col = 0; col < 18; col++) {
          const longitude =
            (col * Math.PI) / 9 + ((row % 2) * Math.PI) / 18 + spin;
          const depth = Math.cos(longitude) * band;
          if (depth <= 0.08) continue;
          const along = Math.sin(longitude) * band * r;
          const across = Math.sin(latitude) * r;
          const dx = along * Math.cos(heading) - across * Math.sin(heading);
          const dy = along * Math.sin(heading) + across * Math.cos(heading);
          ctx.fillStyle = `rgba(92,112,126,${0.28 + depth * 0.26})`;
          ctx.beginPath();
          ctx.ellipse(
            bx + dx,
            by + dy,
            r * 0.088 * depth,
            r * 0.075,
            heading,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          ctx.strokeStyle = "#ffffffb8";
          ctx.lineWidth = 0.55;
          ctx.beginPath();
          ctx.ellipse(
            bx + dx,
            by + dy + 0.35,
            r * 0.088 * depth,
            r * 0.075,
            heading,
            0,
            Math.PI,
          );
          ctx.stroke();
        }
      }
      ctx.restore();
      ctx.restore();
    }
    if (!drag && followStart && performance.now() - followStart < 420) {
      const t = Math.min(1, (performance.now() - followStart) / 420);
      drawPutter(
        followX - (55 / scale) * (1 - (1 - t) ** 3),
        followY,
        -0.16 * t,
      );
    } else if (club && phase === "ready" && !drag && keyboardStart === null) {
      drawPutter(
        club.x,
        club.y,
        Math.max(-0.2, Math.min(0.25, (club.x - ball.x) * 0.16)),
      );
    } else if (drag) {
      if (touchStart) {
        const x = drag.x;
        const y = drag.y;
        ctx.save();
        ctx.strokeStyle = "#fffdf3b0";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(sx(ball.x), sy(ball.y));
        ctx.lineTo(sx(drag.x), sy(drag.y));
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(sx(drag.x), sy(drag.y), 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        drawPutter(x, y);
      } else drawPutter(drag.x, drag.y);
    } else if (keyboardStart !== null && phase === "ready") {
      const pull = Math.min(
          1.2,
          ((performance.now() - keyboardStart) / 1000) * 0.85,
        ),
        a = (keyboardAngle * Math.PI) / 180;
      drawPutter(
        ball.x + 0.055 + Math.cos(a) * pull,
        ball.y + Math.sin(a) * pull,
        a,
      );
    }
  }
  function reset() {
    clearTimeout(resetTimer);
    club = null;
    drop = null;
    followStart = 0;
    ball = P.createBall();
    phase = "ready";
    previous = null;
    drag = null;
    keyboardStart = null;
    canvas.classList.remove("is-rolling", "is-dragging");
    $("golf-instructions").textContent = hint;
    draw();
  }
  async function finish(made: boolean) {
    phase = "result";

    canvas.classList.remove("is-rolling");
    previous = null;
    $("golf-instructions").textContent = made
      ? "In the cup. Nicely judged."
      : ball.x > c.cup.x + 0.2
        ? "A little more pace. Try again."
        : "Just missed. Try again.";
    say(
      made
        ? "Putt made. A new ball will appear."
        : "Putt missed. A new ball will appear.",
    );
    const id = shotId;
    try {
      await shotStarted;
      showCounts(await api.finishShot(id, made));
    } catch {
      say(
        "Shot finished. Shared counters are unavailable. You can still play.",
      );
    }
    if (!disposed) resetTimer = setTimeout(reset, 1200);
  }
  function frame(time: number) {
    if (phase === "sinking" && drop) {
      draw();
      if (time - drop.start < dropDuration) raf = requestAnimationFrame(frame);
      else {
        drop = null;
        raf = 0;
        draw();
        void finish(true);
      }
      return;
    }
    if (phase !== "rolling") return;
    const dt = last ? Math.min((time - last) / 1000, 0.05) : 1 / 60;
    last = time;
    const entry = { x: ball.x, y: ball.y, rotation: ball.rotation };
    const result = P.step(ball, dt, shotScale);
    if (result === "sunk") {
      drop = { ...entry, start: time };
      phase = "sinking";
      sound(true);
      draw();
      raf = requestAnimationFrame(frame);
      return;
    }
    draw();
    if (result === "moving") raf = requestAnimationFrame(frame);
    else {
      raf = 0;
      finish(false);
    }
  }
  function strike(vx: number, vy = 0) {
    const assisted = P.assistedStroke(vx, vy);
    vx = assisted.vx;
    vy = assisted.vy;
    if (phase !== "ready" || !P.shoot(ball, vx, vy)) return false;
    root.classList.remove("is-interacting");
    root.classList.add("has-putted");
    shotScale = objectScale;
    followX = ball.x + c.ballRadius * objectScale;
    followY = ball.y;
    followStart = performance.now();
    sound();
    phase = "rolling";
    previous = null;
    keyboardStart = null;
    last = 0;
    if (!drag) canvas.classList.remove("is-dragging");
    canvas.classList.add("is-rolling");
    $("golf-instructions").textContent = "Follow through · rolling…";
    say("Putt attempted.");
    shotId = crypto.randomUUID();
    shotStarted = api.beginShot(shotId, vx, vy, shotScale).then(showCounts);
    shotStarted.catch(() => {});
    raf = requestAnimationFrame(frame);
    return true;
  }
  listen(canvas, "pointerenter", () => {
    unlockAudio();
    previous = null;
  });
  listen(canvas, "pointermove", (e) => {
    const p = point(e);
    if (drag) {
      if (drag.id !== e.pointerId) return;
      drag = { ...p, id: e.pointerId };
      e.preventDefault();
      const current = p;
      const hit =
        phase === "ready"
          ? P.impact(previous, current, ball, putterHead(), objectScale)
          : null;
      if (hit) strike(hit.vx, hit.vy);
      else {
        previous = current;
        draw();
      }
      return;
    }
    if (
      phase === "ready" &&
      e.pointerType !== "touch" &&
      keyboardStart === null
    ) {
      club = p;
      swing = previous && p.x > previous.x ? "Backswing" : "Downswing";
      $("golf-instructions").textContent =
        `${swing} · sweep through the ball to the left`;
      const hit = P.impact(previous, p, ball, putterHead(), objectScale);
      if (hit) strike(hit.vx, hit.vy);
    }
    previous = phase === "ready" ? p : null;
    if (phase === "ready") draw();
  });
  listen(canvas, "pointerleave", () => {
    if (drag) return;
    club = null;
    previous = null;
    if (phase === "ready") draw();
  });
  listen(canvas, "pointerdown", (e) => {
    unlockAudio();
    if (phase !== "ready" || e.button !== 0 || drag) return;
    const p = point(e);
    const touch = e.pointerType === "touch";
    drag = { ...p, id: e.pointerId };
    touchStart = touch ? p : null;
    root.classList.add("is-interacting");
    previous = p;
    canvas.setPointerCapture(e.pointerId);
    canvas.focus({ preventScroll: true });
    canvas.classList.add("is-dragging");
    e.preventDefault();
    draw();
  });
  listen(canvas, "pointerup", (e) => {
    if (canvas.hasPointerCapture(e.pointerId))
      canvas.releasePointerCapture(e.pointerId);
    if (drag && e.pointerId === drag.id) cancelInput();
  });
  function cancelInput() {
    touchStart = null;
    root.classList.remove("is-interacting");
    drag = null;
    previous = null;
    keyboardStart = null;
    canvas.classList.remove("is-dragging");
    draw();
  }
  listen(canvas, "pointercancel", cancelInput);
  listen(canvas, "lostpointercapture", () => {
    if (drag) cancelInput();
  });
  function chargeFrame() {
    if (keyboardStart === null || phase !== "ready") return;
    draw();
    raf = requestAnimationFrame(chargeFrame);
  }
  listen(canvas, "keydown", (e) => {
    if (![" ", "ArrowLeft", "ArrowRight", "Escape"].includes(e.key)) return;
    e.preventDefault();
    unlockAudio();
    if (phase !== "ready") return;
    if (e.key === "Escape") {
      cancelInput();
      return;
    }
    if (e.key === "ArrowLeft") keyboardAngle = Math.max(-15, keyboardAngle - 1);
    if (e.key === "ArrowRight") keyboardAngle = Math.min(15, keyboardAngle + 1);
    if (e.key === " " && !e.repeat && keyboardStart === null) {
      keyboardStart = performance.now();
      previous = null;
      raf = requestAnimationFrame(chargeFrame);
    }
    if (e.key !== " ")
      say(`Aim ${keyboardAngle} degrees. Hold Space, then release to putt.`);
  });
  listen(canvas, "keyup", (e) => {
    if (e.key !== " " || keyboardStart === null) return;
    e.preventDefault();
    const duration = (performance.now() - keyboardStart) / 1000;
    keyboardStart = null;
    cancelAnimationFrame(raf);
    const speed = Math.min(3.9, Math.max(0.15, duration * 0.85 * 3.25)),
      a = (keyboardAngle * Math.PI) / 180;
    strike(-speed * Math.cos(a), -speed * Math.sin(a));
  });
  listen(canvas, "blur", cancelInput);
  document.addEventListener(
    "visibilitychange",
    () => {
      last = 0;
      cancelInput();
    },
    { signal: events.signal },
  );
  // Use existing page interactions too; no dedicated sound-enable click.
  listen(document, "pointerdown", unlockAudio);
  listen(document, "keydown", unlockAudio);
  unlockAudio();
  // Mobile browsers may discard an offscreen canvas surface. Rebuild its
  // cached turf and backing store when it returns to the viewport.
  const visibilityObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) resize();
  });
  visibilityObserver.observe(canvas);
  canvas.addEventListener("contextrestored", resize, { signal: events.signal });
  listen(root, "selectstart", (event) => event.preventDefault());
  listen(root, "dragstart", (event) => event.preventDefault());
  listen(canvas, "contextmenu", (event) => event.preventDefault());
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const refresh = () => {
    if (document.visibilityState !== "hidden")
      api
        .getCounts()
        .then(showCounts)
        .catch(() => {
          if (disposed) return;
          $("golf-scope").textContent = "Offline";
          say("Shared counters are unavailable. You can still play.");
        });
  };
  const poll = setInterval(refresh, 60000);
  resize();
  refresh();
  return () => {
    disposed = true;
    events.abort();
    observer.disconnect();
    visibilityObserver.disconnect();
    clearInterval(poll);
    clearTimeout(resetTimer);
    cancelAnimationFrame(raf);
    void audio?.close().catch(() => {});
  };
}
