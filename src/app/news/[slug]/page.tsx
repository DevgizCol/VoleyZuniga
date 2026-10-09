import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import ArticleCover from "@/components/ArticleCover";
import { getArticle, longDate } from "@/lib/news";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = await getArticle((await params).slug);
  if (!a) return { title: "Noticia no encontrada" };
  return { title: a.title, description: a.summary, openGraph: { title: a.title, description: a.summary, images: a.image ? [a.image] : undefined } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = await getArticle((await params).slug);
  if (!a) notFound();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const share = `https://wa.me/?text=${encodeURIComponent(`${a.title}\n${base}/news/${a.slug}`)}`;

  return (
    <article className="bg-[#071426] text-white">
      <header className="relative isolate overflow-hidden pt-40 sm:pt-44 pb-12">
        <div className="absolute inset-0 -z-10 opacity-40">
          <ArticleCover image={a.image} title={a.title} category={a.category} large id="article" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071426] via-[#071426]/80 to-[#071426]/40" />
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <Link href="/news" className="inline-flex items-center gap-2 text-sm text-[#C9D5E6] hover:text-white"><ArrowLeft size={16} /> Todas las noticias</Link>
          <p className="mt-6 text-[#F29A2E] font-semibold">{a.category} · {longDate(a.date)}</p>
          <h1 className="mt-3 font-heading font-black uppercase leading-[0.92] text-[clamp(2.6rem,9vw,5rem)]">{a.title}</h1>
          {a.summary ? <p className="mt-5 text-xl text-[#C9D5E6] leading-relaxed">{a.summary}</p> : null}
        </div>
      </header>
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl pb-24">
        <div className="court-rule mb-10" />
        <div className="space-y-5 text-lg text-[#DCE4EF] leading-[1.75]">
          {a.body.split(/\n{1,}/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <a href={share} target="_blank" rel="noopener noreferrer" className="mt-12 h-12 px-5 inline-flex items-center gap-2 rounded-md border border-[#25D366]/50 text-[#25D366] font-semibold hover:bg-[#25D366]/10">
          <MessageCircle size={18} /> Compartir por WhatsApp
        </a>
      </div>
    </article>
  );
}
