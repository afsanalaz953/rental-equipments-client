import { cn } from "cn";

type Tone = "light" | "dark";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** "dark" = section sits on the navy brand background. */
  tone?: Tone;
  align?: "center" | "left";
  className?: string;
}

/**
 * Shared eyebrow / title / description block used by every home section so
 * spacing and typography stay identical across the page.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "center",
  className,
}: SectionHeadingProps) {
  const onNavy = tone === "dark";

  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase",
          onNavy
            ? "bg-[#FFC000]/15 text-[#FFC000] ring-1 ring-[#FFC000]/40"
            : "bg-[#142A5E]/10 text-[#142A5E] ring-1 ring-[#142A5E]/20 dark:bg-[#FFC000]/15 dark:text-[#FFC000] dark:ring-[#FFC000]/40",
        )}
      >
        {eyebrow}
      </span>

      <h2
        className={cn(
          "mt-5 text-3xl font-bold tracking-tight text-balance sm:text-4xl",
          onNavy ? "text-white" : "text-[#142A5E] dark:text-white",
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-pretty",
            onNavy ? "text-white/70" : "text-zinc-600 dark:text-zinc-400",
          )}
        >
          {description}
        </p>
      ) : null}

      <span
        aria-hidden
        className={cn(
          "mt-6 block h-1 w-20 rounded-full bg-[#FFC000]",
          align === "center" && "mx-auto",
        )}
      />
    </div>
  );
}
