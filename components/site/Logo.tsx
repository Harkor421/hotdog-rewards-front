/**
 * The badge.
 *
 * Drawn here rather than shipped as an image so it stays sharp at 28px in the
 * nav and at 200px in the hero, and so the wordmark is real text rather than
 * pixels — it is the site's name, and it should be selectable and searchable.
 *
 * The round-badge-with-a-price format is the food-court sign it is riffing on;
 * the name, the drawing and the type are this project's own.
 */
export function Logo({
  size = 40,
  compact = false,
  className,
}: {
  size?: number;
  /**
   * Ring and dog only.
   *
   * The full badge carries three lines of type. At the 34px it occupies in the
   * nav none of them resolve — they render as three grey smudges, which reads
   * as a broken image rather than as a logo. Below ~64px the drawing has to
   * carry it alone.
   */
  compact?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Hotdog Rewards"
    >
      <circle cx="100" cy="100" r="96" fill="#fff" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="var(--blue)" strokeWidth={compact ? 11 : 7} />

      {!compact && (
        <>
      <text
        x="100" y="50" textAnchor="middle" fill="var(--red)"
        fontFamily="var(--font-geist-sans), system-ui, sans-serif"
        fontSize="31" fontWeight="800" letterSpacing="-1.2"
      >
        HOTDOG
      </text>
      <text
        x="100" y="68" textAnchor="middle" fill="var(--blue)"
        fontFamily="var(--font-geist-sans), system-ui, sans-serif"
        fontSize="15" fontWeight="800" letterSpacing="3.4"
      >
        REWARDS
      </text>
        </>
      )}

      {/* the dog — tilted, because a level one looks like a diagram */}
      <g transform={compact ? "translate(100 100) rotate(-16) scale(1.22)" : "translate(100 108) rotate(-7)"}>
        <rect x="-68" y="2" width="136" height="26" rx="13" fill="#e2a45f" />
        <rect x="-68" y="2" width="136" height="26" rx="13" fill="none" stroke="#c98c46" strokeWidth="1.5" />
        <rect x="-72" y="-13" width="144" height="24" rx="12" fill="#c0392b" />
        <rect x="-72" y="-13" width="144" height="24" rx="12" fill="none" stroke="#96291d" strokeWidth="1.5" />
        <rect x="-64" y="-30" width="128" height="24" rx="12" fill="#f0c682" />
        <rect x="-64" y="-30" width="128" height="24" rx="12" fill="none" stroke="#d8a961" strokeWidth="1.5" />
        {[-46, -28, -10, 8, 26, 44].map((x, i) => (
          <ellipse key={x} cx={x} cy={i % 2 ? -22 : -17} rx="3.4" ry="2" fill="#fff3dc" />
        ))}
        <path
          d="M-58 -2 L-44 -9 L-30 -2 L-16 -9 L-2 -2 L12 -9 L26 -2 L40 -9 L54 -2"
          fill="none" stroke="var(--mustard)" strokeWidth="6.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </g>

      {!compact && (
        <>
          <path d="M22 158 q22 -9 46 -4" fill="none" stroke="var(--red)" strokeWidth="7" strokeLinecap="round" />
          <path d="M178 158 q-22 -9 -46 -4" fill="none" stroke="var(--red)" strokeWidth="7" strokeLinecap="round" />
          <text
            x="100" y="178" textAnchor="middle" fill="var(--blue)"
            fontFamily="var(--font-geist-sans), system-ui, sans-serif"
            fontSize="34" fontWeight="800" letterSpacing="-1"
          >
            $1.50
          </text>
        </>
      )}
    </svg>
  );
}

/** The nav lockup: the badge, then the name as text. */
export function Wordmark({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <Logo size={36} compact />
      <span className="text-[15.5px] font-bold tracking-[-0.02em] text-[var(--blue)]">
        {name}
      </span>
    </span>
  );
}
