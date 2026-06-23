export type Perspective = {
  slug: string;
  title: string;
  description: string;
  body: string;
};

export type Experiment = {
  title: string;
  description: string;
  href: string;
};

export const perspectives: Perspective[] = [
  {
    slug: "specter-talent",
    title: "Specter Talent",
    description: "Building the founder discovery engine powering modern startup scouting.",
    body: "Add your writing about this project here.",
  },
  {
    slug: "intent-driven-rental-search",
    title: "Intent-Driven Rental Search",
    description: "Designed a semantic + agent-based search flow to reduce time-to-rent by removing filter overload.",
    body: "Add your writing about this project here.",
  },
  {
    slug: "homehunter",
    title: "HomeHunter",
    description: "Marketplace validation & scale decision.",
    body: "Add your writing about this project here.",
  },
  {
    slug: "mymind",
    title: "My Favourite Product: mymind",
    description: "Why this AI-powered extension changed how I think and create.",
    body: "Add your writing about this project here.",
  },
  {
    slug: "dunzo-aov-optimization",
    title: "Dunzo: AOV Optimization",
    description: "The Tale of Maximising Average Order Value.",
    body: "Add your writing about this project here.",
  },
  {
    slug: "jupiter-app-gamification",
    title: "Jupiter: App Gamification",
    description: "Incorporating game elements into a Neobank experience.",
    body: "Add your writing about this project here.",
  },
  {
    slug: "swiggy-bulk-delivery",
    title: "Swiggy: Bulk Delivery",
    description: "How to tackle multiple food orders from multiple restaurants.",
    body: "Add your writing about this project here.",
  },
];

export const experiments: Experiment[] = [
  { title: "Magic Internet Money",            description: "Real-time financial data visualization and mental models.",                                                                                             href: "https://btc.heyabc.xyz" },
  { title: "discovery/OS",                    description: "Market intelligence on emerging companies.",                                                                                                           href: "https://discoveryos.xyz" },
  { title: "Y Combinator Bot",                description: "Automates early startup discovery and reduces manual scanning.",                                                                                       href: "https://x.com/YCDiscoveryBot" },
  { title: "Voyager",                         description: "AI travel concierge.",                                                                                                                                 href: "https://travelgpt-sand.vercel.app" },
  { title: "Pokédex",                         description: "Digital Poké-companion. Gotta fetch 'em all.",                                                                                                        href: "https://pokedex-sigma-three-64.vercel.app" },
  { title: "xPay",                            description: "Prototype invoicing flow for Indian contractors billing US clients.",                                                                                   href: "https://xpay-prototype.vercel.app" },
  { title: "Cybrilla (KYC Debugger)",         description: "Internal dashboard prototype to debug and resolve KYC failures.",                                                                                      href: "https://kyc-debugger-v2.vercel.app" },
  { title: "Reflow",                          description: "AI-driven analysis of blocked communication to diagnose decision bottlenecks.",                                                                        href: "https://reflow-prototype.vercel.app" },
  { title: "Strategic Risk Intelligence",     description: "AI-powered screening to surface entity risks across news, legal, and regulatory databases.",                                                           href: "https://certa-risk-intel.vercel.app" },
  { title: "Draper",                          description: "Reverse-engineers successful social media ads to extract factors driving high impressions.",                                                            href: "https://draper-ai-engine.vercel.app" },
  { title: "ScopeX",                          description: "Cross-border payment prototype to automate recurring EU-to-India transactions.",                                                                       href: "https://scopex-web-app.vercel.app" },
  { title: "Polaroid",                        description: "Image-editing tool that transforms uploads into Polaroid-style photos.",                                                                               href: "https://polaroid-sand.vercel.app" },
  { title: "Mission Control v2.0",            description: "Venture operating system for portfolio management.",                                                                                                   href: "https://mission-control-rho-roan.vercel.app" },
  { title: "Helium Supply Intel Dashboard",   description: "Bengaluru supply acquisition heatmap for rental supply.",                                                                                             href: "https://helium-xi.vercel.app" },
  { title: "Helium Renter Flow",              description: "Renter onboarding flow prototype.",                                                                                                                   href: "https://heliumuserflow.vercel.app" },
  { title: "Uniblox SOC 2 Tracker",           description: "SOC 2 readiness tracker for B2B SaaS compliance.",                                                                                                    href: "https://unibloxsoc2.vercel.app" },
  { title: "Mint & Lily CS Agent",            description: "Two-tab CS agent and review intelligence dashboard.",                                                                                                  href: "https://mintandlily.vercel.app" },
  { title: "EquiParser",                      description: "Upload an ESOP grant letter and GPT-4o extracts 19 structured fields, checks SEBI compliance, and estimates Indian tax impact.",                      href: "https://equiparse.vercel.app" },
];
