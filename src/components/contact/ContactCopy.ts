/**
 * ContactCopy — bilingual content for /[locale]/contact.
 *
 * Authoring rule (memory: feedback-arabic-native-authoring):
 *   Arabic is not a translation. Each string is authored from the same
 *   brand concept, taking different rhetorical paths.
 *
 * Saudi register (memory: feedback-saudi-arabic-copy-strategy):
 *   - Hijazi warmth ("نقيس المكان معك" — measure-the-space-with-you).
 *   - Saudi B2B possessive CTA ("اطلب عرض سعرك").
 *   - Place-rooting (جدّة by name) + Vision 2030 undertone (المملكة).
 *   - Mono labels and numerals stay LTR even inside Arabic.
 */

export type ContactCopyShape = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    headline: string;
    lede: string;
  };
  quoteBuilder: {
    sectionLabel: string;
    placeholderHeading: string;
    placeholderBody: string;
    placeholderMono: string; // mono — LTR
  };
  map: {
    sectionLabel: string;
    cityLine: string;
    districtLine: string;
    workshopMono: string; // mono — LTR
  };
  alt: {
    sectionLabel: string;
    title: string;
    intro: string;
    methods: {
      whatsapp: { label: string; value: string; href: string };
      phone: { label: string; value: string; href: string };
      email: { label: string; value: string; href: string };
    };
    hours: {
      label: string;
      value: string; // mono — LTR
    };
  };
};

/* ─────────────────────────── ENGLISH ─────────────────────────── */

export const EN: ContactCopyShape = {
  meta: {
    title: "Contact — Steel Valley",
    description:
      "Quote in 30 minutes, by a Jeddah fabricator. WhatsApp, phone, email, and a workshop door that opens 7am to 4pm.",
  },
  hero: {
    eyebrow: "GET IN TOUCH",
    headline: "let's measure the space.",
    lede: "We quote from the room, not from a photograph. Tell us where, what, and when — we will tell you what it costs to do it once, and well.",
  },
  quoteBuilder: {
    sectionLabel: "QUOTE BUILDER · 06 STEPS",
    placeholderHeading: "the multi-step quote builder mounts here.",
    placeholderBody:
      "Project type → scope → dimensions → budget → timeline → contact. Each step is its own URL hash. Built in parallel; orchestrator swaps this stub on merge.",
    placeholderMono: "STATUS · PENDING MERGE · feat-conversion",
  },
  map: {
    sectionLabel: "WORKSHOP",
    cityLine: "Jeddah, Saudi Arabia",
    districtLine: "Industrial district · door opens 7am",
    workshopMono: "21.4858° N · 39.1925° E",
  },
  alt: {
    sectionLabel: "OR REACH US DIRECTLY",
    title: "three faster lines.",
    intro:
      "If you already know what you want, skip the form. A fabricator will answer — usually inside thirty minutes.",
    methods: {
      whatsapp: {
        label: "WHATSAPP",
        value: "+966 5X XXX XXXX",
        href: "https://wa.me/9665XXXXXXXX",
      },
      phone: {
        label: "PHONE",
        value: "+966 12 XXX XXXX",
        href: "tel:+96612XXXXXXX",
      },
      email: {
        label: "EMAIL",
        value: "hello@steelvalley.sa",
        href: "mailto:hello@steelvalley.sa",
      },
    },
    hours: {
      label: "WORKSHOP HOURS",
      value: "SAT–THU · 07:00–16:00 · AST",
    },
  },
};

/* ─────────────────────────── ARABIC ─────────────────────────── */

export const AR: ContactCopyShape = {
  meta: {
    title: "تواصل معنا — ستيل فالي",
    description:
      "عرض سعر خلال نصف ساعة من ورشةٍ في جدّة. واتساب، هاتف، بريد، وبابُ ورشةٍ يفتحُ من السابعة صباحاً.",
  },
  hero: {
    eyebrow: "تواصل",
    // Native: "we measure the space with you" — Hijazi craft-with-you cadence,
    // not a translation of "let's measure the space".
    headline: "نقيسُ المكان، معك.",
    lede: "نُسعّرُ من الغرفة، لا من الصورة. قلْ لنا أين، وماذا، ومتى — ونقولُ لك كم تُكلِّفُ صنعتُها مرّةً واحدةً، صحيحة.",
  },
  quoteBuilder: {
    sectionLabel: "نموذج عرض السعر · 06 خطوات",
    placeholderHeading: "نموذجُ العرض المُتعدِّد الخطوات يحلُّ هنا.",
    placeholderBody:
      "نوع المشروع → النطاق → القياسات → الميزانيّة → التوقيت → التواصل. كلُّ خطوةٍ على عنوانٍ مستقلّ. نَبنيه على التوازي؛ يُستبدَلُ هذا الحاجز عند الدمج.",
    placeholderMono: "STATUS · PENDING MERGE · feat-conversion",
  },
  map: {
    sectionLabel: "الورشة",
    cityLine: "جدّة، المملكة العربيّة السعوديّة",
    districtLine: "الحيُّ الصناعيّ · البابُ يفتحُ السابعة صباحاً",
    workshopMono: "21.4858° N · 39.1925° E",
  },
  alt: {
    sectionLabel: "أو تواصلْ مباشرة",
    title: "ثلاثُ طرقٍ أسرع.",
    intro: "إن كنتَ تعرفُ ما تريد، اترك النموذج. يردُّ صانعٌ غالباً خلال نصف ساعة.",
    methods: {
      whatsapp: {
        label: "WHATSAPP",
        value: "+966 5X XXX XXXX",
        href: "https://wa.me/9665XXXXXXXX",
      },
      phone: {
        label: "PHONE",
        value: "+966 12 XXX XXXX",
        href: "tel:+96612XXXXXXX",
      },
      email: {
        label: "EMAIL",
        value: "hello@steelvalley.sa",
        href: "mailto:hello@steelvalley.sa",
      },
    },
    hours: {
      label: "WORKSHOP HOURS",
      value: "SAT–THU · 07:00–16:00 · AST",
    },
  },
};

export function getContactCopy(locale: string): ContactCopyShape {
  return locale === "ar" ? AR : EN;
}
