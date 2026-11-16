/**
 * All portfolio copy lives here so the presentation layer can change
 * without touching the actual content. Everything below is carried over
 * unchanged from the previous version of the site.
 */

export const PROFILE = {
  name: "Dawood Ahmed",
  role: "Full Stack Developer",
  location: "Rawalpindi / Islamabad",
  timeZone: "Asia/Karachi",
  heroIntro:
    "I build full stack web apps, from database to interface, with the PERN and MERN stacks.",
  bio: "I work front to back, from schema to pixels. PERN and MERN stacks, shipped end to end.",
  headline: ["Front end.", "Back end.", "Everything", "Between."],
  specs: [
    ["Status", "In development"],
    ["Mode", "Build / Debug / Repeat"],
    ["Format", "Human.exe"],
  ] as const,
};

export const NAV = [
  { label: "About", id: "about" },
  { label: "Stack", id: "stack" },
  { label: "Work", id: "work" },
  { label: "Contact", id: "contact" },
] as const;

export const SKILL_GROUPS = [
  { label: "Frontend", items: ["React", "GSAP", "Next.js", "TypeScript"] },
  { label: "Backend", items: ["Node.js", "GraphQL"] },
  { label: "Data & Infra", items: ["PostgreSQL", "Docker", "AWS"] },
] as const;

export type Project = {
  title: string;
  stack: string;
  href: string;
  image?: string;
};

export const PROJECTS: Project[] = [
  { title: "Business Dashboard", stack: "Next.js · Node · MongoDB", href: "#" },
  { title: "Streaming App", stack: "React · PostgreSQL · NEONDB", href: "#" },
];

export const CONTACT = {
  email: "gfxwork66@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/Dawood-Ahmed19" },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/dawood-ahmed-911742275",
    },
  ],
};
