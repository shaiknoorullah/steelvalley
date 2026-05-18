import { Link } from "@/ds/components";
import { PageShell } from "@/components/page-chrome/PageShell";
import { type Post, POST_CATEGORY_LABELS } from "@/lib/data/stub-posts";

type Locale = "en" | "ar";

const READ_LABEL: Record<Locale, string> = {
  en: "MIN READ",
  ar: "دقائق قراءة",
};

const CTA: Record<Locale, { title: string; body: string; action: string }> = {
  en: {
    title: "Working on a kitchen that deserves this kind of attention?",
    body: "Tell us about it. We will reply within one working day with measured questions and a meeting time.",
    action: "Talk to us",
  },
  ar: {
    title: "تشتغل على مطبخ يستاهل هذا المستوى من الاهتمام؟",
    body: "احكي لنا عنه. نرد عليك خلال يوم عمل بأسئلة مدروسة وموعد لقاء.",
    action: "تواصل معنا",
  },
};

function formatDate(iso: string, locale: Locale) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export interface BlogPostProps {
  locale: Locale;
  post: Post;
}

export function BlogPost({ locale, post }: BlogPostProps) {
  const c = post.copy[locale];

  return (
    <PageShell locale={locale}>
      <article data-post-article>
        <header data-post-header>
          <div data-post-meta>
            <span>{POST_CATEGORY_LABELS[post.category][locale]}</span>
            <span>·</span>
            <span>{formatDate(post.date, locale)}</span>
            <span>·</span>
            <span>
              {post.readingTimeMin} {READ_LABEL[locale]}
            </span>
          </div>
          <h1 data-post-title>{c.title}</h1>
          <p data-post-lead>{c.lead}</p>
        </header>

        <figure data-post-hero>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.heroImage} alt="" />
        </figure>

        <div data-post-body>
          {c.body.map((block, i) => {
            switch (block.kind) {
              case "subhead":
                return <h2 key={i}>{block.text}</h2>;
              case "pullquote":
                return (
                  <blockquote key={i} data-post-pullquote>
                    {block.text}
                  </blockquote>
                );
              case "caption":
                return (
                  <p
                    key={i}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      opacity: 0.65,
                    }}
                  >
                    {block.text}
                  </p>
                );
              case "paragraph":
              default:
                return <p key={i}>{block.text}</p>;
            }
          })}
        </div>

        <aside data-post-cta>
          <p>{CTA[locale].title}</p>
          <p style={{ opacity: 0.85 }}>{CTA[locale].body}</p>
          <Link href="/#quote" variant="cta">
            {CTA[locale].action} →
          </Link>
        </aside>
      </article>
    </PageShell>
  );
}
