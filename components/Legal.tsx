/** Shared shell + prose primitives for the legal pages. */

export function LegalShell({
  label,
  title,
  updated,
  updatedLabel = "Last updated:",
  children,
}: {
  label: string;
  title: string;
  updated: string;
  updatedLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[820px] px-[clamp(20px,4vw,34px)]">
      <section className="pb-[34px] pt-[69px]">
        <span className="section-label">{label}</span>
        <h1 className="text-heading">{title}</h1>
        <p className="mt-[10px] text-caption text-muted">
          {updatedLabel} {updated}
        </p>
      </section>
      <div className="card">{children}</div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-[30px] first:border-t-0 first:pt-0 [&+&]:mt-[30px]">
      <h2 className="font-sans text-subheading font-medium">{title}</h2>
      <div className="mt-[10px] flex flex-col gap-[10px] text-label text-ink-muted [&_li]:ml-[18px] [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-[6px]">
        {children}
      </div>
    </section>
  );
}
