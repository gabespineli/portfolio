import { Experience } from "./Experience";
export function Resume() {
  return (
    <main id={"main"} className={"resume"}>
      <div className={"resume-top"}>
        <a href={"/"}>{"← Back to portfolio"}</a>
        <button className={"print-button"} type={"button"}>
          {"Print / Save PDF"}
        </button>
      </div>
      <h1>{"Jose Gabriel G. Espineli"}</h1>
      <p className={"resume-contact"}>
        <a href={"mailto:gabespineli@gmail.com"}>{"gabespineli@gmail.com"}</a>
        {" · "}
        <a href={"https://github.com/gabespineli"}>
          {"github.com/gabespineli"}
        </a>
        {" · "}
        <a href={"https://www.linkedin.com/in/josegespineli/"}>{"LinkedIn"}</a>
      </p>
      <h2>{"Education"}</h2>
      <h3>{"De La Salle University"}</h3>
      <p>
        {
          "BS Computer Science, major in Software Technology · Expected May 2028"
        }
        <br />
        {"GPA: 3.67 / 4.00"}
      </p>
      <h2>{"Experience"}</h2>
      <Experience />
      <h2>{"Selected project"}</h2>
      <h3>{"Out of Body · Developer"}</h3>
      <p>
        {
          "Developed an interactive exhibit connecting phone-based drawing capture and upload with a shared display and browser-based pose tracking. Experienced by 100+ participants during a week-long exhibit at Ateneo’s Areté."
        }
      </p>
      <h2>{"Activities"}</h2>
      <p>
        {"CIVI · Student Researcher"}
        <br />
        {
          "S.P.R.I.N.T. · Associate Vice President, Socio-Civic Committee · Sep 2025–Sep 2026"
        }
      </p>
      <h2>{"Skills"}</h2>
      <p>
        {"TypeScript, JavaScript, Python, SQL, Liquid, HTML, CSS"}
        <br />
        {
          "React, Next.js, Shopify, Supabase, Vercel, Resend, PostgreSQL, MySQL, Git"
        }
        <br />
        {
          "Requirements engineering, systems analysis, RBAC, database design, deployment, data migration"
        }
      </p>
    </main>
  );
}
