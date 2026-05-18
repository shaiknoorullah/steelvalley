// ENQ-YYYY-NNNN. Counter persists in Payload Enquiries (uniqueness enforced),
// so we generate optimistically and retry on collision.

export function generateReference(year = new Date().getUTCFullYear()): string {
  const random = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  return `ENQ-${year}-${random}`;
}
