import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllSlugs, getPostBySlug } from "@/lib/mdx";
import { FadeIn } from "./perspective-content";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return { title: post ? `${post.title} — Arun Baburaj` : "Not found" };
}

export default async function PerspectivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-[620px] px-6 pt-[72px] pb-20">
      <FadeIn delay={100}>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-[#1a1a1a] transition-colors"
        >
          ← Portfolio
        </Link>
      </FadeIn>

      <FadeIn delay={250} className="mt-6 mb-10">
        <h1 className="text-[19px] font-semibold leading-snug">{post.title}</h1>
        <p className="mt-1 text-sm text-neutral-400">{post.description}</p>
      </FadeIn>

      <FadeIn delay={400} className="prose prose-sm prose-neutral max-w-none">
        <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </FadeIn>
    </main>
  );
}
