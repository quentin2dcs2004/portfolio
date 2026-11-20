type Props = {
  size?: number
  className?: string
  title?: string
}

/** Clean geometric Q mark — Luminart-inspired: sharp, luminous, minimal. */
export function LogoQ({ size = 40, className = '', title = 'Quentin' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id="lq" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00E5FF" />
          <stop offset="0.45" stopColor="#176BFF" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" stroke="url(#lq)" strokeWidth="1.5" opacity="0.55" />
      <circle cx="30" cy="30" r="14" stroke="url(#lq)" strokeWidth="5.5" />
      <path d="M39.5 39.5 L50 50" stroke="url(#lq)" strokeWidth="5.5" strokeLinecap="round" />
    </svg>
  )
}
