import type { CSSProperties } from "react";
const icons = {
  TypeScript: (
    <svg
      viewBox={"0 0 32 32"}
      aria-hidden={"true"}
      style={{ color: "#3178c6" } as React.CSSProperties}
    >
      <text
        x={"16"}
        y={"22"}
        textAnchor={"middle"}
        fill={"currentColor"}
        fontFamily={"Arial,sans-serif"}
        fontWeight={"700"}
        fontSize={"20"}
      >
        {"TS"}
      </text>
    </svg>
  ),
  React: (
    <svg
      viewBox={"0 0 32 32"}
      aria-hidden={"true"}
      style={{ color: "#25819b" } as React.CSSProperties}
    >
      <g fill={"none"} stroke={"currentColor"} strokeWidth={"1.5"}>
        <ellipse cx={"16"} cy={"16"} rx={"14"} ry={"5"}></ellipse>
        <ellipse
          cx={"16"}
          cy={"16"}
          rx={"14"}
          ry={"5"}
          transform={"rotate(60 16 16)"}
        ></ellipse>
        <ellipse
          cx={"16"}
          cy={"16"}
          rx={"14"}
          ry={"5"}
          transform={"rotate(120 16 16)"}
        ></ellipse>
      </g>
      <circle cx={"16"} cy={"16"} r={"2.5"} fill={"currentColor"}></circle>
    </svg>
  ),
  "Next.js": (
    <svg
      viewBox={"0 0 32 32"}
      aria-hidden={"true"}
      style={{ color: "#202620" } as React.CSSProperties}
    >
      <text
        x={"16"}
        y={"22"}
        textAnchor={"middle"}
        fill={"currentColor"}
        fontFamily={"Arial,sans-serif"}
        fontWeight={"700"}
        fontSize={"20"}
      >
        {"N"}
      </text>
    </svg>
  ),
  Tailwind: (
    <svg
      viewBox={"0 0 32 32"}
      aria-hidden={"true"}
      style={{ color: "#16849b" } as React.CSSProperties}
    >
      <text
        x={"16"}
        y={"22"}
        textAnchor={"middle"}
        fill={"currentColor"}
        fontFamily={"Arial,sans-serif"}
        fontWeight={"700"}
        fontSize={"20"}
      >
        {"~"}
      </text>
    </svg>
  ),
  Supabase: (
    <svg
      viewBox={"0 0 32 32"}
      aria-hidden={"true"}
      style={{ color: "#28835a" } as React.CSSProperties}
    >
      <path fill={"currentColor"} d={"M18 1 4 19h11l-1 12L28 13H17Z"}></path>
    </svg>
  ),
  Express: (
    <svg
      viewBox={"0 0 32 32"}
      aria-hidden={"true"}
      style={{ color: "#353d35" } as React.CSSProperties}
    >
      <text
        x={"16"}
        y={"22"}
        textAnchor={"middle"}
        fill={"currentColor"}
        fontFamily={"Arial,sans-serif"}
        fontWeight={"700"}
        fontSize={"20"}
      >
        {"ex"}
      </text>
    </svg>
  ),
  Prisma: (
    <svg
      viewBox={"0 0 32 32"}
      aria-hidden={"true"}
      style={{ color: "#314b50" } as React.CSSProperties}
    >
      <path
        d={"M18 2 3 25l24 5Z"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"2"}
      ></path>
      <path
        d={"m18 2-7 25 16 3"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"2"}
      ></path>
    </svg>
  ),
  Liquid: (
    <svg
      viewBox={"0 0 32 32"}
      aria-hidden={"true"}
      style={{ color: "#658636" } as React.CSSProperties}
    >
      <text
        x={"16"}
        y={"22"}
        textAnchor={"middle"}
        fill={"currentColor"}
        fontFamily={"Arial,sans-serif"}
        fontWeight={"700"}
        fontSize={"12"}
      >
        {"{ }"}
      </text>
    </svg>
  ),
  JavaScript: (
    <svg
      viewBox={"0 0 32 32"}
      aria-hidden={"true"}
      style={{ color: "#877600" } as React.CSSProperties}
    >
      <text
        x={"16"}
        y={"22"}
        textAnchor={"middle"}
        fill={"currentColor"}
        fontFamily={"Arial,sans-serif"}
        fontWeight={"700"}
        fontSize={"20"}
      >
        {"JS"}
      </text>
    </svg>
  ),
  CSS: (
    <svg
      viewBox={"0 0 32 32"}
      aria-hidden={"true"}
      style={{ color: "#663399" } as React.CSSProperties}
    >
      <text
        x={"16"}
        y={"22"}
        textAnchor={"middle"}
        fill={"currentColor"}
        fontFamily={"Arial,sans-serif"}
        fontWeight={"700"}
        fontSize={"12"}
      >
        {"CSS"}
      </text>
    </svg>
  ),
  Shopify: (
    <svg
      viewBox={"0 0 32 32"}
      aria-hidden={"true"}
      style={{ color: "#648b31" } as React.CSSProperties}
    >
      <text
        x={"16"}
        y={"22"}
        textAnchor={"middle"}
        fill={"currentColor"}
        fontFamily={"Arial,sans-serif"}
        fontWeight={"700"}
        fontSize={"20"}
      >
        {"S"}
      </text>
    </svg>
  ),
};
export type Technology = keyof typeof icons;
export function TechnologyStack({
  technologies,
}: {
  technologies: Technology[];
}) {
  return (
    <div className="experience-tools">
      <div className="experience-tools-inner">
        <div className="tech-stack tech-fan" aria-label="Project technologies">
          {technologies.map((name, index) => {
            const offset = index - (technologies.length - 1) / 2;
            return (
              <button
                key={name}
                type="button"
                className="tech-tile"
                aria-label={name}
                title={name}
                style={
                  {
                    "--order": index,
                    "--tilt": `${offset * 9}deg`,
                    "--lift": `${Math.abs(offset) * 5}px`,
                  } as CSSProperties
                }
              >
                {icons[name]}
                <span className="tech-tooltip">{name}</span>
              </button>
            );
          })}
          <span className="tech-caption" aria-hidden="true">
            Project technologies
          </span>
        </div>
      </div>
    </div>
  );
}
