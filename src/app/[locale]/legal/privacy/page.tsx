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
    title: "Privacy Policy — Steel Valley",
    description:
      "How Steel Valley collects, stores, and protects your personal data under Saudi PDPL.",
  },
  ar: {
    title: "سياسة الخصوصية — ستيل فالي",
    description:
      "كيف تجمع ستيل فالي بياناتك الشخصية وتحفظها وتحميها وفق نظام حماية البيانات الشخصية السعودي.",
  },
} as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const safe: "en" | "ar" = locale === "ar" ? "ar" : "en";
  return META[safe];
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  if (locale === "ar") {
    return (
      <LegalArticle
        locale="ar"
        title="سياسة الخصوصية"
        effectiveDate="١ مايو ٢٠٢٦"
        todoNote="مراجعة قانونية قبل النشر — هذي قالب عام، يلزم مطابقتها مع نظام حماية البيانات الشخصية (PDPL) ولائحته التنفيذية."
      >
        <p>
          ستيل فالي (ويُشار إليها لاحقًا بـ &laquo;الشركة&raquo; أو &laquo;نحن&raquo;)
          ملتزمة بحماية خصوصية الزائرين والعملاء. توضّح هذه السياسة كيف نجمع
          بياناتك الشخصية، ولأي غرض نستخدمها، وحقوقك في التحكم فيها وفق
          أحكام نظام حماية البيانات الشخصية الصادر بالمرسوم الملكي رقم
          م/١٩ وتاريخ ٩/٢/١٤٤٣هـ ولائحته التنفيذية.
        </p>

        <h2>١. البيانات التي نجمعها</h2>
        <ul>
          <li>اسمك واسم منشأتك ومنصبك الوظيفي عند تقديم طلب عرض.</li>
          <li>وسائل التواصل: رقم جوال، بريد إلكتروني، حساب واتساب للأعمال.</li>
          <li>تفاصيل المشروع: نوع المطبخ، السعة، الموقع، الموعد المتوقع للافتتاح.</li>
          <li>
            بيانات تقنية مجهولة الهوية عبر ملفات تعريف الارتباط الضرورية فقط
            لتشغيل الموقع.
          </li>
        </ul>

        <h2>٢. الغرض من المعالجة</h2>
        <ul>
          <li>الرد على طلبك بعرض سعر مدروس.</li>
          <li>التواصل المتعلق بالمشروع طوال مرحلتي المعاينة والتسليم.</li>
          <li>الالتزامات النظامية كالفوترة الإلكترونية وضريبة القيمة المضافة.</li>
        </ul>

        <h2>٣. حقوقك</h2>
        <p>
          يحق لك الاطلاع على بياناتك، طلب تصحيحها، طلب نسخة منها، وطلب حذفها
          متى انتهت الحاجة إليها. لممارسة هذه الحقوق، تواصل معنا على
          privacy@steel-valley.sa.
        </p>

        <h2>٤. مشاركة البيانات</h2>
        <p>
          لا نبيع بياناتك. نشاركها فقط مع مقدّمي الخدمات الفنيين (الاستضافة،
          البريد، التحليلات) ضمن اتفاقيات معالجة بيانات تضمن نفس مستوى الحماية،
          وعند الطلب النظامي من جهة مختصة.
        </p>

        <h2>٥. مدة الاحتفاظ</h2>
        <p>
          نحتفظ بطلبات العروض حتى ٢٤ شهرًا من آخر تواصل. وثائق العقود
          والفواتير تُحفظ للمدة التي يفرضها النظام السعودي.
        </p>

        <h2>٦. التحديثات</h2>
        <p>
          نحتفظ بحق تحديث هذه السياسة، وننشر النسخة السارية على هذه الصفحة مع
          تاريخ السريان أعلاه.
        </p>
      </LegalArticle>
    );
  }

  return (
    <LegalArticle
      locale="en"
      title="Privacy Policy"
      effectiveDate="01 May 2026"
      todoNote="Legal review required before launch — this is a generic template that must be reconciled against the Saudi Personal Data Protection Law (PDPL) and its implementing regulations."
    >
      <p>
        Steel Valley ("the Company", "we") is committed to protecting the
        privacy of visitors and customers. This policy explains what personal
        data we collect, why we process it, and the rights you have over it
        under the Saudi Personal Data Protection Law (PDPL) issued by Royal
        Decree M/19 of 9/2/1443H and its implementing regulations.
      </p>

      <h2>1. Data we collect</h2>
      <ul>
        <li>Your name, organisation, and role when you request a quote.</li>
        <li>Contact channels: phone, email, WhatsApp Business handle.</li>
        <li>
          Project details: kitchen type, service capacity, location, opening
          date.
        </li>
        <li>
          Anonymous technical data via strictly necessary cookies used only to
          operate the site.
        </li>
      </ul>

      <h2>2. Purpose of processing</h2>
      <ul>
        <li>Responding to your enquiry with a measured quote.</li>
        <li>
          Project communication across the site survey and delivery phases.
        </li>
        <li>
          Statutory obligations such as Saudi e-invoicing and VAT compliance.
        </li>
      </ul>

      <h2>3. Your rights</h2>
      <p>
        You have the right to access your data, request its correction, request
        a copy, and request its deletion when no longer required. To exercise
        these rights, contact us at privacy@steel-valley.sa.
      </p>

      <h2>4. Sharing</h2>
      <p>
        We do not sell your data. We share it only with technical service
        providers (hosting, email, analytics) under data processing agreements
        that preserve the same level of protection, and when legally compelled
        by a competent authority.
      </p>

      <h2>5. Retention</h2>
      <p>
        We retain quote requests for up to 24 months after the last contact.
        Contracts and invoices are retained for the period required by Saudi
        law.
      </p>

      <h2>6. Updates</h2>
      <p>
        We reserve the right to update this policy. The current version is
        published on this page with the effective date above.
      </p>
    </LegalArticle>
  );
}
