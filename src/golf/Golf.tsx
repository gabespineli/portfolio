import { useEffect, useRef } from "react";
import { mountGolf } from "./canvas";
export function Golf() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => mountGolf(root.current!), []);
  return (
    <section
      ref={root}
      id="putting"
      className="putting-strip"
      aria-label="One-hole putting green"
    >
      <canvas
        id="golf-course"
        width="2000"
        height="240"
        tabIndex={0}
        role="application"
        aria-label="One straight putting hole"
        aria-describedby="golf-instructions golf-keyboard"
      >
        A one-hole putting green. Enable JavaScript to play.
      </canvas>
      <div className="golf-swipe-hint" aria-hidden="true">
        <span className="golf-swipe-hand">
          <svg viewBox="0 0 40 44" fill="none">
            <path
              d="M16 23V7a3 3 0 0 1 6 0v13-5a3 3 0 0 1 6 0v6-3a3 3 0 0 1 6 0v12c0 7-4 11-11 11h-2c-4 0-7-2-9-5L5 26c-2-3 2-6 4-4l7 6"
              fill="#fffdf3"
              stroke="#365039"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
      <div className="putting-caption">
        <span id="golf-instructions" className="sr-only">
          Putt from right to left.
        </span>
        <div className="putting-totals" aria-label="Shared putting statistics">
          <span>
            <b id="golf-attempts">—</b> attempts
          </span>
          <span>
            <b id="golf-made">—</b> made
          </span>
          <span id="golf-scope" className="sr-only">
            Connecting…
          </span>
        </div>
      </div>
      <span
        id="golf-status"
        className="sr-only"
        role="status"
        aria-live="polite"
      />
      <span id="golf-keyboard" className="sr-only">
        Mouse: move right for the backswing, then left through the ball for the
        downswing and follow through. Touch: press near or to the right of the
        ball and drag your thumb left through it. Contact strikes immediately;
        lifting your thumb does not take a shot. Keyboard: hold Space to draw
        back and release to putt. Left and right arrows adjust aim. Escape
        cancels a stroke.
      </span>
    </section>
  );
}
