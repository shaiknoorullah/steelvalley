interface Props {
  signedUrl: string;
  locale: "ar" | "en";
}

export function LeadMagnetDelivery({ signedUrl, locale }: Props) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <div
      dir={dir}
      style={{
        fontFamily: "system-ui, sans-serif",
        color: "#0a0a0b",
        padding: "24px",
      }}
    >
      <h1>
        {locale === "ar"
          ? "دليل ستيل فالي للمطابخ التجارية"
          : "The Commercial Kitchen Buyer's Guide"}
      </h1>
      <p>
        {locale === "ar"
          ? "خلاصة عشرين سنة من العمل مع أفضل مطاعم جدة — بين يديك."
          : "20 years of lessons from Jeddah's top restaurants — yours to keep."}
      </p>
      <p>
        <a href={signedUrl} style={{ color: "#e2611b" }}>
          {locale === "ar" ? "حمّل الدليل (PDF)" : "Download the PDF"}
        </a>
      </p>
      <p style={{ fontSize: "12px", color: "#666" }}>
        {locale === "ar"
          ? "هذا الرابط ينتهي بعد 7 أيام."
          : "This link expires in 7 days."}
      </p>
      <p>— Steel Valley, Jeddah</p>
    </div>
  );
}
