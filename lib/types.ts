export type Hero = {
  label: string;
  title1: string;
  title2: string;
  description: string;
  descriptionHighlight1: string;
  descriptionHighlight2: string;
  descriptionHighlight3: string;
  availability: string;
  isAvailable: boolean;
};

export type CurrentPosition = {
  role: string;
  company: string;
  period: string;
};

export type Job = {
  year: string;
  role: string;
  company: string;
  description: string;
  tech: string[];
};

export type Post = {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  url: string;
};

export type Social = {
  name: string;
  handle: string;
  url: string;
};

export type PageContent = {
  hero: Hero;
  locale: string;
  currently: CurrentPosition;
  focus: string[];
  work: {
    title: string;
    period: string;
    jobs: Job[];
  };
  thoughts: {
    title: string;
    posts: Post[];
  };
  connect: {
    title: string;
    description: string;
    email: string;
    socials: Social[];
  };
  footer: {
    copyright: string;
    builtWith: string;
  };
  whatsapp: {
    number: string;
    label: string;
  };
};
