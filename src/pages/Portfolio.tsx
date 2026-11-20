import { PortfolioBook } from '@/components/projects/PortfolioBook'

export function Portfolio() {
  return (
    <div className="wrap pt-28 pb-24">
      <p className="font-display text-xs tracking-[0.4em] text-cyan uppercase">Portfolio</p>
      <h1 className="font-display mt-4 text-4xl md:text-6xl">Le livre de mes créations</h1>
      <p className="mt-4 max-w-2xl text-mist">
        Un livre numérique interactif : couverture, pages projet, navigation.
      </p>
      <div className="mt-14">
        <PortfolioBook />
      </div>
    </div>
  )
}
