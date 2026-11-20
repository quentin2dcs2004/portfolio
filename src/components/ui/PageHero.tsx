import { motion } from 'framer-motion'

type Props = {
  eyebrow?: string
  title: string
  lead: string
}

export function PageHero({ eyebrow, title, lead }: Props) {
  return (
    <header className="mb-10 max-w-3xl">
      {eyebrow ? (
        <p className="mb-2 text-xs font-medium tracking-[0.28em] text-cyan uppercase">{eyebrow}</p>
      ) : null}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-4xl font-bold tracking-tight text-snow md:text-5xl"
      >
        {title}
      </motion.h1>
      <p className="mt-4 text-base text-muted md:text-lg">{lead}</p>
    </header>
  )
}
