import type React from "react";
export function Experience() {
  return (
    <>
      <article
        className={"experience experience-with-stack"}
        tabIndex={0}
        aria-label={"CleanHAUL"}
      >
        <div className={"entry-top"}>
          <h3>
            <img
              className="company-logo"
              src="/logos/cleanhaul.jpg"
              alt=""
              width="25"
              height="25"
            />
            {"CleanHAUL"}
          </h3>
          <span className={"date"}>{"July 2026 to Present"}</span>
        </div>
        <p className={"role"}>{"Systems Developer"}</p>
        <p>
          {
            "Own the delivery and continued improvement of a client and contract management system, from workflow analysis through production support."
          }
        </p>
        <div className="experience-tools">
          <div className="experience-tools-inner">
            <div
              className={"tech-stack tech-fan"}
              aria-label={"Project technologies"}
            >
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "0",
                    "--tilt": "-18deg",
                    "--lift": "10px",
                  } as React.CSSProperties
                }
                aria-label={"TypeScript"}
                title={"TypeScript"}
              >
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
                <span className={"tech-tooltip"}>{"TypeScript"}</span>
              </button>
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "1",
                    "--tilt": "-9deg",
                    "--lift": "5px",
                  } as React.CSSProperties
                }
                aria-label={"React"}
                title={"React"}
              >
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
                  <circle
                    cx={"16"}
                    cy={"16"}
                    r={"2.5"}
                    fill={"currentColor"}
                  ></circle>
                </svg>
                <span className={"tech-tooltip"}>{"React"}</span>
              </button>
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "2",
                    "--tilt": "0deg",
                    "--lift": "0px",
                  } as React.CSSProperties
                }
                aria-label={"Next.js"}
                title={"Next.js"}
              >
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
                <span className={"tech-tooltip"}>{"Next.js"}</span>
              </button>
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "3",
                    "--tilt": "9deg",
                    "--lift": "5px",
                  } as React.CSSProperties
                }
                aria-label={"Tailwind"}
                title={"Tailwind"}
              >
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
                <span className={"tech-tooltip"}>{"Tailwind"}</span>
              </button>
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "4",
                    "--tilt": "18deg",
                    "--lift": "10px",
                  } as React.CSSProperties
                }
                aria-label={"Supabase"}
                title={"Supabase"}
              >
                <svg
                  viewBox={"0 0 32 32"}
                  aria-hidden={"true"}
                  style={{ color: "#28835a" } as React.CSSProperties}
                >
                  <path
                    fill={"currentColor"}
                    d={"M18 1 4 19h11l-1 12L28 13H17Z"}
                  ></path>
                </svg>
                <span className={"tech-tooltip"}>{"Supabase"}</span>
              </button>
              <span className={"tech-caption"} aria-hidden={"true"}>
                {"Project technologies"}
              </span>
            </div>
          </div>
        </div>
      </article>
      <article
        className={"experience experience-with-stack"}
        tabIndex={0}
        aria-label={"Asceoft"}
      >
        <div className={"entry-top"}>
          <h3>
            <img
              className="company-logo"
              src="/logos/asceoft.png"
              alt=""
              width="25"
              height="25"
            />
            {"Asceoft"}
          </h3>
          <span className={"date"}>{"May to August 2026"}</span>
        </div>
        <p className={"role"}>{"Lead Analyst · Industry client project"}</p>
        <p>
          {
            "Led requirements analysis and backlog definition for a recruitment system developed by a nine-person team."
          }
        </p>
        <div className="experience-tools">
          <div className="experience-tools-inner">
            <div
              className={"tech-stack tech-fan"}
              aria-label={"Project technologies"}
            >
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "0",
                    "--tilt": "-18deg",
                    "--lift": "10px",
                  } as React.CSSProperties
                }
                aria-label={"TypeScript"}
                title={"TypeScript"}
              >
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
                <span className={"tech-tooltip"}>{"TypeScript"}</span>
              </button>
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "1",
                    "--tilt": "-9deg",
                    "--lift": "5px",
                  } as React.CSSProperties
                }
                aria-label={"Next.js"}
                title={"Next.js"}
              >
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
                <span className={"tech-tooltip"}>{"Next.js"}</span>
              </button>
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "2",
                    "--tilt": "0deg",
                    "--lift": "0px",
                  } as React.CSSProperties
                }
                aria-label={"Express"}
                title={"Express"}
              >
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
                <span className={"tech-tooltip"}>{"Express"}</span>
              </button>
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "3",
                    "--tilt": "9deg",
                    "--lift": "5px",
                  } as React.CSSProperties
                }
                aria-label={"Prisma"}
                title={"Prisma"}
              >
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
                <span className={"tech-tooltip"}>{"Prisma"}</span>
              </button>
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "4",
                    "--tilt": "18deg",
                    "--lift": "10px",
                  } as React.CSSProperties
                }
                aria-label={"Supabase"}
                title={"Supabase"}
              >
                <svg
                  viewBox={"0 0 32 32"}
                  aria-hidden={"true"}
                  style={{ color: "#28835a" } as React.CSSProperties}
                >
                  <path
                    fill={"currentColor"}
                    d={"M18 1 4 19h11l-1 12L28 13H17Z"}
                  ></path>
                </svg>
                <span className={"tech-tooltip"}>{"Supabase"}</span>
              </button>
              <span className={"tech-caption"} aria-hidden={"true"}>
                {"Project technologies"}
              </span>
            </div>
          </div>
        </div>
      </article>
      <article
        className={"experience experience-with-stack"}
        tabIndex={0}
        aria-label={"WTP Coffee"}
      >
        <div className={"entry-top"}>
          <h3>
            <img
              className="company-logo"
              src="/logos/wtp-coffee.png"
              alt=""
              width="25"
              height="25"
            />
            {"WTP Coffee"}
          </h3>
          <span className={"date"}>{"March to May 2026"}</span>
        </div>
        <p className={"role"}>{"Freelance Shopify Developer"}</p>
        <p>
          {
            "Built and launched a custom storefront supporting commerce, reservations, and event inquiries."
          }
        </p>
        <div className="experience-tools">
          <div className="experience-tools-inner">
            <div
              className={"tech-stack tech-fan"}
              aria-label={"Project technologies"}
            >
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "0",
                    "--tilt": "-13.5deg",
                    "--lift": "7.5px",
                  } as React.CSSProperties
                }
                aria-label={"Liquid"}
                title={"Liquid"}
              >
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
                <span className={"tech-tooltip"}>{"Liquid"}</span>
              </button>
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "1",
                    "--tilt": "-4.5deg",
                    "--lift": "2.5px",
                  } as React.CSSProperties
                }
                aria-label={"JavaScript"}
                title={"JavaScript"}
              >
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
                <span className={"tech-tooltip"}>{"JavaScript"}</span>
              </button>
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "2",
                    "--tilt": "4.5deg",
                    "--lift": "2.5px",
                  } as React.CSSProperties
                }
                aria-label={"CSS"}
                title={"CSS"}
              >
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
                <span className={"tech-tooltip"}>{"CSS"}</span>
              </button>
              <button
                type={"button"}
                className={"tech-tile"}
                style={
                  {
                    "--order": "3",
                    "--tilt": "13.5deg",
                    "--lift": "7.5px",
                  } as React.CSSProperties
                }
                aria-label={"Shopify"}
                title={"Shopify"}
              >
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
                <span className={"tech-tooltip"}>{"Shopify"}</span>
              </button>
              <span className={"tech-caption"} aria-hidden={"true"}>
                {"Project technologies"}
              </span>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
