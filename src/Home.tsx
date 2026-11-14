import { useEffect, useRef } from "react";
import { Experience } from "./Experience";
import { Golf } from "./golf/Golf";
import { ProjectList } from "./Project";
import { faviconBurst } from "./faviconBurst";
import { playClick } from "./audio";
export function Home() {
  const root = useRef<HTMLElement>(null);
  const interactiveClicks = useRef(0);
  const burstController = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      burstController.current?.abort();
      document.documentElement.classList.remove("favicon-letters");
    },
    [],
  );
  useEffect(() => {
    const sections = Array.from(
      root.current?.querySelectorAll<HTMLElement>(":scope > section") ?? [],
    );
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -24px 0px" },
    );
    sections.forEach((section) => {
      section.classList.add("section-reveal", "reveal-pending");
      observer.observe(section);
    });
    const revealAll = () => {
      if (motion.matches) {
        observer.disconnect();
        sections.forEach((section) =>
          section.classList.remove("reveal-pending"),
        );
      }
    };
    motion.addEventListener("change", revealAll);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", revealAll);
      sections.forEach((section) =>
        section.classList.remove("section-reveal", "reveal-pending"),
      );
    };
  }, []);
  useEffect(() => {
    const phone = window.matchMedia(
      "(max-width: 720px), (hover: none) and (pointer: coarse)",
    );
    const targets = Array.from(
      root.current?.querySelectorAll<HTMLElement>(
        ".experience-with-stack .entry-top, .project-item .project-heading",
      ) ?? [],
    );
    const cards = targets.map((target) =>
      target.closest<HTMLElement>(".experience-with-stack, .project-item")!,
    );
    let frame = 0;
    let active: HTMLElement | null = null;
    const select = (next: HTMLElement | null) => {
      if (next === active) return;
      active = next;
      cards.forEach((card) =>
        card.classList.toggle("scroll-active", card === next),
      );
    };
    const measure = () => {
      frame = 0;
      if (!phone.matches) return;
      const height = window.innerHeight;
      let nearest: HTMLElement | null = null;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const bounds = card.getBoundingClientRect();
        if (bounds.bottom <= height * 0.08 || bounds.top >= height * 0.9)
          return;
        const heading = targets[index].getBoundingClientRect();
        const offset = Math.abs(
          heading.top + heading.height / 2 - height * 0.42,
        );
        if (offset < distance) {
          distance = offset;
          nearest = card;
        }
      });
      select(nearest);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const update = () => {
      select(null);
      root.current?.classList.toggle("scroll-interactions", phone.matches);
      schedule();
    };
    const onFocus = (event: FocusEvent) => {
      if (!phone.matches || !(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>(
        ".experience-with-stack, .project-item",
      );
      if (card && cards.includes(card)) select(card);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    root.current?.addEventListener("focusin", onFocus);
    phone.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.current?.removeEventListener("focusin", onFocus);
      phone.removeEventListener("change", update);
      cards.forEach((card) => card.classList.remove("scroll-active"));
      root.current?.classList.remove("scroll-interactions");
    };
  }, []);
  return (
    <main id={"main"} ref={root}>
      <section className={"hero"} aria-labelledby={"hero-title"}>
        <h1 id={"hero-title"} className="sr-only">
          Gab Espineli
        </h1>
        <div className="hero-bottom hero-desktop">
          <figure className={"portrait"}>
            <div className="portrait-desktop">
              <div className="profile-window profile-preview">
                <div className={"window-bar"}>
                  <span className={"window-icon"} aria-hidden={"true"}></span>
                  <span className={"window-filename"}>{"Preview"}</span>
                  <span className={"window-decor"} aria-hidden={"true"}>
                    <i></i>
                    <i></i>
                    <i></i>
                  </span>
                </div>
                <img
                  className="profile-photo"
                  src="/profile.webp"
                  alt="Portrait of Gab Espineli"
                  width="400"
                  height="400"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </figure>
          <div className="intro intro-note">
            <div className="window-bar intro-note-bar" aria-hidden="true">
              <span className="window-icon" />
              <span className="window-filename">hello.txt</span>
              <span className="window-decor">
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className="intro-note-body">
              <p className="intro-name">Hey, I’m Gab.</p>
              <p>
                I study Computer Science at{" "}
                <span className="intro-label">
                  <img
                    className="intro-school-logo"
                    src="/logos/dlsu.webp"
                    alt=""
                    width="18"
                    height="18"
                  />
                  De La Salle
                </span>{" "}
                and build{" "}
                <span className="intro-label">
                  <img src="/web-app.svg" alt="" width="16" height="16" />
                  web apps
                </span>
                {" and "}
                <button
                  type="button"
                  className="intro-label interactive-pill"
                  onClick={() => {
                    playClick();
                    interactiveClicks.current += 1;
                    if (interactiveClicks.current === 5) {
                      burstController.current = new AbortController();
                      void faviconBurst(burstController.current.signal);
                    }
                  }}
                >
                  <img
                    src="/interactive-cursor.svg"
                    width="16"
                    height="16"
                    alt=""
                  />
                  interactive
                </button>
                {" experiences."}
              </p>
              <p>
                Have something in mind? I’ll help you work through the details
                and turn it into software you can use.
              </p>
              <p className={"intro-links"}>
                <a href={"#work"}>{"Explore my work "}</a>
                <a
                  href={"/ESPINELI_RESUME.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"View résumé "}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
      <Golf />
      <section
        className={"section "}
        id={"work"}
        aria-labelledby={"work-title"}
      >
        <h2 id={"work-title"} className={"section-label"}>
          <span className={"folder-icon"} aria-hidden={"true"}></span>
          {"Projects"}
        </h2>
        <div className={"section-content"}>
          <ProjectList />
        </div>
      </section>
      <section
        className={"section "}
        id={"experience"}
        aria-labelledby={"experience-title"}
      >
        <h2 id={"experience-title"} className={"section-label"}>
          {"Experience"}
        </h2>
        <div className={"section-content"}>
          <Experience />
        </div>
      </section>
      <section
        className={"section "}
        id={"about"}
        aria-labelledby={"education-title"}
      >
        <h2 id={"education-title"} className={"section-label"}>
          <span id="education" />
          {"Education & Involvement"}
        </h2>
        <div className={"section-content"}>
          <article className={"experience"}>
            <div className={"entry-top"}>
              <h3>
                <img
                  className="education-logo"
                  loading="lazy"
                  decoding="async"
                  src="/logos/dlsu.webp"
                  alt=""
                  width="25"
                  height="25"
                />
                {"De La Salle University"}
              </h3>
              <span className={"date"}>{"Expected May 2028"}</span>
            </div>
            <p>{"BS Computer Science, major in Software Technology"}</p>
            <p className={"stack"}>{"3.67 / 4.00 GPA"}</p>
          </article>
          <article className={"experience"}>
            <h3>
              <img
                className="education-logo"
                loading="lazy"
                decoding="async"
                src="/logos/civi.webp"
                alt=""
                width="25"
                height="25"
              />
              {"Center for Computational Imaging"}
              <br />
              {"and Visual Innovations"}
            </h3>
            <p className={"role"}>{"Student Researcher · CIVI, DLSU"}</p>
            <p>{"Exploring computational imaging and visual applications."}</p>
          </article>
          <article className={"experience"}>
            <div className={"entry-top"}>
              <h3>
                <img
                  className="education-logo"
                loading="lazy"
                decoding="async"
                  src="/logos/sprint.webp"
                  alt=""
                  width="25"
                  height="25"
                />
                {"S.P.R.I.N.T."}
              </h3>
              <span className={"date"}>{"Sep 2025 to Sep 2026"}</span>
            </div>
            <p className={"role"}>
              {"Associate Vice President, Socio-Civic Committee"}
            </p>
            <p>
              {
                "Coordinated initiative planning, event proposals, and faculty outreach for sponsorships and donations."
              }
            </p>
          </article>
        </div>
      </section>
      <section
        className={"section about"}
        id={"personal"}
        aria-labelledby={"about-title"}
      >
        <h2 id={"about-title"} className={"section-label"}>
          {"A little about me"}
        </h2>
        <div className={"section-content"}>
          <p>
            I like trying things out and seeing where they go. That could mean
            messing around with a website, swapping random ideas with friends,
            or joining in on student and church activities. This is my first
            portfolio, so I wanted it to feel a little like me. Sometimes that
            curiosity turns into a project; sometimes it turns into a tiny
            putting green on my website.
          </p>
        </div>
      </section>
      <section
        className={"section contact"}
        id={"contact"}
        aria-labelledby={"contact-title"}
      >
        <h2 id={"contact-title"} className={"section-label"}>
          {"Say hello"}
        </h2>
        <div className={"section-content"}>
          <p>
            I’m looking for software engineering internships. Find me on{" "}
            <a
              href="https://github.com/gabespineli"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>{" "}
            and{" "}
            <a
              href="https://www.linkedin.com/in/josegespineli/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            , or say hello at{" "}
            <a href="mailto:gabespineli@gmail.com">gabespineli@gmail.com</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
