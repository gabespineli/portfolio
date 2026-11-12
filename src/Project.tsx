import type { ReactNode } from "react";
import { projects } from "./projects";
type Project = (typeof projects)[number];

export function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="section-label">
        {label}
      </h2>
      <div className="section-content">{children}</div>
    </section>
  );
}

export function Art({ project: p }: { project: Project }) {
  return (
    <div className="project-window">
      <div className="window-bar" aria-hidden="true">
        <span className="window-icon" />
        <span className="window-filename">{p.id}.project</span>
        <span className="window-decor">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div
        className={`cover cover-${p.cover}`}
        role="img"
        aria-label={`${p.name} illustrative project cover`}
      >
        {p.cover === "body" ? (
          <svg viewBox="0 0 240 180" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1.6">
              <ellipse cx="125" cy="37" rx="14" ry="17" />
              <path d="M114 54 Q96 62 90 86 L71 120 L79 125 L107 92 L109 122 L99 160 L112 163 L127 129 L140 162 L153 158 L140 120 L140 84 L161 109 L170 101 L149 67 Q142 57 135 54Z" />
            </g>
            <g fill="#a6a5cb" opacity=".65">
              <ellipse cx="125" cy="83" rx="10" ry="15" />
              <ellipse
                cx="111"
                cy="144"
                rx="5"
                ry="12"
                transform="rotate(20 111 144)"
              />
              <circle cx="95" cy="91" r="7" />
            </g>
            <path
              d="M29 25h12M29 25v12M210 25h-12M210 25v12M29 158h12M29 158v-12M210 158h-12M210 158v-12"
              fill="none"
              stroke="currentColor"
              opacity=".3"
            />
          </svg>
        ) : p.cover === "clean" ? (
          <>
            <div className="cover-word">
              Clean<span>HAUL</span>
              <i />
            </div>
            <div className="cover-lines">
              <span />
              <span />
              <span />
            </div>
          </>
        ) : p.cover === "talent" ? (
          <>
            <div className="talent-mark">
              t<span>↗</span>
            </div>
            <div className="cover-word">talentados</div>
          </>
        ) : (
          <>
            <svg viewBox="0 0 200 140" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M60 43h66v36q0 27-33 27T60 79ZM126 52h12q23 21-12 29M51 112h86M78 32q-8-10 0-20M99 32q-8-10 0-20" />
              </g>
            </svg>
            <div className="coffee-word">WTP COFFEE</div>
          </>
        )}
      </div>
    </div>
  );
}

export function ProjectList() {
  return projects.map((p) => (
    <article className="project-item" key={p.id}>
      <a className="project" href={`/projects/${p.id}/`}>
        <Art project={p} />
        <div className="project-copy">
          <div className="project-heading">
            <h3>{p.name}</h3>
            {p.tag && <span className="badge latest">{p.tag}</span>}
            <span aria-hidden="true">↗</span>
          </div>
          <p>{p.summary}</p>
          <span className="project-meta">
            {p.role} <span>·</span> {p.category}
          </span>
        </div>
      </a>
    </article>
  ));
}

export function ProjectPage({ project: p }: { project: Project }) {
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  return (
    <main id="main" className="case-main">
      <a className="back-link" href="/#work">
        ← Selected work
      </a>
      <div className="case-heading">
        <div className="eyebrow">
          {p.category} <span>·</span> {p.status}
        </div>
        <h1>{p.name}</h1>
        <p className="case-subtitle">{p.intro}</p>
      </div>
      <div className="case-cover">
        <Art project={p} />
        <div className="case-stat">
          <strong>{p.metric}</strong>
          <span>{p.metricLabel}</span>
        </div>
      </div>
      <p className="cover-caption">{p.note}</p>
      <div className="case-facts">
        <div>
          <span>ROLE</span>
          <p>{p.role}</p>
        </div>
        <div>
          <span>WHEN</span>
          <p>{p.year}</p>
        </div>
        <div>
          <span>CONTEXT</span>
          <p>{p.category}</p>
        </div>
      </div>
      <Section id="need" label="The starting point">
        <p>{p.problem}</p>
      </Section>
      <Section id="contribution" label="My contribution">
        <p>{p.contribution}</p>
      </Section>
      <Section id="decisions" label="What mattered">
        <ul className="decision-list">
          {p.decisions.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>
      <Section id="result" label="The result">
        <p>{p.result}</p>
      </Section>
      <Section id="tools" label="Explore project">
        <div className="case-links">
          {p.links.map(([label, url]) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              {label} ↗
            </a>
          ))}
        </div>
      </Section>
      <aside className="pending-panel">
        <span className="eyebrow">STILL TO ADD</span>
        <p>{p.pending.join(" · ")}</p>
      </aside>
      <a className="next-project" href={`/projects/${next.id}/`}>
        <span className="eyebrow">NEXT PROJECT</span>
        <span>{next.name} ↗</span>
      </a>
    </main>
  );
}
