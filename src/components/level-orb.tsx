interface Props {
  level: number;
  into: number;
  need: number;
  size?: number;
}

export function LevelOrb({ level, into, need, size = 140 }: Props) {
  const radius = (size / 140) * 56;
  const circumference = 2 * Math.PI * radius;
  const safeNeed = Math.max(1, need);
  const pct = Math.max(0, Math.min(1, into / safeNeed));
  const center = size / 2;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        <defs>
          <linearGradient
            id="psl-orb-grad"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="var(--acid)"
            />
            <stop
              offset="100%"
              stopColor="var(--acid-2)"
            />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="var(--border-soft)"
          strokeWidth={2}
          fill="none"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#psl-orb-grad)"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference * pct} ${circumference}`}
          transform={`rotate(-90 ${center} ${center})`}
          style={{
            transition: "stroke-dasharray 700ms cubic-bezier(.2,.7,.2,1)"
          }}
        />
        {Array.from({ length: 24 }).map((_, index) => {
          const angle = (index / 24) * Math.PI * 2 - Math.PI / 2;
          const inner = radius + 6;
          const outer = radius + (index % 6 === 0 ? 12 : 9);

          return (
            <line
              key={index}
              x1={center + Math.cos(angle) * inner}
              y1={center + Math.sin(angle) * inner}
              x2={center + Math.cos(angle) * outer}
              y2={center + Math.sin(angle) * outer}
              stroke="var(--faint)"
              strokeWidth={1}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-muted-foreground font-mono text-[10px] tracking-[2px]">
          LEVEL
        </span>
        <span
          className="text-foreground leading-none font-bold"
          style={{
            fontSize: (size / 140) * 52,
            textShadow: "0 0 18px rgba(214,255,0,0.4)"
          }}
        >
          {level}
        </span>
        <span className="text-primary mt-1 font-mono text-[10px]">
          {into}/{need} XP
        </span>
      </div>
    </div>
  );
}
