import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllSlugs, getPostBySlug } from "@/lib/mdx";
import { FadeIn } from "./perspective-content";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
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
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-white transition-colors"
        >
          ← Portfolio
        </Link>
      </FadeIn>

      <FadeIn delay={250} className="mt-8 mb-12">
        <h1 className="text-[26px] min-[480px]:text-[30px] font-medium leading-[1.2] tracking-[-0.015em] text-white [text-wrap:balance]">
          {post.title}
        </h1>
        <p className="mt-3 text-[17px] leading-[1.55] text-neutral-400 [text-wrap:pretty]">
          {post.description}
        </p>
      </FadeIn>

      {/* Styled by .essay in globals.css, not the typography plugin — see there. */}
      <FadeIn delay={400} className="essay">
        <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </FadeIn>
    </main>
  );
}
