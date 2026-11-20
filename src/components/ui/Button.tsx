import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'outline'

interface SharedProps {
  children: ReactNode
  variant?: Variant
  className?: string
}

const styles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-electric via-cyan to-violet text-void font-semibold shadow-[0_0_30px_rgba(23,107,255,0.35)] hover:brightness-110',
  ghost: 'bg-white/5 text-snow hover:bg-white/10 border border-white/10',
  outline:
    'border border-cyan/40 text-cyan hover:bg-cyan/10 hover:border-cyan',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm tracking-wide transition-all duration-300 active:scale-[0.98]'

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: SharedProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function ButtonLink({
  to,
  children,
  variant = 'primary',
  className = '',
}: SharedProps & { to: string }) {
  return (
    <Link to={to} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </Link>
  )
}
