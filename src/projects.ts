export const projects = [
  {
    id: "out-of-body",
    name: "Out of Body",
    role: "Developer",
    category: "Interactive exhibit",
    status: "Exhibited",
    year: "2026",
    tag: "Latest project",
    cover: "body",
    metric: "100+",
    metricLabel: "exhibit participants",
    summary:
      "From a drawing on paper to a movement on screen. I collaborated with my cousin and her information design team to build an interactive exhibit experienced by over 100 people at Ateneo’s Areté.",
    intro: "A drawing becomes part of the experience.",
    problem:
      "The team’s interactive design concept needed a way for visitors to bring their own drawings into a shared exhibit. The software had to connect the experience on a participant’s phone with what happened on the installation screen.",
    contribution:
      "I developed the software connecting drawing capture, preview and upload with the exhibit display. A QR-based flow and participant queue helped move people from their phones into the installation, where browser-based pose tracking made their drawings respond to movement.",
    decisions: [
      "Connect the whole journey: paper, phone, shared display, and movement.",
      "Give participants a preview of their drawing before sending it to the exhibit.",
      "Use temporary artwork storage and keep camera processing in the browser.",
      "Provide a guided experience with positioning and tracking recovery.",
    ],
    result:
      "Over 100 people experienced the installation during a week-long exhibit at Ateneo’s Areté. The work was a collaboration with my cousin and her information design team; my contribution was bringing the interaction to life in software.",
    stack: [
      "Next.js",
      "TypeScript",
      "React",
      "Canvas",
      "MediaPipe",
      "Supabase",
      "Vercel",
    ],
    links: [["View repository", "https://github.com/gabespineli/out-of-body"]],
    pending: [
      "Exhibit photography and a short demonstration video",
      "Full collaborator credits and exact exhibit dates",
    ],
    note: "Illustrative cover · exhibit photograph to be added",
  },
  {
    id: "cleanhaul",
    name: "CleanHAUL",
    role: "Systems Developer",
    category: "Client & contract management",
    status: "In use",
    year: "2026 — ongoing",
    cover: "clean",
    metric: "503",
    metricLabel: "client records centralized",
    summary:
      "An Excel-based workflow, rebuilt around the people using it. I took a client and contract system through requirements, development, migration, and deployment, reducing recurring reporting from 30+ minutes to about one minute.",
    intro: "Less time in spreadsheets. More clarity at work.",
    problem:
      "Client records and contract information lived in an Excel-based workflow. Record access, ownership, renewal tracking, and recurring reports needed a more consistent process across 503 client records.",
    contribution:
      "I worked with the business to define requirements, then built and deployed a centralized system with role-based access, contract tracking, and reporting. I migrated historical records and continued refining the system with its two primary users after launch.",
    decisions: [
      "Make filtering and export directly support recurring reports.",
      "Automate renewal reminders around 60-day, 30-day, and overdue milestones.",
      "Preserve historical records during migration.",
      "Support multiple SCA validity periods when waste classes require different coverage.",
    ],
    result:
      "The system supports 503 client records and two primary users. Recurring report preparation dropped from over 30 minutes of manual Excel work to about one minute. Stabilization and user feedback continue to guide improvements.",
    stack: [
      "TypeScript",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "Resend",
      "Vercel",
    ],
    links: [
      ["View repository", "https://github.com/gabespineli/cleanhaul-contracts"],
    ],
    pending: [
      "Product screenshots using sample data",
      "User feedback from the stabilization period",
    ],
    note: "Illustrative cover · product screenshots to be added",
  },
  {
    id: "talentados",
    name: "Talentados",
    role: "Lead Analyst",
    category: "Asceoft recruitment system",
    status: "Completed",
    year: "May — August 2026",
    cover: "talent",
    metric: "3 of 12",
    metricLabel: "projects recognized for exceptional implementation",
    summary:
      "Making a fragmented recruitment process easier to follow. As lead analyst in a nine-person team, I shaped 20 user stories and the business rules behind a system recognized for Exceptional Implementation.",
    intro: "A clearer path from applicant to onboarding.",
    problem:
      "Asceoft’s recruitment workflow needed a centralized way to manage applicants, job approvals, interviews, contracts, and communications. The team needed a shared understanding of what the system should do and who should be able to see or change information.",
    contribution:
      "I served as lead analyst in a nine-person team working with the industry client. I developed 20 user stories with acceptance criteria, documented business rules and role-based information boundaries, and refined requirements through recurring client consultations.",
    decisions: [
      "Start with process problems before defining features.",
      "Make acceptance criteria specific enough for developers and QA to share.",
      "Define role boundaries alongside the workflow.",
      "Use client consultations and demonstrations to resolve ambiguity.",
    ],
    result:
      "The team’s project was one of three out of twelve recognized for Exceptional Implementation by an industry judging panel. My role centered on requirements, workflow design, and coordination with developers and QA.",
    stack: [
      "TypeScript",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Supabase",
      "Prisma",
      "JWT",
      "Passport",
      "Nodemailer",
      "Vitest",
      "Cypress",
    ],
    links: [["View repository", "https://github.com/Kermit-King/ASCEOFT_ATS"]],
    pending: ["Product screenshots and demo", "Team credits"],
    note: "Illustrative cover · recruitment screenshots to be added",
  },
  {
    id: "wtp-coffee",
    name: "WTP Coffee",
    role: "Shopify Developer",
    category: "Freelance storefront",
    status: "Launched",
    year: "March — May 2026",
    cover: "coffee",
    metric: "1,700+",
    metricLabel: "unique storefront visitors",
    summary:
      "A coffee shop’s online home for more than coffee. I built a Shopify storefront connecting products, reservations, and events, reaching 1,700+ unique visitors and generating purchases and event inquiries.",
    intro: "A storefront for coffee, community, and events.",
    problem:
      "WTP Coffee needed an online experience that could support product discovery and purchases alongside the café’s reservations, events, and inquiries.",
    contribution:
      "I built and launched a custom Shopify storefront using Liquid and JavaScript. The work covered product and collection pages, cart interactions, event pages, reservations, and inquiry flows, with content organized through collections, blogs, tags, and metafields.",
    decisions: [
      "Connect shopping and event discovery in one storefront.",
      "Use Shopify’s content structures to keep pages maintainable.",
      "Support reservations and inquiries alongside purchases.",
      "Automate lead routing and content presentation where useful.",
    ],
    result:
      "The launched storefront reached over 1,700 unique visitors and generated online purchases and event inquiries beyond the café’s immediate market. The visitor figure is from my latest résumé; the reporting period is still to be added.",
    stack: ["Shopify Dawn", "Liquid", "JavaScript", "CSS", "Shopify Flow"],
    links: [
      ["View repository", "https://github.com/gabespineli/wtp-coffee-shopify"],
    ],
    pending: [
      "Live storefront URL and product photography",
      "Analytics reporting period",
    ],
    note: "Illustrative cover · storefront screenshots to be added",
  },
];
export const explorations = [
  {
    name: "ArugaBai / ArugaVault",
    type: "In progress",
    description:
      "A team-built mobile care and medical-document experience. My work includes development setup, operations, mobile implementation, and an Android on-device OCR spike.",
    detail:
      "Exploring document capture and text recognition with Expo and React Native. The wider product remains in development; a current demo and a verified breakdown of my shipped contributions will be added.",
  },
  {
    name: "Sakila query optimization",
    type: "Academic study",
    description:
      "Four analytical queries, a larger synthetic dataset, and experiments with query reformulation and indexing in MySQL.",
    detail:
      "My work included query definition, baseline analysis, and the final narrative. Final report, repository, and verified benchmark table to be added.",
  },
  {
    name: "Transactions & locking",
    type: "Completed study",
    description:
      "Exploring how MySQL isolation levels and locks affect concurrent transactions and data consistency.",
    detail:
      "My contribution included the SERIALIZABLE baseline, explicit table-lock experiments, and report assembly. Final report and experiment diagrams to be added.",
  },
  {
    name: "A quieter TV home screen",
    type: "Personal exploration",
    description:
      "An Android TV home experience with a cleaner clock, weather, wallpaper, and streaming-app layout for a Sony BRAVIA.",
    detail:
      "A personal customization project. Final completion status, repository, screenshots, and the precise scope of my modifications still need to be documented.",
  },
  {
    name: "x86-64 assembly exercises",
    type: "Coursework",
    description:
      "A sliding-window sequence generator and signed 64-bit arithmetic, working with arrays, pointers, registers, and input validation.",
    detail:
      "Two coursework exercises: a sequence generator that sums a rolling window of earlier terms, and an A⁴ − B⁴ arithmetic program. Final sources and verified execution output to be added.",
  },
];
