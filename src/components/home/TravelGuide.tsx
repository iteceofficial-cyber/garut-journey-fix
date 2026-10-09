import { Link } from '@tanstack/react-router'
import { ArrowRight, PenSquare, Sparkles } from 'lucide-react'
import { Img } from '@/components/Img'
import { Reveal, SectionHeading } from '@/components/Reveal'
import { formatDate } from '@/data/articles'
import { useArticles } from '@/lib/articlesStorage'
import { useLanguage } from '@/lib/i18n'

export function TravelGuide() {
  const { articles: list } = useArticles()
  const { t } = useLanguage()
  const [lead, ...rest] = list.length > 0 ? list : []

  if (!lead) return null

  return (
    <section id="guide" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <SectionHeading
            eyebrow={t.guide.eyebrow}
            title={t.guide.title}
            intro={t.guide.intro}
          />
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 self-start rounded-full border border-forest/20 bg-forest/5 px-4 py-2 text-xs font-semibold text-forest transition hover:bg-forest hover:text-white"
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span>{t.guide.adminCmsBtn}</span>
          </Link>
        </div>

        <Reveal className="mt-14">
          <article className="group relative grid overflow-hidden rounded-[2rem] bg-white shadow-soft lg:grid-cols-2">
            <div className="aspect-[16/10] overflow-hidden lg:aspect-auto">
              <Img
                file={lead.image}
                alt={lead.title}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover transition duration-[1.2s] group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-ember">{lead.category}</span>
                <span className="flex items-center gap-1 rounded-full bg-ember/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-ember">
                  <Sparkles className="h-3 w-3" /> {t.guide.featured}
                </span>
              </div>
              <h3 className="font-display mt-3 text-3xl sm:text-4xl">{lead.title}</h3>
              <p className="mt-3 text-sm text-ink/50">
                <time dateTime={lead.date}>{formatDate(lead.date)}</time> · {lead.readingTime}
              </p>
              <p className="mt-4 leading-relaxed text-ink/70">{lead.excerpt}</p>
              <Link
                to="/guide/$slug"
                params={{ slug: lead.slug }}
                className="mt-6 inline-flex items-center gap-2 font-semibold text-forest after:absolute after:inset-0 after:content-['']"
              >
                {t.guide.readMore} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        </Reveal>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 60}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift">
                <div className="aspect-[4/3] overflow-hidden">
                  <Img
                    file={a.image}
                    alt={a.title}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    width={600}
                    className="h-full w-full object-cover transition duration-[1.2s] group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ember">{a.category}</p>
                  <h3 className="font-display mt-2 text-lg leading-snug line-clamp-2">{a.title}</h3>
                  <p className="mt-2 text-xs text-ink/50">
                    <time dateTime={a.date}>{formatDate(a.date)}</time> · {a.readingTime}
                  </p>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/65">{a.excerpt}</p>
                  <Link
                    to="/guide/$slug"
                    params={{ slug: a.slug }}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest after:absolute after:inset-0 after:content-['']"
                  >
                    {t.guide.readMore} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
