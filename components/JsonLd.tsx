/** Render one or more schema.org objects as an ld+json script tag.
 *  Content is always static, in-repo data; "<" is escaped so no value can
 *  ever close the script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
