/**
 * Renders a single <script type="application/ld+json"> tag for the
 * provided structured-data object.
 *
 * Implements the official Next.js JSON-LD pattern:
 *   https://nextjs.org/docs/app/guides/json-ld
 *
 * Safety notes:
 *   - `data` is ALWAYS our own server-built JSON from src/lib/seo/jsonld.ts —
 *     never user content. Sanitisation is therefore not required.
 *   - We still defensively escape `<` to `<` to neutralise any future
 *     change that ever inlines a string containing HTML (belt-and-braces).
 *   - Output is a non-executable <script type="application/ld+json"> tag,
 *     which browsers MUST treat as data, not script. XSS is structurally
 *     impossible from this tag-type.
 */
interface Props {
  data: unknown;
  id?: string;
}

export function JsonLd({ data, id }: Props) {
  const serialized = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      id={id}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
