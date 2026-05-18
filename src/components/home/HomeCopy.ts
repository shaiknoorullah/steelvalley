/**
 * Home page copy — independent English + Arabic tracks.
 *
 * Arabic is hand-authored, NEVER a translation. Uses the Saudi copy strategy:
 * Hijazi register, Surah Al-Hadid echoes (shidda, manfa'a), craft dignity
 * (sun'a not intaaj), possessive warmth in CTAs, place-rooting (Jeddah,
 * the Kingdom). See memory feedback-saudi-arabic-copy-strategy.
 */

export type Locale = "ar" | "en";

interface HomeCopyShape {
  capabilities: {
    eyebrow: string;
    headline: string;
    lede: string;
    cards: {
      slug: string;
      title: string;
      blurb: string;
      mono: string;
      href: string;
    }[];
  };
  process: {
    eyebrow: string;
    headline: string;
    steps: { n: string; title: string; body: string }[];
  };
  trust: {
    eyebrow: string;
    headline: string;
    logos: { name: string; mono: string }[];
  };
  featuredCase: {
    eyebrow: string;
    headline: string;
    body: string;
    specs: { label: string; value: string }[];
    ctaLabel: string;
  };
  leadMagnet: {
    eyebrow: string;
    headline: string;
    body: string;
    cta: string;
  };
  footer: {
    anthem: string;
    address: string;
    phone: string;
    email: string;
    columns: { heading: string; links: { label: string; href: string }[] }[];
    legal: string;
  };
}

const EN: HomeCopyShape = {
  capabilities: {
    eyebrow: "capabilities · 04",
    headline: "four lines. one workshop.",
    lede:
      "Every job leaves our floor measured twice and cut once. Stainless steel, 304 or 316 — your choice.",
    cards: [
      {
        slug: "hand-railing",
        title: "hand railing",
        blurb:
          "Stair flights, ramp guards, mezzanine edges. Hospitals trust the bracket count.",
        mono: "SS 304 · Ø50 · 1.5mm",
        href: "/services#hand-railing",
      },
      {
        slug: "column-cladding",
        title: "column cladding",
        blurb:
          "Hotel lobbies, airport halls, mall atriums. Brushed, mirror, or bead-blasted.",
        mono: "SS 304 · #4 / #8 · 1.2mm",
        href: "/services#column-cladding",
      },
      {
        slug: "kitchen-equipment",
        title: "kitchen equipment",
        blurb:
          "Workstations, sinks, hoods, hot cabinets, bain marie. The Jeddah F&B sector trusts our welds.",
        mono: "SS 304 · 1.2–2.0mm",
        href: "/services#kitchen-equipment",
      },
      {
        slug: "decorative",
        title: "decorative",
        blurb:
          "Signage, feature walls, screen panels. Where the metal becomes the design.",
        mono: "SS 304 / brass · custom",
        href: "/services#decorative",
      },
    ],
  },
  process: {
    eyebrow: "process · 06",
    headline: "from drawing to install.",
    steps: [
      {
        n: "01",
        title: "consult",
        body: "We listen first. Your kitchen, your floor, your constraints.",
      },
      {
        n: "02",
        title: "measure",
        body: "On-site survey. Twice. The first measurement is a question.",
      },
      {
        n: "03",
        title: "cut",
        body: "Laser, shear, plasma. Tolerances tighter than your tile grid.",
      },
      {
        n: "04",
        title: "weld",
        body: "TIG on every visible seam. The weld is the promise.",
      },
      {
        n: "05",
        title: "finish",
        body: "Brushed, mirror, or bead-blasted. To the brief, never beyond it.",
      },
      {
        n: "06",
        title: "install",
        body: "Our team on-site. Service stays seamless. You serve dinner tonight.",
      },
    ],
  },
  trust: {
    eyebrow: "served · 20+ years",
    headline: "the kitchens that feed Jeddah.",
    logos: [
      { name: "Hilton Jeddah", mono: "banquet kitchen · 2022" },
      { name: "Al Andalus Mall", mono: "food court · 2023" },
      { name: "KAUST Hospital", mono: "sterile prep · 2021" },
      { name: "Mövenpick Resort", mono: "all-day kitchen · 2024" },
      { name: "Sheraton Jeddah", mono: "room-service kitchen · 2020" },
      { name: "Park Hyatt", mono: "tea kitchen · 2024" },
    ],
  },
  featuredCase: {
    eyebrow: "place · the work",
    headline: "12 stations. 9 days. one Hilton.",
    body:
      "The Hilton Jeddah banquet kitchen needed to serve 600 covers by Eid. We delivered 12 cooking stations, 2 bain-marie walls, and 36m of hand railing — installed, tested, signed off — with three days to spare. The chef's first plate left the pass on time.",
    specs: [
      { label: "stations", value: "12" },
      { label: "rail", value: "36 m" },
      { label: "gauge", value: "1.5 mm" },
      { label: "build", value: "9 days" },
      { label: "finish", value: "#4 brushed" },
    ],
    ctaLabel: "let us build your edge",
  },
  leadMagnet: {
    eyebrow: "for chefs + procurement",
    headline: "the kitchen buyer's guide.",
    body:
      "Twenty years of lessons from Jeddah's top restaurants — what to specify, what to skip, what your fabricator will never tell you. Free, bilingual PDF.",
    cta: "send me the guide",
  },
  footer: {
    anthem: "we shape steel into spaces that feed cities.",
    address: "industrial dist. · Jeddah · Kingdom of Saudi Arabia",
    phone: "+966 12 000 0000",
    email: "hello@steelvalley.sa",
    columns: [
      {
        heading: "site",
        links: [
          { label: "home", href: "/" },
          { label: "about", href: "/about" },
          { label: "services", href: "/services" },
          { label: "products", href: "/products" },
          { label: "journal", href: "/blog" },
          { label: "contact", href: "/contact" },
        ],
      },
      {
        heading: "services",
        links: [
          { label: "hand railing", href: "/services#hand-railing" },
          { label: "column cladding", href: "/services#column-cladding" },
          { label: "kitchen equipment", href: "/services#kitchen-equipment" },
          { label: "decorative", href: "/services#decorative" },
        ],
      },
      {
        heading: "legal",
        links: [
          { label: "privacy policy", href: "/legal/privacy" },
          { label: "terms of service", href: "/legal/terms" },
        ],
      },
    ],
    legal: "© 2026 Steel Valley. Made in Jeddah — since 2005.",
  },
};

const AR: HomeCopyShape = {
  capabilities: {
    eyebrow: "أربع صناعات · ٠٤",
    headline: "في الورشة، صنعةٌ واحدة، وأربع لغات للحديد.",
    lede:
      "نقيس مرّتين، ونقطع مرّةً واحدة. حديد ٣٠٤ أو ٣١٦ المقاوم للصدأ — حسب الحاجة.",
    cards: [
      {
        slug: "hand-railing",
        title: "الدرابزينات",
        blurb:
          "للسلالم، للمنحدرات، لحواف الميزانين. المستشفيات تعدّ المسامير معنا.",
        mono: "SS 304 · Ø50 · 1.5mm",
        href: "/services#hand-railing",
      },
      {
        slug: "column-cladding",
        title: "تكسية الأعمدة",
        blurb:
          "ردهات الفنادق، صالات المطارات، أبهاء المراكز التجارية. تشطيب مفروَش أو مرآة أو حبيبات.",
        mono: "SS 304 · #4 / #8 · 1.2mm",
        href: "/services#column-cladding",
      },
      {
        slug: "kitchen-equipment",
        title: "تجهيزات المطابخ",
        blurb:
          "طاولات عمل، أحواض، مداخن، خزائن ساخنة، بانماري. مطابخ جدّة تعرف لُحاماتنا.",
        mono: "SS 304 · 1.2–2.0mm",
        href: "/services#kitchen-equipment",
      },
      {
        slug: "decorative",
        title: "الديكورات",
        blurb:
          "اللوحات، الحوائط المعدنية، الفواصل. حين يصبح الفولاذ هو التصميم نفسه.",
        mono: "SS 304 / نحاس · حسب الطلب",
        href: "/services#decorative",
      },
    ],
  },
  process: {
    eyebrow: "الصناعة · ٠٦ خطوات",
    headline: "من الرسم إلى التركيب.",
    steps: [
      {
        n: "٠١",
        title: "نسمع",
        body: "نسمع أولاً. مطبخك، طابقك، قيودك — كلّها تُروى.",
      },
      {
        n: "٠٢",
        title: "نقيس",
        body: "مسحٌ في الموقع. مرّتين. القياس الأول سؤالٌ، والثاني جواب.",
      },
      {
        n: "٠٣",
        title: "نقطع",
        body: "ليزر، قصّ، بلازما. تسامحٌ أدقّ من شقوق البلاط.",
      },
      {
        n: "٠٤",
        title: "نلحم",
        body: "تيج على كلّ لُحامٍ ظاهر. اللُّحام هو الوعد.",
      },
      {
        n: "٠٥",
        title: "نشطّب",
        body: "مفروَش أو مرآة أو حبيبات. على قدر المطلوب، لا أكثر.",
      },
      {
        n: "٠٦",
        title: "نركّب",
        body: "فريقنا في الموقع. الخدمة لا تتوقّف. تقدّم العشاء في وقته.",
      },
    ],
  },
  trust: {
    eyebrow: "خدمناهم · أكثر من ٢٠ عاماً",
    headline: "المطابخ التي تُطعم جدّة.",
    logos: [
      { name: "هيلتون جدّة", mono: "مطبخ ضيافة · ٢٠٢٢" },
      { name: "الأندلس مول", mono: "ركن طعام · ٢٠٢٣" },
      { name: "مستشفى كاوست", mono: "تحضير معقّم · ٢٠٢١" },
      { name: "موڤنبيك ريزورت", mono: "مطبخ كامل اليوم · ٢٠٢٤" },
      { name: "شيراتون جدّة", mono: "مطبخ خدمة الغرف · ٢٠٢٠" },
      { name: "بارك حياة", mono: "مطبخ الشاي · ٢٠٢٤" },
    ],
  },
  featuredCase: {
    eyebrow: "المكان · العمل",
    headline: "اثنتا عشرة محطّة. تسعة أيام. هيلتون واحد.",
    body:
      "مطبخ هيلتون جدّة للضيافة احتاج خدمة ٦٠٠ صنف بحلول العيد. سلّمنا اثنتي عشرة محطّة طبخ، وحائطَي بانماري، و٣٦ متراً من الدرابزين — مركّبٌ ومجرَّب ومسلَّم — قبل الموعد بثلاثة أيام. أوّل طبقٍ خرج من الشيف في وقته تماماً.",
    specs: [
      { label: "محطّات", value: "12" },
      { label: "درابزين", value: "36 m" },
      { label: "سُمك", value: "1.5 mm" },
      { label: "صناعة", value: "9 days" },
      { label: "تشطيب", value: "#4 brushed" },
    ],
    ctaLabel: "اطلب عرض سعرك",
  },
  leadMagnet: {
    eyebrow: "للطهاة والمشترين",
    headline: "دليل المُشتري للمطبخ التجاري.",
    body:
      "عشرون عاماً من الدروس من أعرق مطاعم جدّة — ما تطلبه في المواصفات، وما تتركه، وما لن يُخبرك به المُصنّع. مجاناً، بلُغتَين.",
    cta: "أرسلوا لي الدليل",
  },
  footer: {
    anthem: "حديد جدّة، يُطعم المملكة.",
    address: "حي الصناعية · جدّة · المملكة العربية السعودية",
    phone: "+966 12 000 0000",
    email: "hello@steelvalley.sa",
    columns: [
      {
        heading: "الموقع",
        links: [
          { label: "الرئيسية", href: "/" },
          { label: "عنّا", href: "/about" },
          { label: "الخدمات", href: "/services" },
          { label: "المنتجات", href: "/products" },
          { label: "المجلّة", href: "/blog" },
          { label: "تواصل", href: "/contact" },
        ],
      },
      {
        heading: "الخدمات",
        links: [
          { label: "الدرابزينات", href: "/services#hand-railing" },
          { label: "تكسية الأعمدة", href: "/services#column-cladding" },
          { label: "تجهيزات المطابخ", href: "/services#kitchen-equipment" },
          { label: "الديكورات", href: "/services#decorative" },
        ],
      },
      {
        heading: "الشؤون القانونية",
        links: [
          { label: "سياسة الخصوصية", href: "/legal/privacy" },
          { label: "شروط الاستخدام", href: "/legal/terms" },
        ],
      },
    ],
    legal: "© ٢٠٢٦ ستيل فالي. صُنع في جدّة — منذ ٢٠٠٥.",
  },
};

export function getHomeCopy(locale: string): HomeCopyShape {
  return locale === "ar" ? AR : EN;
}
