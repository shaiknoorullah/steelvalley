import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { LegalArticle } from "@/components/page-chrome/LegalArticle";

export const dynamic = "force-static";

type Props = {
  params: Promise<{ locale: string }>;
};

const META = {
  en: {
    title: "Terms of Use — Steel Valley",
    description:
      "Terms governing access to the Steel Valley website and engagement of its fabrication services.",
  },
  ar: {
    title: "شروط الاستخدام — ستيل فالي",
    description: "الشروط التي تحكم استخدام موقع ستيل فالي والتعاقد على خدماتها.",
  },
} as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const safe: "en" | "ar" = locale === "ar" ? "ar" : "en";
  return META[safe];
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  if (locale === "ar") {
    return (
      <LegalArticle
        locale="ar"
        title="شروط الاستخدام"
        effectiveDate="١ مايو ٢٠٢٦"
        todoNote="مراجعة قانونية قبل النشر — قالب عام يلزم مطابقته مع نظام التجارة الإلكترونية ونظام المعاملات المدنية وأحكام التعاقد المهني السعودية."
      >
        <p>
          باستخدامك لموقع ستيل فالي (steel-valley.sa) فإنك توافق على الشروط
          الموضحة أدناه. إن لم توافق، يرجى التوقف عن استخدام الموقع.
        </p>

        <h2>١. الملكية الفكرية</h2>
        <p>
          جميع التصاميم، النصوص، الصور، الرسومات التنفيذية، والشعارات المعروضة
          على الموقع مملوكة لستيل فالي أو مرخّصة لها. لا يجوز نسخها أو
          إعادة استخدامها دون إذن خطي.
        </p>

        <h2>٢. طلبات العروض</h2>
        <p>
          عرض السعر المرسل من ستيل فالي صالح لمدة ثلاثين يومًا من تاريخ
          إصداره، ما لم يُذكر خلاف ذلك في العرض نفسه. أي تغيير في المواصفات
          بعد التعاقد يستوجب إعادة احتساب السعر والمدة.
        </p>

        <h2>٣. التسليم والتركيب</h2>
        <p>
          مدد التسليم المذكورة في العروض تقريبية. تلتزم ستيل فالي ببذل العناية
          المعقولة للوفاء بها، لكنها قد تتأثر بعوامل خارجة عن إرادتها مثل
          توفّر المواد المستوردة وظروف الموقع.
        </p>

        <h2>٤. الضمان</h2>
        <p>
          نضمن أعمالنا ضد عيوب الصنعة لمدة ستة وثلاثين شهرًا من تاريخ التسليم،
          شريطة الاستخدام المهني المعقول. الضمان لا يشمل التلف الناتج عن سوء
          الاستخدام أو الصيانة غير الصحيحة أو التعديلات من طرف ثالث.
        </p>

        <h2>٥. حدود المسؤولية</h2>
        <p>
          مسؤولية ستيل فالي تقتصر على قيمة العقد المتعلق بالضرر المطالَب به.
          لا نتحمل المسؤولية عن الأضرار التبعية أو فوات الأرباح أو الانقطاع
          عن العمل.
        </p>

        <h2>٦. القانون الواجب التطبيق</h2>
        <p>
          تخضع هذه الشروط للأنظمة المعمول بها في المملكة العربية السعودية،
          وتختص محاكم جدة بالنظر في أي نزاع ينشأ عنها.
        </p>
      </LegalArticle>
    );
  }

  return (
    <LegalArticle
      locale="en"
      title="Terms of Use"
      effectiveDate="01 May 2026"
      todoNote="Legal review required before launch — this is a generic template that must be reconciled against Saudi e-commerce, civil transactions, and professional engagement law."
    >
      <p>
        By using the Steel Valley website (steel-valley.sa) you agree to the
        terms set out below. If you do not agree, please stop using the site.
      </p>

      <h2>1. Intellectual property</h2>
      <p>
        All designs, copy, photography, technical drawings, and marks shown on
        the site are owned by Steel Valley or licensed to it. They may not be
        copied or reused without written permission.
      </p>

      <h2>2. Quotations</h2>
      <p>
        Quotes issued by Steel Valley are valid for thirty days from the date
        of issue unless stated otherwise on the quote itself. Any change of
        specification after engagement requires re-pricing and a revised
        timeline.
      </p>

      <h2>3. Delivery and installation</h2>
      <p>
        Delivery dates quoted are indicative. Steel Valley undertakes reasonable
        care to meet them but they may be affected by factors outside our
        control, such as the availability of imported materials and site
        readiness.
      </p>

      <h2>4. Warranty</h2>
      <p>
        We warrant our workmanship against defects for thirty-six months from
        the date of delivery, subject to reasonable professional use. The
        warranty does not cover damage caused by misuse, improper cleaning, or
        modification by a third party.
      </p>

      <h2>5. Limitation of liability</h2>
      <p>
        Steel Valley's liability is limited to the value of the contract
        relating to the claim. We accept no liability for consequential loss,
        loss of profit, or business interruption.
      </p>

      <h2>6. Governing law</h2>
      <p>
        These terms are governed by the laws of the Kingdom of Saudi Arabia.
        Any dispute arising under them falls within the jurisdiction of the
        courts of Jeddah.
      </p>
    </LegalArticle>
  );
}
