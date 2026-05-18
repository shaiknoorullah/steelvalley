/**
 * STUB_POSTS — temporary editorial fixture used until Payload has live posts.
 *
 * Each post has EN + AR authored independently. The body is plain Markdown-ish
 * text rendered with a tiny client-side splitter (paragraphs + pullquotes).
 */

export type PostCategory = "craft" | "kitchens" | "field-notes" | "studio";

export interface PostBlock {
  kind: "paragraph" | "pullquote" | "subhead" | "caption";
  text: string;
}

export interface PostCopy {
  title: string;
  excerpt: string;
  lead: string;
  body: PostBlock[];
}

export interface Post {
  slug: string;
  category: PostCategory;
  /** ISO date — used for sort + mono date stamp. */
  date: string;
  /** Reading time in minutes — mono callout on cards + detail header. */
  readingTimeMin: number;
  heroImage: string;
  copy: { en: PostCopy; ar: PostCopy };
}

const placeholder = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'><rect width='1600' height='900' fill='#0a0a0b'/><g fill='none' stroke='#c7cdd6' stroke-width='1' opacity='0.4'><line x1='0' y1='450' x2='1600' y2='450'/><line x1='800' y1='0' x2='800' y2='900'/></g><text x='800' y='460' text-anchor='middle' font-family='JetBrains Mono, monospace' font-size='18' fill='#f2f0ec' letter-spacing='4'>${label}</text></svg>`,
  )}`;

export const POST_CATEGORY_LABELS: Record<
  PostCategory,
  { en: string; ar: string }
> = {
  craft: { en: "Craft", ar: "صنعة" },
  kitchens: { en: "Kitchens", ar: "مطابخ" },
  "field-notes": { en: "Field Notes", ar: "من الميدان" },
  studio: { en: "Studio", ar: "المرسم" },
};

export const POST_CATEGORY_ORDER: PostCategory[] = [
  "craft",
  "kitchens",
  "field-notes",
  "studio",
];

export const STUB_POSTS: Post[] = [
  {
    slug: "first-post",
    category: "craft",
    date: "2026-04-12",
    readingTimeMin: 6,
    heroImage: placeholder("STUDIO · WELD · 01"),
    copy: {
      en: {
        title: "On the seam you cannot see",
        excerpt:
          "Why we grind every weld smooth, even on a sink panel no chef will ever inspect.",
        lead: "A weld is honest. Two pieces of steel become one only if the welder makes them one — and then only if the grinder finishes the work the welder started.",
        body: [
          {
            kind: "paragraph",
            text: "Every shop in Jeddah will tell you they brush their welds. Most don't. Most run a quick pass with a flap disc, leave the discolouration where the heat licked the metal, and ship the piece. It looks done. From three metres away, it is done.",
          },
          {
            kind: "paragraph",
            text: "But the chef who runs his thumb along the edge at handover — he knows. And the inspector who shines a torch across the inside of a coved corner — she knows. And the deep-cleaner who finds salt water trapped in the unground bead, six months in, when the sink starts to weep brown — he knows too.",
          },
          {
            kind: "pullquote",
            text: "A weld grinder is the slowest tool in our shop. We refuse to make him faster.",
          },
          {
            kind: "subhead",
            text: "The discipline behind the finish",
          },
          {
            kind: "paragraph",
            text: "Our weld grinders run three passes minimum. Coarse to bring the bead flush. Medium to take out the grinder marks. Fine to bring the brushed grain back. By the end, you can't find the seam with your fingertip. You can't find it with a magnet. You can't find it with an inspector's loupe.",
          },
          {
            kind: "paragraph",
            text: "This is what costs us a week on every banquet kitchen we ship. We have argued with ourselves about it for years. We have not stopped doing it.",
          },
        ],
      },
      ar: {
        title: "اللحام اللي ما تشوفه",
        excerpt:
          "ليش نبرد كل لحام للنهاية، حتى لو في جنب مغسلة ما راح يتفقده شيف ولا مفتش.",
        lead: "اللحام صادق. قطعتين من الإستانلس ما يصيران واحد إلا لو اللحّام جعلهم واحد — وبعدها، ما يصدّق العين إلا لو المبرد كمّل اللي بدأه اللحّام.",
        body: [
          {
            kind: "paragraph",
            text: "كل ورشة في جدة تقول إنها تبرد اللحامات. الأغلب ما يفعلون. الأغلب يضرب ضربة سريعة بقرص الفلاب، يخلي لون الحرارة على المعدن، ويسلّم القطعة. تبيّن خالصة. من بعد ثلاث أمتار، خالصة فعلًا.",
          },
          {
            kind: "paragraph",
            text: "بس الشيف اللي يمرّ إصبعه على الحافة ساعة الاستلام — يعرف. والمفتش اللي يضوّي بكشاف على زاوية مقعّرة من جوّا — تعرف. وعامل التنظيف العميق اللي يلقى ماء مالح حبس في اللحام بعد ستة أشهر، لمّا تبدأ المغسلة تنزّ صدأ بنّي — يعرف هو كمان.",
          },
          {
            kind: "pullquote",
            text: "مبرّد اللحام أبطأ آلة في ورشتنا. ورافضين نسرّعه.",
          },
          {
            kind: "subhead",
            text: "الانضباط وراء التشطيب",
          },
          {
            kind: "paragraph",
            text: "مبرّدينا يشتغلون ثلاث مرّات أقل تقدير. خشن عشان ينزل اللحام لسطح القطعة. متوسط عشان يشيل أثر المبرد الأول. ناعم عشان يرجع الفروش الأصلي. وفي الأخير، ما تلقى الخط بإصبعك. ولا بمغناطيس. ولا بعدسة مفتش.",
          },
          {
            kind: "paragraph",
            text: "هذي الصنعة تكلّفنا أسبوع زيادة على كل مطبخ قاعة نسلّمه. تجادلنا مع نفسنا فيها سنين. ما وقفنا.",
          },
        ],
      },
    },
  },
  {
    slug: "the-saudi-kitchen-line",
    category: "kitchens",
    date: "2026-03-28",
    readingTimeMin: 8,
    heroImage: placeholder("KITCHEN · LINE · JEDDAH"),
    copy: {
      en: {
        title: "What a Saudi kitchen line actually looks like at 9pm",
        excerpt:
          "Banquet service in Jeddah is not banquet service in London. The equipment has to know that.",
        lead: "A Riyadh wedding seats two thousand. A Jeddah corporate iftar plates eight hundred in under ninety minutes. The line that holds is the one designed for the city it stands in.",
        body: [
          {
            kind: "paragraph",
            text: "Walk into a hotel kitchen in Saudi Arabia at peak service and you will see a workflow that does not exist in the catalogues. Stations doubled up. Salamanders running in parallel. Mise overflowing onto undershelves that were never meant to hold it. The equipment was ordered against a Western capacity sheet — and the line is plating against a Saudi one.",
          },
          {
            kind: "subhead",
            text: "Design for the city, not the catalogue",
          },
          {
            kind: "paragraph",
            text: "Our prep tables are deeper than the European default because Saudi mise stacks higher. Our hoods are wider because the line cooks here work shoulder-to-shoulder during service. Our sinks have a third bay because the pot wash never catches up.",
          },
          {
            kind: "pullquote",
            text: "If the catalogue spec fits your kitchen, your kitchen is not doing Saudi numbers.",
          },
          {
            kind: "paragraph",
            text: "This is not a complaint about imports. The Germans build beautiful steel. But beauty calibrated for a Munich brigade is not the same as beauty calibrated for a Jeddah pre-Ramadan iftar at the Hilton.",
          },
        ],
      },
      ar: {
        title: "كيف يبيّن خط المطبخ السعودي الساعة تسع مساء",
        excerpt:
          "خدمة القاعات في جدة مو خدمة القاعات في لندن. والتجهيزات لازم تعرف هالشي.",
        lead: "عرس في الرياض، ألفين كرسي. إفطار شركات في جدة، ثمنميّة طبق في أقل من تسعين دقيقة. الخط اللي يصمد هو اللي مصمم على المدينة اللي يقف فيها.",
        body: [
          {
            kind: "paragraph",
            text: "اطلع على مطبخ فندق في السعودية وقت الذروة، وراح تشوف خط شغل ما يبيّن في الكتالوجات. محطات مضاعفة. سلامندرز يشتغلون بالتوازي. مكوّنات تطفح على الرفوف السفلية اللي ما اتصممت تشيلها. التجهيزات اتطلبت على ورقة سعة أوروبية — والخط يقدّم على سعة سعودية.",
          },
          {
            kind: "subhead",
            text: "صمّم على المدينة، لا على الكتالوج",
          },
          {
            kind: "paragraph",
            text: "طاولات التحضير عندنا أعمق من الافتراضي الأوروبي عشان المكوّنات السعودية تنرص أعلى. مداخننا أعرض عشان الطبّاخين يشتغلون كتف بكتف وقت الخدمة. مغاسلنا فيها حوض ثالث عشان غسيل الحلل ما يلحق على الخط أبدًا.",
          },
          {
            kind: "pullquote",
            text: "إذا مقاسات الكتالوج زبطت على مطبخك، يعني مطبخك ما يشتغل أرقام سعودية.",
          },
          {
            kind: "paragraph",
            text: "هذا مو تذمّر من الاستيراد. الألمان يصنعون إستانلس جميل. بس الجمال المعاير على فرقة ميونخ مو نفس الجمال المعاير على إفطار رمضان في هلتون جدة.",
          },
        ],
      },
    },
  },
  {
    slug: "thickness-matters",
    category: "craft",
    date: "2026-03-04",
    readingTimeMin: 5,
    heroImage: placeholder("DETAIL · GAUGE · CALIPER"),
    copy: {
      en: {
        title: "Why gauge is not negotiable",
        excerpt:
          "0.8mm sheet looks identical to 1.5mm on the showroom floor. It does not behave the same on year three.",
        lead: "The fastest way to cheapen a stainless table is to drop the gauge. Most buyers cannot tell from a photo. Every chef can tell from the first lean.",
      body: [
          {
            kind: "paragraph",
            text: "There is a quiet decision that happens in a lot of stainless shops, and it happens before a single sheet is cut. The buyer asks for a price. The fabricator asks themselves how to win it. The cheapest answer is to drop the sheet thickness from 1.5mm to 0.8mm and trust that the buyer will not measure.",
          },
          {
            kind: "paragraph",
            text: "It is, mathematically, almost half the steel. It is, structurally, a different table. A 1.5mm top under a forty-litre stock pot does not flex. A 0.8mm top under the same pot bows visibly. Bow once and the welds at the leg joint start to fatigue. Fatigue a year and the leg cracks.",
          },
          {
            kind: "pullquote",
            text: "Half the steel is half the table. There is no version of this maths that works.",
          },
          {
            kind: "paragraph",
            text: "We do not quote against 0.8mm. We will not match a price built on it. This is the single most expensive principle we hold, and it is the one we will never give up.",
          },
        ],
      },
      ar: {
        title: "السماكة ما تتفاوض عليها",
        excerpt:
          "ورق ٠٫٨ ملم يبيّن نفس ورق ١٫٥ ملم في المعرض. بس ما يتصرف نفسه في السنة الثالثة.",
        lead: "أسرع طريقة ترخّص بها طاولة إستانلس، تنزّل السماكة. أغلب المشترين ما يميّزون من الصورة. كل شيف يميّز من أول استناد.",
        body: [
          {
            kind: "paragraph",
            text: "في قرار ساكت يصير في كثير من ورش الإستانلس، وهو قبل ما تنقص ورقة وحدة. المشتري يسأل عن السعر. المصنّع يسأل نفسه كيف يكسبه. أرخص جواب: ينزّل سماكة الورق من ١٫٥ ملم إلى ٠٫٨ ملم، ويعتمد إن المشتري ما راح يقيس.",
          },
          {
            kind: "paragraph",
            text: "هذا، حسابيًا، نص الإستانلس تقريبًا. وهذا، إنشائيًا، طاولة ثانية. سطح ١٫٥ ملم تحت قدر مرق أربعين لتر ما ينحني. سطح ٠٫٨ ملم تحت نفس القدر ينحني بالعين المجردة. ينحني مرّة، تبدأ اللحامات عند الرجل تتعب. تتعب سنة، الرجل تتشقق.",
          },
          {
            kind: "pullquote",
            text: "نص الإستانلس نص الطاولة. ما في رواية لهالحسبة تصلح.",
          },
          {
            kind: "paragraph",
            text: "ما نقدّم سعر على ٠٫٨ ملم. وما نطابق سعر مبني عليه. هذا أغلى مبدأ نحتفظ فيه، وهو اللي ما راح نتنازل عنه.",
          },
        ],
      },
    },
  },
  {
    slug: "site-survey-jeddah",
    category: "field-notes",
    date: "2026-02-15",
    readingTimeMin: 4,
    heroImage: placeholder("SITE · SURVEY · JEDDAH"),
    copy: {
      en: {
        title: "What we measure on a site survey",
        excerpt:
          "Drawings lie. Walls are never plumb. Doors always shrink. Here is what we actually do on day one.",
        lead: "Every install we lose money on, we lost the moment the site survey went short.",
        body: [
          {
            kind: "paragraph",
            text: "We measure walls top, middle, bottom — never assume they are parallel. We measure door openings at three heights. We trace the floor for level across the longest run, not just at the corners. We photograph every drain, every gas point, every electrical junction.",
          },
          {
            kind: "paragraph",
            text: "Then we do it again with the second engineer. Then we sign it off together. The cost of a return trip to fix a 4mm error is higher than the cost of three engineers standing in a kitchen for an extra hour.",
          },
          {
            kind: "pullquote",
            text: "Doors never come back the size the drawing claimed.",
          },
        ],
      },
      ar: {
        title: "إيش نقيس في معاينة الموقع",
        excerpt: "المخططات تكذب. الجدران ما هي مستوية. الأبواب دايمًا تضيق. هذا اللي نسوّيه فعلًا في أول يوم.",
        lead: "كل تركيب خسرنا فيه فلوس، خسرناه من اللحظة اللي قصّرنا فيها بالمعاينة.",
        body: [
          {
            kind: "paragraph",
            text: "نقيس الجدار فوق، وسط، تحت — ما نفترض إنه مستوي. نقيس فتحات الأبواب على ثلاثة ارتفاعات. نتتبّع الأرض على أطول مسافة، مو بس على الزوايا. نصوّر كل تصريف، كل نقطة غاز، كل علبة كهرباء.",
          },
          {
            kind: "paragraph",
            text: "بعدها نعيدها مع المهندس الثاني. وبعدها نوقّع سوا. تكلفة رجعة تصليح خطأ أربع ملم، أعلى من تكلفة ثلاث مهندسين واقفين في مطبخ ساعة زيادة.",
          },
          {
            kind: "pullquote",
            text: "الأبواب أبدًا ما تطلع نفس المقاس اللي قاله المخطط.",
          },
        ],
      },
    },
  },
  {
    slug: "studio-notes-2026",
    category: "studio",
    date: "2026-01-30",
    readingTimeMin: 3,
    heroImage: placeholder("STUDIO · 2026 · NOTES"),
    copy: {
      en: {
        title: "Notes from the studio, 2026",
        excerpt:
          "What we are building this year — and what we have decided to stop building.",
        lead: "Every year the studio writes itself a short list. Three things we will start. One thing we will stop. This is 2026's list.",
        body: [
          {
            kind: "subhead",
            text: "What we are starting",
          },
          {
            kind: "paragraph",
            text: "A new lineage of bain-marie inserts machined from solid bar stock instead of pressed sheet. Heavier. Slower to make. Outlasts the cabinet it sits in.",
          },
          {
            kind: "paragraph",
            text: "An installation crew dedicated only to Vision-2030 hospitality projects. We have learned that NEOM kitchens and Diriyah kitchens want a different rhythm of communication than a Jeddah hotel renovation. We are staffing for that rhythm.",
          },
          {
            kind: "paragraph",
            text: "A small batch of mirror-polished hood fronts for clients who want the kitchen to be visible from the dining room. This is a quiet experiment. We may never scale it.",
          },
          {
            kind: "subhead",
            text: "What we are stopping",
          },
          {
            kind: "paragraph",
            text: "We are no longer quoting on residential islands. The margin is fine. The work does not fit the studio's hand. We will refer them on, with our blessing.",
          },
        ],
      },
      ar: {
        title: "ملاحظات من المرسم، ٢٠٢٦",
        excerpt: "إيش نبني هالسنة — وإيش قرّرنا نوقف بناءه.",
        lead: "كل سنة، المرسم يكتب لنفسه قائمة قصيرة. ثلاثة أشياء نبدأها. شي واحد نوقفه. هذي قائمة ٢٠٢٦.",
        body: [
          {
            kind: "subhead",
            text: "اللي نبدأه",
          },
          {
            kind: "paragraph",
            text: "سلسلة جديدة من حافظات البين ماري، مفرّزة من قضيب صلب بدل الورق المضغوط. أثقل. أبطأ في الصنعة. تعيش أطول من الخزانة اللي تجلس عليها.",
          },
          {
            kind: "paragraph",
            text: "فريق تركيب مخصص فقط لمشاريع ضيافة رؤية ٢٠٣٠. تعلّمنا إن مطابخ نيوم ومطابخ الدرعية تبي إيقاع تواصل مختلف عن تجديد فندق في جدة. نوظّف لهذا الإيقاع.",
          },
          {
            kind: "paragraph",
            text: "دفعة صغيرة من واجهات مداخن مصقولة مرآة، للعملاء اللي يبون المطبخ ينشاف من الصالة. تجربة هادية. يمكن ما نوسّعها أبدًا.",
          },
          {
            kind: "subhead",
            text: "اللي نوقفه",
          },
          {
            kind: "paragraph",
            text: "ما عاد نقدّم عروض على جزر المطابخ السكنية. الهامش معقول. لكن الشغل ما يلبس يد المرسم. نحوّل الزبائن لغيرنا، وبدعواتنا.",
          },
        ],
      },
    },
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return STUB_POSTS.find((p) => p.slug === slug);
}
