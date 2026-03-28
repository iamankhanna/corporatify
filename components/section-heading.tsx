type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  inverted?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  inverted = false
}: SectionHeadingProps) {
  const textColor = inverted ? "text-white" : "text-ink";
  const bodyColor = inverted ? "text-white/70" : "text-black/65";
  const eyebrowColor = inverted ? "text-clay" : "text-moss";

  return (
    <div>
      <p className={`text-xs uppercase tracking-[0.3em] ${eyebrowColor}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 text-3xl leading-tight ${textColor}`}>{title}</h2>
      <p className={`mt-3 max-w-2xl text-sm leading-7 ${bodyColor}`}>
        {description}
      </p>
    </div>
  );
}
