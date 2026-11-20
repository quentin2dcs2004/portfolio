import { SectionHeading } from '@/components/ui/SectionHeading'
import { labExperiments } from '@/data/site'
import {
  CatDemo,
  CoffeeSteam,
  LaserDemo,
  NuancierDemo,
  PacManDemo,
  PortalDemo,
  SubmarineDemo,
  TruckDemo,
} from '@/components/animations/LabWidgets'

const demos = [
  CoffeeSteam,
  PacManDemo,
  SubmarineDemo,
  TruckDemo,
  CatDemo,
  PortalDemo,
  LaserDemo,
  NuancierDemo,
]

export function Laboratoire() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 md:px-6">
      <SectionHeading
        eyebrow="Laboratoire"
        title="Laboratoire créatif"
        description="Espace expérimental : animations originales, tests techniques et prototypes interactifs."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {labExperiments.map((exp, i) => {
          const Demo = demos[i % demos.length]
          return (
            <article
              key={exp.id}
              className="glass overflow-hidden rounded-[1.75rem] neon-border"
            >
              <div className="flex h-36 items-center justify-center border-b border-white/10 bg-void/40 px-4">
                <Demo />
              </div>
              <div className="p-5">
                <p className="font-display text-[10px] tracking-[0.3em] text-cyan uppercase">
                  {exp.kind}
                </p>
                <h3 className="mt-2 font-display text-lg text-snow">{exp.title}</h3>
                <p className="mt-2 text-sm text-mist">{exp.description}</p>
              </div>
            </article>
          )
        })}

        {/* Extra demos beyond experiment list */}
        {demos.slice(labExperiments.length).map((Demo, i) => (
          <article
            key={`extra-${i}`}
            className="glass overflow-hidden rounded-[1.75rem] neon-border"
          >
            <div className="flex h-36 items-center justify-center border-b border-white/10 bg-void/40 px-4">
              <Demo />
            </div>
            <div className="p-5">
              <p className="font-display text-[10px] tracking-[0.3em] text-cyan uppercase">
                extra
              </p>
              <h3 className="mt-2 font-display text-lg text-snow">Micro-monde #{i + 1}</h3>
              <p className="mt-2 text-sm text-mist">
                Animation décorative intégrée au laboratoire.
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
