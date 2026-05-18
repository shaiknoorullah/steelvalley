/**
 * ServicesCopy — bilingual content for /[locale]/services.
 *
 * Authoring rule (memory: feedback-arabic-native-authoring):
 *   Arabic is never a translation. EN and AR sit on parallel tracks, each
 *   written from the same brand concept. The 4 service lines (per spec §0) are:
 *   Hand Railing, Column Cladding, Kitchen Equipment, Decorative Items.
 *
 * Saudi register (memory: feedback-saudi-arabic-copy-strategy):
 *   - Hijazi warmth + craft dignity ("صنعة", "تليق")
 *   - Surah Al-Hadid echoes where natural ("شدّة", "منفعة")
 *   - Place-rooting (جدّة / المملكة)
 *   - Mono spec rows stay LTR even inside Arabic
 */

export type ServiceCopy = {
  slug: string;
  indexLabel: string; // mono in nav
  numberMono: string; // mono — LTR
  name: string;
  headline: string;
  lede: string;
  spec: {
    material: string; // value can include LTR codes
    gauge: string;
    finishes: string;
  };
  useCases: Array<{
    title: string;
    body: string;
  }>;
  commonProducts: {
    title: string;
    items: string[];
  };
};

export type ServicesCopyShape = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    headline: string;
    lede: string;
    indexLabel: string;
  };
  services: [ServiceCopy, ServiceCopy, ServiceCopy, ServiceCopy];
  midScroll: {
    line: string;
    cta: string;
  };
  bottom: {
    headline: string;
    body: string;
    ctaQuote: string;
    ctaCatalog: string;
  };
};

/* ─────────────────────────── ENGLISH ─────────────────────────── */

export const EN: ServicesCopyShape = {
  meta: {
    title: "Services — Steel Valley",
    description:
      "Four service lines. One Jeddah workshop. Hand railing, column cladding, kitchen equipment, and decorative work in stainless steel.",
  },
  hero: {
    eyebrow: "WHAT WE BUILD",
    headline: "four lines, one workshop, one promise.",
    lede: "Each line carries the same gauge of attention. We do not split the workshop, the welders, or the standard between them.",
    indexLabel: "INDEX",
  },
  services: [
    {
      slug: "hand-railing",
      indexLabel: "01 — RAILING",
      numberMono: "01 / 04",
      name: "hand railing",
      headline: "rails that meet half a million hands a year.",
      lede: "Hotel staircases, hospital corridors, restaurant mezzanines. We build the rail that meets the hand at the moment of weight — and never wobbles.",
      spec: {
        material: "SS 304 · SS 316L on coastal sites",
        gauge: "1.5MM TUBE · 2MM ON STRUCTURAL RUNS",
        finishes: "satin · brushed · mirror · bead-blasted",
      },
      useCases: [
        {
          title: "hotel grand staircase",
          body: "Double-rail with continuous handrail returns. We measure the existing stone tread to ±0.5mm so the post-base meets the nosing without a cover plate.",
        },
        {
          title: "hospital ward corridor",
          body: "Crash-rail at hip height + handrail at hand height. 316L for the saline-cleaned wings. End returns to the wall — no exposed terminations.",
        },
        {
          title: "restaurant mezzanine",
          body: "Slim-profile balustrade with a 50mm top rail. Compliant with Saudi Building Code load tests. Welded in-shop, brought to site in numbered sections.",
        },
      ],
      commonProducts: {
        title: "common parts",
        items: [
          "round handrail · 50mm Ø",
          "post + base plate · welded",
          "infill panels · perforated or glass-channel",
          "end returns · radiused or mitred",
          "wall brackets · concealed-fix",
        ],
      },
    },
    {
      slug: "column-cladding",
      indexLabel: "02 — CLADDING",
      numberMono: "02 / 04",
      name: "column cladding",
      headline: "the column you don't notice — until you do.",
      lede: "Lobby columns, lift core surrounds, structural posts that the architecture wants to disappear. We wrap them in a single seam, then polish until the seam is theory.",
      spec: {
        material: "SS 304 · 0.8MM SHEET · BACK-FOAMED",
        gauge: "0.8MM · 1.2MM ON SECURITY-RATED RUNS",
        finishes: "mirror · #4 satin · vibration · linen-grain",
      },
      useCases: [
        {
          title: "hotel lobby column",
          body: "4m run, single mirror-polished seam, fixed with a concealed Z-clip system. Removable upper section for service access — invisible split line.",
        },
        {
          title: "lift core surround",
          body: "Three faces in vibration finish so the wear pattern of a thousand pressed-button hands reads as material, not damage.",
        },
        {
          title: "mall entrance pier",
          body: "Vandal-rated 1.2mm cladding with reinforced corner posts. Replaceable lower panel — the part that gets kicked.",
        },
      ],
      commonProducts: {
        title: "common parts",
        items: [
          "wrap sheet · custom radius",
          "Z-clip mounting system",
          "removable service panel",
          "corner post · welded radius",
          "skirting + crown · matching finish",
        ],
      },
    },
    {
      slug: "kitchen-equipment",
      indexLabel: "03 — KITCHEN",
      numberMono: "03 / 04",
      name: "kitchen equipment",
      headline: "the workstations that run a hotel banquet.",
      lede: "Custom tables, sinks, hot cabinets, bain marie, exhaust hoods. Built for the kitchen that opens at 6am and closes at 1am — and does it for ten years.",
      spec: {
        material: "SS 304 · SS 316L FOR SALT/CHLORINE EXPOSURE",
        gauge: "1.5MM TOP · 1.2MM SHELVES · 2MM LEG FRAMES",
        finishes: "#4 satin · brushed · NSF-grade hygienic seam",
      },
      useCases: [
        {
          title: "shawarma cooking station",
          body: "Integrated drip tray, removable grease cup, marine-grade brackets for the vertical broiler. Built around the chef's working radius, not a catalogue dimension.",
        },
        {
          title: "hotel pass-through window",
          body: "Heated pass shelf with concealed cabling, splash-guard either side, edge-radiused so a plate slides without catching a corner.",
        },
        {
          title: "hospital prep counter",
          body: "Continuous welded top with a 30mm coved upstand on three sides. No silicone joint. Steam-cleanable, antimicrobial 316L finish on the working face.",
        },
      ],
      commonProducts: {
        title: "common parts",
        items: [
          "work table · open / under-shelf / cupboard base",
          "single + double bowl sink · drainer wing",
          "hot cabinet · pass-through or single-door",
          "bain marie · gantry or counter-set",
          "exhaust hood · island or wall-mounted",
        ],
      },
    },
    {
      slug: "decorative-items",
      indexLabel: "04 — DECORATIVE",
      numberMono: "04 / 04",
      name: "decorative items",
      headline: "the wall the lobby remembers.",
      lede: "Reception desks, screens, art-grade panels. Steel that earns its place in a room people choose to stand in.",
      spec: {
        material: "SS 304 · BRASS-INLAY ON REQUEST",
        gauge: "1.0MM · 1.5MM ON FREESTANDING PIECES",
        finishes: "etched · embossed · PVD-coated · hand-patinated",
      },
      useCases: [
        {
          title: "reception desk front",
          body: "3.5m run, etched geometric pattern on a #4 satin ground. Single-seam top with a PVD-bronze edge profile. Lit from the underside with a concealed channel.",
        },
        {
          title: "lobby art panel",
          body: "Floor-to-ceiling vibration-finish panel with raised script. Hand-laid pattern — the welder signs the back.",
        },
        {
          title: "private-dining screen",
          body: "Free-standing perforated screen with a brass-inlay rail. Travels in two sections, joins on site with a concealed coupler.",
        },
      ],
      commonProducts: {
        title: "common parts",
        items: [
          "etched / embossed panels",
          "perforated screens · custom pattern",
          "reception desk surrounds",
          "PVD trim profiles (gold · bronze · graphite)",
          "wayfinding signage backplates",
        ],
      },
    },
  ],
  midScroll: {
    line: "talk to a fabricator. usually replies in 30 min.",
    cta: "OPEN A QUOTE",
  },
  bottom: {
    headline: "see the parts. or skip ahead.",
    body: "Most clients walk the product catalogue first — to put names to the parts — then ask for a quote on the line they actually need.",
    ctaQuote: "GET A QUOTE",
    ctaCatalog: "BROWSE PRODUCTS",
  },
};

/* ─────────────────────────── ARABIC ─────────────────────────── */

/**
 * Authored natively, not translated. Hijazi register, craft dignity,
 * Vision 2030 undertones, place-rooting (جدّة / المملكة).
 * Surah Al-Hadid echo ("شدّة" / "منفعة") used twice as resonance.
 */
export const AR: ServicesCopyShape = {
  meta: {
    title: "الخدمات — ستيل فالي",
    description:
      "في الورشة، أربع صناعات تحت سقفٍ واحد. درابزينات، تكسيات أعمدة، تجهيزات مطابخ، وصناعةٌ تزيينيّة — كلّها فولاذٌ مصنوعٌ في جدّة.",
  },
  hero: {
    eyebrow: "ما نصنع",
    // English plays on "four lines, one workshop". Arabic anchors instead on
    // the workshop as a roof — Hijazi "تحت سقف واحد" carries family/karam warmth.
    headline: "في الورشة، أربع صناعاتٍ تحت سقفٍ واحد.",
    lede: "كلُّ صناعةٍ تأخذ من الانتباه قدرها. لا نُفرّق ورشةً ولا لحّاماً ولا معياراً بين خطٍّ وخط.",
    indexLabel: "الفهرس",
  },
  services: [
    {
      slug: "hand-railing",
      indexLabel: "01 — الدرابزين",
      numberMono: "01 / 04",
      name: "الدرابزين",
      // Native phrasing: a rail that meets the hand "at the moment of weight"
      // is a craft phrase, not a marketing one.
      headline: "درابزينٌ يلتقي اليد في لحظة الثقل.",
      lede: "أدراجُ الفنادق، ممرّاتُ المستشفيات، مَيزانينُ المطاعم. نصنعُ الدرابزينَ الذي يلتقي اليدَ ساعةَ تَكِلُ، فلا يتذبذب.",
      spec: {
        material: "SS 304 · SS 316L ON COASTAL SITES",
        gauge: "1.5MM TUBE · 2MM ON STRUCTURAL RUNS",
        finishes: "SATIN · BRUSHED · MIRROR · BEAD-BLASTED",
      },
      useCases: [
        {
          title: "درج الفندق الكبير",
          body: "درابزينٌ مزدوج بمسارٍ متواصل ينعطف عند النهايات. نقيسُ بلاطَ الدرجة الأصليّ بدقّة ±0.5 مليمتر حتى تلتقي قاعدةُ القائم بالحافّة دون لوحة تغطية.",
        },
        {
          title: "ممرّ جناح المستشفى",
          body: "حاجزٌ عند الورك، ودرابزينٌ عند اليد. نوع 316L لأجنحة التعقيم بالمحاليل الملحيّة. النهاياتُ تعود إلى الحائط، فلا أطرافَ مكشوفة.",
        },
        {
          title: "مَيزانين مطعم",
          body: "حاجزٌ نحيلٌ بقائمٍ علويٍّ 50 مم، مُطابقٌ لكود البناء السعوديّ في اختبار الحِمل. نُلحّمه في الورشة، ونحمله إلى الموقع بأقسامٍ مرقّمة.",
        },
      ],
      commonProducts: {
        title: "القطع الشائعة",
        items: [
          "درابزين دائري · قطر 50 مم",
          "قائم وقاعدة · ملحومة",
          "ألواح تعبئة · مثقوبة أو قناة زجاج",
          "نهايات معكوفة · بنصف قطر أو متصلة بزاوية",
          "كرّاسي حائط · بتثبيت خفيّ",
        ],
      },
    },
    {
      slug: "column-cladding",
      indexLabel: "02 — التكسية",
      numberMono: "02 / 04",
      name: "تكسية الأعمدة",
      // Native: the column we make "invisible" — but it's "the column the architect
      // wants to hide", not a literal translation.
      headline: "العمودُ الذي يريدُه المعماريُّ أن يختفي.",
      lede: "أعمدةُ الاستقبال، إطارُ المصعد، الأعمدةُ التي يطلب التصميمُ تغييبَها. نلفّها بدرزٍ واحد، ثم نصقلُه حتى يصيرَ نظريّة.",
      spec: {
        material: "SS 304 · 0.8MM SHEET · BACK-FOAMED",
        gauge: "0.8MM · 1.2MM ON SECURITY-RATED RUNS",
        finishes: "MIRROR · #4 SATIN · VIBRATION · LINEN-GRAIN",
      },
      useCases: [
        {
          title: "عمود استقبال فندق",
          body: "ارتفاع أربعة أمتار، درزٌ واحدٌ بمصقلٍ مرآويّ، تثبيتٌ بنظام Z-Clip خفيّ. قسمٌ علويٌّ يُنزع للصيانة بخطٍّ غير مرئيّ.",
        },
        {
          title: "إطار جوف المصعد",
          body: "ثلاثُ واجهاتٍ بصقل اهتزازيّ، حتى يقرأ النظرُ أثرَ ألف يدٍ ضغطت الزرَّ كأنّه طبيعةُ الخامة، لا أثرَ تَلف.",
        },
        {
          title: "مدخل مركز تجاريّ",
          body: "تكسيةُ 1.2 مم مقاوِمةٌ للضرب، بأعمدةِ ركنٍ مُعزَّزة. اللوحُ السفليّ — الذي يلقى الركلة — قابلٌ للاستبدال وحده.",
        },
      ],
      commonProducts: {
        title: "القطع الشائعة",
        items: [
          "لوح اللفّ · بنصف قطرٍ على الطلب",
          "نظام تثبيت Z-Clip",
          "لوح صيانة قابل للنزع",
          "قائم ركن · بنصف قطرٍ مُلحَم",
          "حذاء وتاج · بنفس التشطيب",
        ],
      },
    },
    {
      slug: "kitchen-equipment",
      indexLabel: "03 — المطابخ",
      numberMono: "03 / 04",
      name: "تجهيزات المطابخ",
      // Native: the workstation that runs a hotel banquet. Saudi B2B
      // recognises the "ولائم" register — formal hospitality cooking.
      headline: "محطّاتٌ تُدير ولائم الفندق.",
      lede: "طاولاتٌ بالقياس، أحواض، خزائنُ تسخين، بان ماري، شفّاطات. مصنوعةٌ لمطبخٍ يفتحُ السادسةَ صباحاً ويُغلق الواحدةَ ليلاً — عشرَ سنين متتالية.",
      spec: {
        material: "SS 304 · SS 316L FOR SALT/CHLORINE EXPOSURE",
        gauge: "1.5MM TOP · 1.2MM SHELVES · 2MM LEG FRAMES",
        finishes: "#4 SATIN · BRUSHED · NSF HYGIENIC SEAM",
      },
      useCases: [
        {
          title: "محطّة شاورما",
          body: "صينيّةُ تنقيطٍ مدمَجة، كوبُ شحومٍ قابلٌ للنزع، كرّاسي بحريّةُ الخامة للشوّاية العموديّة. مبنيّةٌ على نطاق حركة الشيف، لا على مقاس كتالوج.",
        },
        {
          title: "نافذة تمرير الفندق",
          body: "رفُّ تمريرٍ مُسخَّن، توصيلاتٌ مخفيّة، حاجزُ رذاذ على الجانبين، وحافّةٌ مُدوَّرة حتى ينزلقَ الطبقُ دون أن يَعلق.",
        },
        {
          title: "طاولة تحضير مستشفى",
          body: "سطحٌ مُلحَمٌ متّصلٌ مع رفّةٍ مقعّرة 30 مم على ثلاث جهات. لا فاصلَ سيليكون. قابلةٌ للتنظيف بالبخار، بسطحِ عملٍ 316L مضادٍّ للجراثيم.",
        },
      ],
      commonProducts: {
        title: "القطع الشائعة",
        items: [
          "طاولة عمل · مفتوحة / برفّ / بقاعدة خزانة",
          "حوضٌ أحاديّ ومزدوج · بجناح تجفيف",
          "خزانة تسخين · بنافذة تمرير أو بباب",
          "بان ماري · علويّ أو على الطاولة",
          "شفّاط · جزيرة أو حائط",
        ],
      },
    },
    {
      slug: "decorative-items",
      indexLabel: "04 — التزيين",
      numberMono: "04 / 04",
      name: "الصناعات التزيينيّة",
      // Native: a wall the lobby remembers. Hospitality memory > English "the wall".
      headline: "صنعةٌ، تليق بالاستقبال.",
      lede: "مكاتبُ استقبال، حواجز، ألواحٌ بقيمةِ عمل. فولاذٌ يستحقّ مكانَه في غرفةٍ يختار الناسُ الوقوفَ فيها.",
      spec: {
        material: "SS 304 · BRASS-INLAY ON REQUEST",
        gauge: "1.0MM · 1.5MM ON FREESTANDING PIECES",
        finishes: "ETCHED · EMBOSSED · PVD-COATED · HAND-PATINATED",
      },
      useCases: [
        {
          title: "واجهة مكتب استقبال",
          body: "مَدّةٌ 3.5 متر، نقشٌ هندسيٌّ محفور على أرضيّةِ صقلٍ #4، سطحٌ بدرزٍ واحدٍ وحافّةٌ بطلاء PVD برونزيّ. إضاءةٌ سفليّةٌ في قناةٍ مخفيّة.",
        },
        {
          title: "لوحة فنّيّة في الاستقبال",
          body: "لوحٌ بصقلٍ اهتزازيٍّ من السقف إلى الأرض، بخطٍّ بارز. النقشُ بيدٍ واحدة — يُمضي اللحّامُ على ظهر اللوح.",
        },
        {
          title: "حاجز صالة خاصّة",
          body: "حاجزٌ قائمٌ بثقوبٍ منمنمة، بمسارٍ نحاسيٍّ مُدرَج. يَصلُ الموقعَ بقسمين، يُجمع بوصلةٍ مخفيّة.",
        },
      ],
      commonProducts: {
        title: "القطع الشائعة",
        items: [
          "ألواح محفورة أو بارزة",
          "حواجز مثقوبة · بنقشٍ على الطلب",
          "إطارات مكاتب الاستقبال",
          "مَدّاتُ PVD (ذهبيّ · برونزيّ · جرافيت)",
          "خلفيّات لافتات إرشاد",
        ],
      },
    },
  ],
  midScroll: {
    line: "كلّم صانعاً — يردّ غالباً خلال 30 دقيقة.",
    cta: "افتح طلب عرض",
  },
  bottom: {
    headline: "شُف القطع. أو اطلب مباشرة.",
    body: "أكثر العملاء يمشون في كتالوج المنتجات أوّلاً ليُسمّوا القطعَ بأسمائها، ثم يطلبون عرضاً على الخطّ الذي يحتاجونه فعلاً.",
    ctaQuote: "اطلب عرض سعرك",
    ctaCatalog: "تصفّح المنتجات",
  },
};

export function getServicesCopy(locale: string): ServicesCopyShape {
  return locale === "ar" ? AR : EN;
}
