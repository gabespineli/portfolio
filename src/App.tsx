import { useEffect, useState } from "react";
import { Home } from "./Home";
import { Resume } from "./Resume";

export function App() {
  const [now, setNow] = useState(new Date());
  const path = window.location.pathname;
  const home = path === "/";
  useEffect(() => {
    document.title = "Gab Espineli";
    const timer = setInterval(() => setNow(new Date()), 60000);
    const controller = new AbortController();
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target as Element;
        if (target.closest(".print-button")) window.print();
      },
      { signal: controller.signal },
    );
    document.addEventListener(
      "pointerdown",
      (event) => {
        const active = document.activeElement as HTMLElement | null;
        const row = active?.closest(".experience-with-stack");
        if (row && !row.contains(event.target as Node)) active?.blur();
      },
      { signal: controller.signal },
    );
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [path, home]);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="/">
          Gab Espineli<span className="brand-dot">.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href={`${home ? "" : "/"}#work`}>Work</a>
          <a href={`${home ? "" : "/"}#education`}>About</a>
          <a href={`${home ? "" : "/"}#contact`}>Contact</a>
        </nav>
        <div className="desktop-clock">
          <span className="connection-light" aria-hidden="true" />
          <time
            dateTime={now.toISOString()}
            aria-label="Current time in Manila"
          >
            {new Intl.DateTimeFormat("en-US", {
              timeZone: "Asia/Manila",
              hour: "numeric",
              minute: "2-digit",
            }).format(now)}
          </time>
          <span className="clock-place">PH</span>
        </div>
      </header>
      {home ? (
        <Home />
      ) : path === "/resume.html" ? (
        <Resume />
      ) : (
        <main id="main" className="not-found">
          <p className="eyebrow">404</p>
          <h1>A small detour.</h1>
          <p>This page isn’t here. Let’s get you back to the work.</p>
          <a href="/#work">View selected work ↗</a>
        </main>
      )}
      <footer>
        <span>Gab Espineli</span>
        <span className="footer-copyright">© 2026</span>
      </footer>
    </>
  );
}
