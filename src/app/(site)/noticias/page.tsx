import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import PageHero from "@/components/PageHero";
import ArticleCover from "@/components/ArticleCover";
import { getSettings } from "@/lib/content";
import { getArticles, longDate } from "@/lib/news";

export const metadata: Metadata = pageMeta({
  title: "Noticias",
  path: "/noticias",
  description: "Crónicas, convocatorias y novedades del Club Voley Zúñiga.",
});

export const revalidate = 300;

export default async function NewsPage() {
  const [articles, { contact }] = await Promise.all([getArticles(), getSettings()]);
  const [featured, ...rest] = articles;

  return (
    <>
      <PageHero art="ball" photo={featured?.image || undefined} kicker="Novedades del club" title="Noticias" intro="Crónicas de partidos, convocatorias y lo que pasa en el club." />
      <section className="bg-[#071426] text-white pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6">
          {!featured ? (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F2347] to-[#071426] p-8 sm:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <h2 className="font-heading font-black uppercase text-4xl sm:text-5xl leading-none">Pronto, las primeras noticias</h2>
                <p className="mt-4 text-[#C9D5E6] text-lg max-w-xl">Mientras preparamos las crónicas, el día a día del club se publica en Instagram.</p>
              </div>
              <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="h-12 px-6 inline-flex items-center gap-2 bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold rounded-md">
                <Camera size={18} /> Seguir {contact.instagramHandle}
              </a>
            </div>
          ) : (
            <>
              <Link href={`/noticias/${featured.slug}`} className="group grid lg:grid-cols-2 rounded-2xl overflow-hidden border border-white/10 bg-[#0B1E38] hover:border-[#F29A2E]/50 transition-colors">
                {/* La portada "vuela" a su lugar al abrir la noticia */}
                <ViewTransition name={`news-${featured.slug}`} share="morph" default="none">
                  <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[380px]">
                    <ArticleCover image={featured.image} title={featured.title} category={featured.category} large id="featured" />
                  </div>
                </ViewTransition>
                <div className="p-7 sm:p-10 flex flex-col">
                  <p className="text-sm font-semibold text-[#F29A2E]">{featured.category} · {longDate(featured.date)}</p>
                  <h2 className="font-heading font-black uppercase text-4xl sm:text-5xl leading-[0.95] mt-3 group-hover:text-[#FFB14A] transition-colors">{featured.title}</h2>
                  <p className="mt-4 text-[#C9D5E6] text-lg leading-relaxed">{featured.summary}</p>
                  <span className="mt-auto pt-8 inline-flex items-center gap-2 font-semibold text-[#F29A2E]">Leer noticia <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></span>
                </div>
              </Link>

              {rest.length > 0 && (
                <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal-stagger">
                  {rest.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/noticias/${a.slug}`} className="group h-full flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#0B1E38] hover:border-[#F29A2E]/50 transition-colors">
                        <ViewTransition name={`news-${a.slug}`} share="morph" default="none">
                          <div className="relative aspect-[16/10]">
                            <ArticleCover image={a.image} title={a.title} category={a.category} id={a.slug} />
                          </div>
                        </ViewTransition>
                        <div className="p-6 flex flex-col flex-1">
                          <p className="text-sm font-semibold text-[#F29A2E]">{a.category} · {longDate(a.date)}</p>
                          <h3 className="font-heading font-extrabold text-2xl leading-tight mt-2 group-hover:text-[#FFB14A] transition-colors">{a.title}</h3>
                          <p className="mt-2 text-[#B7C4D8] line-clamp-3">{a.summary}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
