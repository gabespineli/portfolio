import { Experience } from "./Experience";
import { Golf } from "./golf/Golf";
import { ProjectList } from "./Project";
export function Home() {
  return (
    <main id={"main"}>
      <section className={"hero"} aria-labelledby={"hero-title"}>
        <div className={"eyebrow"}>
          <span className={"status-dot"}></span>
          {" SOFTWARE DEVELOPER · MANILA, PH"}
        </div>
        <h1 id={"hero-title"}>
          {"Software built around"}
          <br />
          {"the "}
          <em>{"people using it."}</em>
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
              <a
                className={"desktop-landscape landscape-link"}
                href={"#putting"}
                aria-label={"Take a putting break"}
              >
                <div className={"cloud cloud-one"} aria-hidden={"true"}></div>
                <div className={"cloud cloud-two"} aria-hidden={"true"}></div>
                <div className={"hill hill-far"} aria-hidden={"true"}></div>
                <div className={"hill hill-near"} aria-hidden={"true"}></div>
                <span className={"monogram"}>{"ge."}</span>
                <span className={"landscape-flag"} aria-hidden={"true"}>
                  {"⚑"}
                </span>
                <span className={"landscape-caption"}>
                  {"A little time on the green. ↗"}
                </span>
              </a>
              <div className={"photo-placeholder-label"}>
                {"Exhibit photo to be added"}
              </div>
            </div>
            <div className={"hello-sticker"}>
              <span>{"HELLO"}</span>
              <small>{"my name is"}</small>
              <strong>{"Gab."}</strong>
            </div>
            <figcaption>
              {"Gab Espineli "}
              <span>{"·"}</span>
              {" DLSU Computer Science"}
            </figcaption>
          </figure>
          <div className={"intro"}>
            <p>
              {
                "I’m Gab, a Computer Science student at De La Salle University. I build software for real workflows and experiences, from a contract system used by a local business to an interactive exhibit experienced by over 100 people."
              }
            </p>
            <p>
              {
                "I like understanding what people need, working through the details with them, and seeing the result get used. My work spans requirements, development, deployment, and the improvements that follow."
              }
            </p>
            <p className={"intro-links"}>
              <a href={"#work"}>
                {"Explore my work "}
                <span aria-hidden={"true"}>{"↗"}</span>
              </a>
              <a href={"/resume.html"}>
                {"View résumé "}
                <span aria-hidden={"true"}>{"↗"}</span>
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
        id={"explorations"}
        aria-labelledby={"explorations-title"}
      >
        <h2 id={"explorations-title"} className={"section-label"}>
          <span className={"folder-icon"} aria-hidden={"true"}></span>
          {"Currently building"}
          <br />
          {"& explorations"}
        </h2>
        <div className={"section-content"}>
          <details className={"exploration"}>
            <summary>
              <span className={"exploration-title"}>
                {"ArugaBai / ArugaVault"}
                <span className={"badge"}>{"In progress"}</span>
              </span>
              <span className={"expand"} aria-hidden={"true"}>
                {"+"}
              </span>
            </summary>
            <p>
              {
                "A team-built mobile care and medical-document experience. My work includes development setup, operations, mobile implementation, and an Android on-device OCR spike."
              }
            </p>
            <div className={"exploration-more"}>
              {
                "Exploring document capture and text recognition with Expo and React Native. The wider product remains in development; a current demo and a verified breakdown of my shipped contributions will be added."
              }
            </div>
          </details>
          <details className={"exploration"}>
            <summary>
              <span className={"exploration-title"}>
                {"Sakila query optimization"}
                <span className={"badge"}>{"Academic study"}</span>
              </span>
              <span className={"expand"} aria-hidden={"true"}>
                {"+"}
              </span>
            </summary>
            <p>
              {
                "Four analytical queries, a larger synthetic dataset, and experiments with query reformulation and indexing in MySQL."
              }
            </p>
            <div className={"exploration-more"}>
              {
                "My work included query definition, baseline analysis, and the final narrative. Final report, repository, and verified benchmark table to be added."
              }
            </div>
          </details>
          <details className={"exploration"}>
            <summary>
              <span className={"exploration-title"}>
                {"Transactions & locking"}
                <span className={"badge"}>{"Completed study"}</span>
              </span>
              <span className={"expand"} aria-hidden={"true"}>
                {"+"}
              </span>
            </summary>
            <p>
              {
                "Exploring how MySQL isolation levels and locks affect concurrent transactions and data consistency."
              }
            </p>
            <div className={"exploration-more"}>
              {
                "My contribution included the SERIALIZABLE baseline, explicit table-lock experiments, and report assembly. Final report and experiment diagrams to be added."
              }
            </div>
          </details>
          <details className={"exploration"}>
            <summary>
              <span className={"exploration-title"}>
                {"A quieter TV home screen"}
                <span className={"badge"}>{"Personal exploration"}</span>
              </span>
              <span className={"expand"} aria-hidden={"true"}>
                {"+"}
              </span>
            </summary>
            <p>
              {
                "An Android TV home experience with a cleaner clock, weather, wallpaper, and streaming-app layout for a Sony BRAVIA."
              }
            </p>
            <div className={"exploration-more"}>
              {
                "A personal customization project. Final completion status, repository, screenshots, and the precise scope of my modifications still need to be documented."
              }
            </div>
          </details>
          <details className={"exploration"}>
            <summary>
              <span className={"exploration-title"}>
                {"x86-64 assembly exercises"}
                <span className={"badge"}>{"Coursework"}</span>
              </span>
              <span className={"expand"} aria-hidden={"true"}>
                {"+"}
              </span>
            </summary>
            <p>
              {
                "A sliding-window sequence generator and signed 64-bit arithmetic, working with arrays, pointers, registers, and input validation."
              }
            </p>
            <div className={"exploration-more"}>
              {
                "Two coursework exercises: a sequence generator that sums a rolling window of earlier terms, and an A⁴ − B⁴ arithmetic program. Final sources and verified execution output to be added."
              }
            </div>
          </details>
        </div>
      </section>
      <section
        className={"section "}
        id={"education"}
        aria-labelledby={"education-title"}
      >
        <h2 id={"education-title"} className={"section-label"}>
          {"Education &"}
          <br />
          {"involvement"}
        </h2>
        <div className={"section-content"}>
          <article className={"experience"}>
            <div className={"entry-top"}>
              <h3>{"De La Salle University"}</h3>
              <span className={"date"}>{"Expected May 2028"}</span>
            </div>
            <p>{"BS Computer Science, major in Software Technology"}</p>
            <p className={"stack"}>{"3.67 / 4.00 GPA"}</p>
          </article>
          <article className={"experience"}>
            <h3>
              {"Center for Computational Imaging"}
              <br />
              {"and Visual Innovations"}
            </h3>
            <p className={"role"}>{"Student Researcher · CIVI, DLSU"}</p>
            <p>{"Exploring computational imaging and visual applications."}</p>
          </article>
          <article className={"experience"}>
            <div className={"entry-top"}>
              <h3>{"S.P.R.I.N.T."}</h3>
              <span className={"date"}>{"Sep 2025 — Sep 2026"}</span>
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
        id={"about"}
        aria-labelledby={"about-title"}
      >
        <h2 id={"about-title"} className={"section-label"}>
          {"A little about me"}
        </h2>
        <div className={"section-content"}>
          <p>
            {
              "I’m drawn to the point where a real-world problem becomes something you can build. Across client work and team projects, I’ve found that I enjoy figuring out how people do something today, where it becomes difficult, and what software could make easier."
            }
          </p>
          <p>
            {
              "That has taken me from recruitment workflows and contract management to a coffee storefront and an interactive art exhibit. I’m comfortable working through requirements with stakeholders, then staying involved as those decisions become a working product."
            }
          </p>
          <p>
            {
              "Outside technical work, I’ve helped organize student and church youth activities. Working with people from different backgrounds has shaped how I listen, communicate, and collaborate."
            }
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
          <h2 className={"contact-title"}>
            {"Let’s build"}
            <br />
            <em>{"something useful."}</em>
          </h2>
          <p>
            {
              "I’m interested in software engineering internships and collaborations where I can contribute to real products and keep growing as a developer."
            }
          </p>
          <div className={"contact-email"}>
            <a href={"mailto:gabespineli@gmail.com"}>
              {"gabespineli@gmail.com "}
              <span aria-hidden={"true"}>{"↗"}</span>
            </a>
            <button
              className={"copy-email"}
              type={"button"}
              aria-label={"Copy email address"}
              title={"Copy email address"}
            >
              <svg viewBox={"0 0 20 20"} aria-hidden={"true"}>
                <rect
                  x={"7"}
                  y={"7"}
                  width={"10"}
                  height={"10"}
                  rx={"2"}
                ></rect>
                <path d={"M12 7V3H3v9h4"}></path>
              </svg>
            </button>
          </div>
          <div className={"socials"}>
            <a
              href={"https://github.com/gabespineli"}
              target={"_blank"}
              rel={"noopener noreferrer"}
            >
              {"GitHub "}
              <span aria-hidden={"true"}>{"↗"}</span>
            </a>
            <a href={"/resume.html"}>
              {"Résumé "}
              <span aria-hidden={"true"}>{"↗"}</span>
            </a>
            <a
              href={"https://www.linkedin.com/in/josegespineli/"}
              target={"_blank"}
              rel={"noopener noreferrer"}
            >
              {"LinkedIn "}
              <span aria-hidden={"true"}>{"↗"}</span>
            </a>
          </div>
          <span
            id={"copy-status"}
            className={"copy-status"}
            role={"status"}
            aria-live={"polite"}
          ></span>
        </div>
      </section>
    </main>
  );
}
