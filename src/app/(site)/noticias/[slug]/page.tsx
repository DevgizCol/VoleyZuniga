import type { Metadata } from "next";
import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import ArticleCover from "@/components/ArticleCover";
import JsonLd from "@/components/JsonLd";
import { getArticle, longDate } from "@/lib/news";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = await getArticle((await params).slug);
  if (!a) return { title: "Noticia no encontrada" };
  return {
    title: a.title,
    description: a.summary,
    alternates: { canonical: `/noticias/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.summary, publishedTime: a.date },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = await getArticle((await params).slug);
  if (!a) notFound();
  const url = `${siteUrl}/noticias/${a.slug}`;
  const share = `https://wa.me/?text=${encodeURIComponent(`${a.title}\n${url}`)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.summary || undefined,
    datePublished: `${a.date}T12:00:00-05:00`,
    image: a.image ? [a.image] : [`${siteUrl}/opengraph-image`],
    mainEntityOfPage: url,
    author: { "@type": "SportsOrganization", name: "Club Voley Zúñiga", url: siteUrl },
    publisher: { "@type": "SportsOrganization", name: "Club Voley Zúñiga", logo: { "@type": "ImageObject", url: `${siteUrl}/logo-trim.png` } },
  };

  return (
    <article className="bg-[#071426] text-white">
      <JsonLd data={jsonLd} />
      <header className="relative isolate overflow-hidden pt-40 sm:pt-44 pb-12">
        <ViewTransition name={`news-${a.slug}`} share="morph" default="none">
          <div className="absolute inset-0 -z-10 opacity-40">
            <ArticleCover image={a.image} title={a.title} category={a.category} large id="article" />
          </div>
        </ViewTransition>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071426] via-[#071426]/80 to-[#071426]/40" />
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <Link href="/noticias" className="inline-flex items-center gap-2 text-sm text-[#C9D5E6] hover:text-white"><ArrowLeft size={16} /> Todas las noticias</Link>
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
