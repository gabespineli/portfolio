import { projects } from "./projects";

type Project = (typeof projects)[number];

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
      <img
        className="project-cover-image"
        src={`/projects/${p.id}.png`}
        alt={`${p.name} project preview`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export function ProjectList() {
  return projects.map((p) => {
    const navigable = p.id === "wtp-coffee";
    const Container = navigable ? "a" : "div";
    return (
      <article
        className="project-item"
        key={p.id}
        tabIndex={navigable ? undefined : 0}
      >
        <Container
          className="project"
          {...(navigable
            ? {
                href: "https://wtpcoffee.com/",
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {})}
        >
          <Art project={p} />
          <div className="project-copy">
            <div className="project-heading">
              <h3>{p.name}</h3>
              {p.tag && <span className="badge latest">{p.tag}</span>}
            </div>
            <p>
              {p.summary
                .split(
                  /(100 people|30\+ minutes|one minute|nine-person team|20 user stories|1,700\+ unique visitors)/g,
                )
                .map((part, index) =>
                  index % 2 === 1 ? (
                    <span className="project-metric" key={index}>
                      {part}
                    </span>
                  ) : (
                    part
                  ),
                )}
            </p>
            {navigable && (
              <span className="project-visit">Visit wtpcoffee.com ↗</span>
            )}
          </div>
        </Container>
      </article>
    );
  });
}
