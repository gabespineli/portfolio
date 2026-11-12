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
        downswing and follow through. Touch: pull right from the ball and
        release. Keyboard: hold Space to draw back and release to putt. Left and
        right arrows adjust aim. Escape cancels a stroke.
      </span>
    </section>
  );
}
