import type { PageContent } from "./types";

export const START_WORK_YEAR = 2019;
export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS_OF_EXPERIENCE = CURRENT_YEAR - START_WORK_YEAR;

export const page: PageContent = {
  hero: {
    label: `PORTFOLIO / ${CURRENT_YEAR}`,
    title1: "Willian",
    title2: "Leman",
    description:
      "I am a Software Engineer - Heavy Frontend, and I am really passionate with build creative things, build cool apps is my addiction, I work with ",
    descriptionHighlight1: "React",
    descriptionHighlight2: "Golang",
    descriptionHighlight3: "Node.",
    availability: "Available for work",
    isAvailable: true,
  },
  locale: "Brazil",
  currently: {
    role: "Frontend Developer",
    company: "@ Nortal - GeomagicalLabs",
    period: "2026 — Present",
  },
  focus: [
    "React",
    "TypeScript",
    "Golang",
    "AI automation",
    "Node.js",
    "Product Analytics",
    "Fullstack with Adonis.js",
    "Fullstack with Next.js dockerized",
  ],
  work: {
    title: "Selected Work",
    period: `${START_WORK_YEAR} — ${CURRENT_YEAR} - ${YEARS_OF_EXPERIENCE} years of experience`,
    jobs: [
      {
        year: "2026",
        role: "Senior Frontend Engineer",
        company: "Nortal - GeomagicalLabs",
        description: `Working on Geomagical Labs. Geomagical Labs is a US company based on San Francisco, California, but also has other offices abroad the globe. 

Geomagical Labs is a company inside Ikea umbrella, which is another company in America, and Geomagical was founded on the simple idea that our most personal space, our home, is often so hard to furnish. Focusing in developing mini experiences for the users based on product analytics (mixpanel) to increase activation and conversion rate of the platform.
`,
        tech: [
          "React",
          "TypeScript",
          "Javascript",
          "Mixpanel",
          "Astro",
          "Gatsby",
        ],
      },
      {
        year: "2024",
        role: "Frontend Engineer",
        company: "Spocket",
        description: `I have worked in the main application of the company (dropshipper app);
I helped increase basic performance issues in the platform, in the perceived performance as a whole.
The company has more small projects using next.js and vite react, I usually worked in some bugs and adjusts in those apps. However the main goal was to develop the main application.

- Developed new features and project with a high pressure environment (startup);
- Familiarity with SEO best practices and web performance optimization techniques; I had to maintain some SEO tags in the apps;
- Worked with Google tag manager to inject third parties scripts for trackings;
- Pixel perfect application in UI, worked direct with figma to implement the UI
- Built and maintained Shopify apps 
- Working in web vitals metrics for checkout pages and high data driven pages (both shopify apps and web apps) `,
        tech: ["React", "Node.js", "Javascript", "Shopify apps", "Remix"],
      },
      {
        year: "2021",
        role: "Frontend Developer",
        company: "Vanhack",
        description: `Working with ReactJS to build and maintain new features to the Vanhack platform.
The product is a platform to put together candidates and companies to help them get hire and be relocated or work remotely as soon as possible.

Now we are migrating from a legacy Webpack React application to a new Nextjs application using all the modern features such as SSR and ISR

We used Jira in our agile methods, kanban. the tasks included dealing with bugs in the legacy platform written in React used with webpack and a node.js layer for server-side. 

We started to migrate to Next.js, and we used SSR authentication and static site regeneration.
In the time I was in Vanhack I created a lot of interfaces,such as pages and components.
The chat page, the dashboard page, Rich editors components and learning hub page and more.`,
        tech: ["React", "Next.js", "Typescript"],
      },
      {
        year: "2019",
        role: "Fullstack Developer",
        company: "Viaflow",
        description: `Projects:

 - Internet Banking/AllInvestX: 
Development and maintenance of a crypto coin platform, for both versions, mobile and Web. Techs that I worked with: React.js, React Native, NodeJS .NET 3.1, Postgres, Redis, Azure and MaterialUI;
We used Azuredevops and Gitlab to handle all the code and git flow. We used Scrum as our main agile method.

In the time I work in here, I built a CLI lib for nodeJS, to help me out with my express.js api code;

I worked on an insurance and loans project creating interfaces, and dealing with reports exported to CSV files, we created an API for installments of customer insurance proposals and integrated this with Cielo's API, we also had to deal with PDF templates as well; techs we used SQL server, HTML, CSS and Javascript, and C#;
 
I worked in a Governament project in a company called Bem&Servicos;
I performed bug fixes, created new features interfaces using React, but I also had to deal with SQL Server and .NET core. 
Other tools:  Bitbucket, Kanban and Jira Atlassian.`,
        tech: ["React", ".NET", "SQL"],
      },
    ],
  },
  thoughts: {
    title: "Recent Thoughts",
    posts: [
      {
        title: "The Future of Web Development",
        excerpt:
          "Exploring how AI and automation are reshaping the way we build for the web.",
        date: "Dec 2024",
        readTime: "5 min",
        url: "#",
      },
      {
        title: "Design Systems at Scale",
        excerpt:
          "Lessons learned from building and maintaining design systems across multiple products.",
        date: "Nov 2024",
        readTime: "8 min",
        url: "#",
      },
      {
        title: "Performance-First Development",
        excerpt:
          "Why performance should be a first-class citizen in your development workflow.",
        date: "Oct 2024",
        readTime: "6 min",
        url: "#",
      },
      {
        title: "The Art of Code Review",
        excerpt:
          "Building better software through thoughtful and constructive code reviews.",
        date: "Sep 2024",
        readTime: "4 min",
        url: "#",
      },
    ],
  },
  connect: {
    title: "Let's Connect",
    description:
      "Always interested in new opportunities, collaborations, and conversations about technology and design.",
    email: "willianleman@gmail.com",
    socials: [
      {
        name: "GitHub",
        handle: "@willian-lemann",
        url: "https://github.com/willian-lemann",
      },
      {
        name: "LinkedIn",
        handle: "willian-lemann",
        url: "https://www.linkedin.com/in/willian-lemann/",
      },
      {
        name: "Twitter",
        handle: "@LemannWillian",
        url: "https://x.com/LemannWillian",
      },
      {
        name: "Instagram",
        handle: "@willianlemann",
        url: "https://www.instagram.com/willianlemann/",
      },
    ],
  },
  footer: {
    copyright: `© ${CURRENT_YEAR} Willian Leman. All rights reserved.`,
    builtWith: "Built with Love by Willian Leman",
  },
  whatsapp: {
    number: "5548991380360",
    label: "Contrate-me",
  },
};
