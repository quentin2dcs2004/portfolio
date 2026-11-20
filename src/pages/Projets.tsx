import { ProjectGallery } from '@/components/projects/ProjectGallery'

export function Projets() {
  return (
    <div className="wrap pt-28 pb-24">
      <p className="font-display text-xs tracking-[0.4em] text-cyan uppercase">Projets</p>
      <h1 className="font-display mt-4 text-4xl md:text-6xl">Réalisations</h1>
      <p className="mt-4 max-w-2xl text-mist">
        Galerie immersive. Les fiches « à compléter » sont des emplacements modifiables.
      </p>
      <div className="mt-14">
        <ProjectGallery />
      </div>
    </div>
  )
}
