import PortfolioClient from "./portfolio-client";
import { getPostBySlug } from "@/lib/mdx";
import { experiments } from "./data";

export const metadata = { title: "Portfolio — Arun Baburaj" };

const PERSPECTIVE_ORDER = [
  "specter-talent",
  "intent-driven-rental-search",
  "homehunter",
  "mymind",
  "dunzo-aov-optimization",
  "jupiter-app-gamification",
  "swiggy-bulk-delivery",
];

export default function PortfolioPage() {
  const perspectives = PERSPECTIVE_ORDER.flatMap((slug) => {
    const post = getPostBySlug(slug);
    if (!post) return [];
    return [{ slug, title: post.title, description: post.description }];
  });

  return <PortfolioClient perspectives={perspectives} experiments={experiments} />;
}
