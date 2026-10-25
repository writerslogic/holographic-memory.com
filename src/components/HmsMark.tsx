const STATIC_MARK = "/images/crystal-halo/crystal-detailed-static.svg";
const ANIMATED_MARK = "/images/crystal-halo/crystal-detailed-loop.svg";

export function HmsMarkBackdrop({ className = "" }: { className?: string }) {
  return (
    <picture className={className} aria-hidden="true">
      <source media="(prefers-reduced-motion: reduce)" srcSet={STATIC_MARK} />
      <img src={ANIMATED_MARK} alt="" width={768} height={768} />
    </picture>
  );
}

export function HmsMark({
  className = "",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <img
      src={STATIC_MARK}
      className={className}
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      width={768}
      height={768}
    />
  );
}
