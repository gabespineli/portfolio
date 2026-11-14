import { useEffect, useRef } from "react";
import { Experience } from "./Experience";
import { Golf } from "./golf/Golf";
import { ProjectList } from "./Project";
export function Home() {
  const root = useRef<HTMLElement>(null);
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
        <div className={"hero-bottom"}>
          <figure className={"portrait"}>
            <div className={"profile-window"}>
              <div className={"window-bar"}>
                <span className={"window-icon"} aria-hidden={"true"}></span>
                <span className={"window-filename"}>
                  {"a-little-about-gab.jpg"}
                </span>
                <span className={"window-decor"} aria-hidden={"true"}>
                  <i></i>
                  <i></i>
                  <i></i>
                </span>
              </div>
              <img
                className="profile-photo"
                src="/profile.png"
                alt="Portrait of Gab Espineli"
                width="400"
                height="400"
                fetchPriority="high"
              />
            </div>
            <div className={"hello-sticker"}>
              <span>{"HELLO"}</span>
              <small>{"my name is"}</small>
              <strong>{"Gab."}</strong>
            </div>
          </figure>
          <div className={"intro"}>
            <p>
              {
                "I’m Gab, a Computer Science student at De La Salle University. If you need someone who can take a problem from the first conversation to a working product, that’s where I can help."
              }
            </p>
            <p>
              {
                "I’ll work with you to define what needs to be built, make the technical decisions, and see it through deployment. You can expect clear communication, practical choices, and attention to how the software holds up when you use it."
              }
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
      </section>
      <Golf />
      <section
        className={"section "}
        id={"work"}
        aria-labelledby={"work-title"}
      >
        <h2 id={"work-title"} className={"section-label"}>
          <span className={"folder-icon"} aria-hidden={"true"}></span>
          {"Selected work"}
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
          {"About: education &"}
          <br />
          {"involvement"}
        </h2>
        <div className={"section-content"}>
          <article className={"experience"}>
            <div className={"entry-top"}>
              <h3>
                <img
                  className="education-logo"
                  src="/logos/dlsu.png"
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
                src="/logos/civi.png"
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
                  src="/logos/sprint.png"
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
            I’m curious by default and easily pulled into the little details—how
            something looks, feels, or could work a bit better. I like
            tinkering, swapping ideas, and getting involved in student and
            church activities. Sometimes that curiosity turns into a project;
            sometimes it turns into a tiny putting green on my website.
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
