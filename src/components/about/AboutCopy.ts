/**
 * AboutCopy — bilingual content for /[locale]/about.
 *
 * Authoring rule (see memory: feedback-arabic-native-authoring):
 *   English and Arabic are written on PARALLEL TRACKS from the same brand
 *   concept. The Arabic is NEVER a translation of the English. Each string
 *   should fail the "could this be a direct translation?" test.
 *
 * Saudi register (see memory: feedback-saudi-arabic-copy-strategy):
 *   - Hijazi warmth ("صنعة" not "إنتاج", "نصنعه لك" possessives)
 *   - Surah Al-Hadid echoes ("شدّة", "منفعة") — never the verse itself
 *   - Vision 2030 undertones ("المملكة")
 *   - Place-rooting (جدّة by name where natural)
 *   - Mono spec footers stay LTR even inside Arabic blocks
 */

export type AboutCopyShape = {
  meta: { title: string; description: string };
  hero: {
    headline: string;
    tagline: string;
    sinceLabel: string; // mono — stays LTR
  };
  story: {
    eyebrow: string;
    title: string;
    acts: Array<{
      number: string; // mono — LTR
      heading: string;
      body: string;
    }>;
  };
  process: {
    eyebrow: string;
    title: string;
    body: string;
    placeholderNote: string;
    durationMono: string; // mono — LTR
  };
  pillars: {
    eyebrow: string;
    title: string;
    items: Array<{
      name: string;
      lede: string;
      body: string;
      specFooter: string; // mono — LTR
    }>;
  };
  team: {
    eyebrow: string;
    title: string;
    intro: string;
    members: Array<{
      nameLatin: string;
      nameArabic: string;
      role: string; // mono — LTR even in AR (matches spec callout convention)
    }>;
  };
  closing: {
    headline: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
};

/**
 * English — written first as a brand-concept expression, not as a "source".
 * The Arabic file below is independently authored to the same concept.
 */
export const EN: AboutCopyShape = {
  meta: {
    title: "About — Steel Valley",
    description:
      "Twenty years of measured cuts. A Jeddah workshop building stainless steel for kitchens, hospitals, and hotels across the Kingdom.",
  },
  hero: {
    headline: "twenty years of measured cuts.",
    tagline:
      "we started with one bender, one welder, and a long line of restaurants that needed someone to listen.",
    sinceLabel: "SINCE 2005 · JEDDAH, KSA",
  },
  story: {
    eyebrow: "OUR STORY",
    title: "three acts, one workshop.",
    acts: [
      {
        number: "01",
        heading: "where we started",
        body: "A back-of-shop bench in 2005. One bender, one welder, a tape measure that had already lived a life. The first jobs were repairs — a dented hood here, a snapped rail there. We learned every kitchen in Jeddah by walking into them at four in the morning.",
      },
      {
        number: "02",
        heading: "what we learned",
        body: "Restaurants don't need salespeople. They need someone who shows up with a notebook, measures twice, and understands that a table out by three millimetres will haunt a line cook for a decade. We stopped quoting from photographs. We started quoting from rooms.",
      },
      {
        number: "03",
        heading: "what we build now",
        body: "Four service lines. Custom hand railing, polished column cladding, the kitchen equipment that runs hotel banquets, and decorative work for the lobbies above. Same workshop. Same measuring. The tape measure has lived several more lives.",
      },
    ],
  },
  process: {
    eyebrow: "ON THE FLOOR",
    title: "the work, unsentimentally.",
    body: "Welding, brushing, measuring. No music, no time-lapse tricks. A silent loop of the workshop, the way it actually sounds when the door closes.",
    placeholderNote:
      "process loop — silent 30s — welding, brushing, measuring",
    durationMono: "00:30 · NO AUDIO · LOOP",
  },
  pillars: {
    eyebrow: "WHAT HOLDS",
    title: "three pillars.",
    items: [
      {
        name: "craft",
        lede: "the hand still matters.",
        body: "Machines make our cuts repeatable. Hands make them honest. Every weld is laid by a fabricator whose name we know, whose work we have watched for years. We do not outsource the seam.",
        specFooter: "FABRICATORS · 14 · IN-HOUSE · 100%",
      },
      {
        name: "precision",
        lede: "measure twice. cut once. install never twice.",
        body: "Tolerances on a hospital sterilisation table are not the tolerances on a restaurant pass. We do not pretend they are. Each project gets the gauge, the finish, and the tolerance it actually needs.",
        specFooter: "TOLERANCE · ±0.5MM · TYP. ±0.2MM · CRITICAL",
      },
      {
        name: "endurance",
        lede: "built to outlast the lease.",
        body: "A commercial kitchen runs sixteen hours a day. A railing in a hotel lobby is touched by half a million hands a year. We build for the second decade, not the warranty period.",
        specFooter: "MATERIAL · SS 304 · SS 316L · ON REQUEST",
      },
    ],
  },
  team: {
    eyebrow: "THE FLOOR",
    title: "the people who measure.",
    intro:
      "Four of the fourteen. The rest you meet when you visit the workshop.",
    members: [
      {
        nameLatin: "Saleh Al-Harbi",
        nameArabic: "صالح الحربي",
        role: "FOUNDER · MASTER FABRICATOR",
      },
      {
        nameLatin: "Mohammed Al-Ghamdi",
        nameArabic: "محمد الغامدي",
        role: "WORKSHOP LEAD · WELDING",
      },
      {
        nameLatin: "Yasir Bin Salim",
        nameArabic: "ياسر بن سالم",
        role: "PROJECT MANAGER · KITCHENS",
      },
      {
        nameLatin: "Khalid Al-Subaie",
        nameArabic: "خالد السبيعي",
        role: "FINISHING · POLISH LEAD",
      },
    ],
  },
  closing: {
    headline: "tour the workshop.",
    body: "Most of our buyers come once, walk the floor, and meet the welder who will lay their seam. The door opens between 7am and 4pm.",
    ctaPrimary: "TALK TO A FABRICATOR",
    ctaSecondary: "SEE WHAT WE BUILD",
  },
};

/**
 * Arabic — authored natively from the SAME brand concept.
 * Hijazi register. Craft dignity. Place-rooting. Vision 2030 undertones.
 * Quranic echoes from Surah Al-Hadid ("شدّة", "منفعة") used as resonance, never quoted.
 *
 * Each string was written from the concept, not from the English line on the
 * same row. Word count, rhetorical structure, and the metaphors all differ
 * intentionally.
 */
export const AR: AboutCopyShape = {
  meta: {
    title: "عن الشركة — ستيل فالي",
    description:
      "ورشة جدّاوية، عشرون سنة من القياس الصبور. صنعة فولاذ تليق بمطابخ المملكة وفنادقها ومستشفياتها.",
  },
  hero: {
    // Not a translation. The English plays on "measured cuts" — a precision pun.
    // The Arabic anchors on patience-of-measurement (صبر القياس), a Hijazi craft virtue.
    headline: "عشرون عاماً من القياس الصبور.",
    tagline:
      "بدأنا بمنجدة واحدة، ولحّامٍ واحد، ومطاعمَ تبحث عمّن يصغي.",
    sinceLabel: "SINCE 2005 · JEDDAH, KSA",
  },
  story: {
    eyebrow: "حكايتنا",
    title: "ثلاثة فصول، ورشةٌ واحدة.",
    acts: [
      {
        number: "01",
        heading: "من أين بدأنا",
        body: "في زاوية ورشة، سنة 2005. منجدةٌ، ولحّامٌ، ومترٌ قاسَ ما قاس. أوّل الأعمال كانت ترميماً — شفّاطاً اعوجّ، أو دَرابزيناً انكسر. تعلّمنا مطابخ جدّة بالدخول إليها في الرابعة فجراً.",
      },
      {
        number: "02",
        heading: "ما تعلّمناه",
        body: "المطعم لا يحتاج بائعاً. يحتاج صانعاً يجيء بدفتره، يقيس مرّتين، ويعرف أنّ طاولةً تزيد ثلاثة مليمترات ستُتعِب الطبّاخ عشر سنين. كففنا عن التسعير من الصور، وبدأنا التسعير من المكان.",
      },
      {
        number: "03",
        heading: "ما نصنعه الآن",
        body: "أربعُ صناعات تحت سقفٍ واحد. درابزيناتٌ بالقياس، تكسياتُ أعمدةٍ مصقولة، تجهيزاتُ المطابخ التي تُشغّل أعراس الفنادق، وصناعةٌ تزيينيّةٌ تليق بالاستقبال. الورشةُ هي الورشة، والقياس هو القياس. والمترُ عاشَ أعماراً.",
      },
    ],
  },
  process: {
    eyebrow: "في الورشة",
    title: "الصنعة، بلا مونتاج.",
    // "بلا مونتاج" = no editing/no montage. Saudi B2B audiences read montage as marketing distrust.
    body: "لحامٌ، صَقلٌ، قياس. لا موسيقى، ولا تسريع. حلقةٌ صامتةٌ من الورشة، كما تبدو حين يُغلَق الباب.",
    placeholderNote: "حلقة الورشة — 30 ثانية صامتة — لحام وصقل وقياس",
    durationMono: "00:30 · NO AUDIO · LOOP",
  },
  pillars: {
    eyebrow: "ما يثبت",
    title: "ثلاثة أركان.",
    items: [
      {
        // "صنعة" carries artisan-respect; we lead the pillar with it.
        name: "الصنعة",
        lede: "اليدُ، لا تزال تُهمّ.",
        body: "الآلاتُ تجعل القطع متشابهاً، واليدُ تجعله صادقاً. كلُّ لُحامٍ في الورشة عرفناه باسمه، ورأينا عمله سنوات. لا نُحيلُ الدَّرزَ إلى غيرنا.",
        specFooter: "FABRICATORS · 14 · IN-HOUSE · 100%",
      },
      {
        name: "الدقّة",
        lede: "قِسْ مرّتين، اقطع مرّة، ركّبْ مرّة واحدة لا تتكرّر.",
        body: "ما يُسامحُه ممرّ مطعم، لا يُسامحه طاولةُ تعقيمٍ في مستشفى. كلُّ عملٍ يأخذُ سُمكَه وفينَه ومداهُ على مقاسِه، لا على مقاسٍ عام.",
        specFooter: "TOLERANCE · ±0.5MM · TYP. ±0.2MM · CRITICAL",
      },
      {
        // Surah Al-Hadid echo: "شدّة" + "منفعة" set side by side, no direct quotation.
        name: "الشدّة",
        lede: "نبني لما بعد العقد.",
        body: "المطبخُ التجاريّ يدورُ ستّ عشرةَ ساعة. درابزينُ الفندقِ تلمسُه نصف مليون يدٍ في السنة. نُتقنُ للعَقدِ الثاني، لا لمدّة الضّمان.",
        specFooter: "MATERIAL · SS 304 · SS 316L · ON REQUEST",
      },
    ],
  },
  team: {
    eyebrow: "أهلُ الورشة",
    title: "الذين يقيسون.",
    intro: "أربعةٌ من أربعةَ عشر. والبقيّةُ تلتقيهم حين تزور الورشة.",
    members: [
      {
        nameLatin: "Saleh Al-Harbi",
        nameArabic: "صالح الحربي",
        role: "FOUNDER · MASTER FABRICATOR",
      },
      {
        nameLatin: "Mohammed Al-Ghamdi",
        nameArabic: "محمد الغامدي",
        role: "WORKSHOP LEAD · WELDING",
      },
      {
        nameLatin: "Yasir Bin Salim",
        nameArabic: "ياسر بن سالم",
        role: "PROJECT MANAGER · KITCHENS",
      },
      {
        nameLatin: "Khalid Al-Subaie",
        nameArabic: "خالد السبيعي",
        role: "FINISHING · POLISH LEAD",
      },
    ],
  },
  closing: {
    // Not a translation. The CTA leans on Hijazi hospitality (تفضّل/تشرّفنا).
    headline: "تفضّل، زُر الورشة.",
    body: "أكثرُ مَن يطلبُ منّا يأتي مرّةً، يمشي على الأرض، ويلتقي اللحّامَ الذي سيدرز عمله. البابُ مفتوحٌ من السابعة صباحاً حتى الرابعة عصراً.",
    ctaPrimary: "كلّم صانعاً",
    ctaSecondary: "شوف ما نصنع",
  },
};

export function getAboutCopy(locale: string): AboutCopyShape {
  return locale === "ar" ? AR : EN;
}
