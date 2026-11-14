import { TechnologyStack, type Technology } from "./TechnologyStack";
const experiences: {
  name: string;
  logo: string;
  date: string;
  role: string;
  summary: string;
  technologies: Technology[];
}[] = [
  {
    name: "CleanHAUL",
    logo: "/logos/cleanhaul.webp",
    date: "July 2026 to Present",
    role: "Systems Developer",
    summary:
      "Own the delivery and continued improvement of a client and contract management system, from workflow analysis through production support.",
    technologies: ["TypeScript", "React", "Next.js", "Tailwind", "Supabase"],
  },
  {
    name: "Asceoft",
    logo: "/logos/asceoft.webp",
    date: "May to August 2026",
    role: "Lead Analyst \u00b7 Industry client project",
    summary:
      "Led requirements analysis and backlog definition for a recruitment system developed by a nine-person team.",
    technologies: ["TypeScript", "Next.js", "Express", "Prisma", "Supabase"],
  },
  {
    name: "WTP Coffee",
    logo: "/logos/wtp-coffee.webp",
    date: "March to May 2026",
    role: "Freelance Shopify Developer",
    summary:
      "Built and launched a custom storefront supporting commerce, reservations, and event inquiries.",
    technologies: ["Liquid", "JavaScript", "CSS", "Shopify"],
  },
];
export function Experience() {
  return experiences.map((entry) => (
    <article
      key={entry.name}
      className="experience experience-with-stack"
      tabIndex={0}
      aria-label={entry.name}
    >
      <div className="entry-top">
        <h3>
          <img
            className="company-logo"
            src={entry.logo}
            loading="lazy"
            decoding="async"
            alt=""
            width="25"
            height="25"
          />
          {entry.name}
        </h3>
        <span className="date">{entry.date}</span>
      </div>
      <p className="role">{entry.role}</p>
      <p>{entry.summary}</p>
      <TechnologyStack technologies={entry.technologies} />
    </article>
  ));
}
