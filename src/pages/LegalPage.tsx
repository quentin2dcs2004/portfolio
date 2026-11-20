import { PageHero } from '@/components/ui/PageHero'
import { PageTransition } from '@/components/ui/PageTransition'
import {
  cookiesSections,
  legal,
  mentionsLegalesSections,
  privacySections,
} from '@/data/legal'

type Kind = 'mentions' | 'privacy' | 'cookies'

const copy: Record<
  Kind,
  { eyebrow: string; title: string; lead: string; sections: readonly { title: string; body: string }[] }
> = {
  mentions: {
    eyebrow: 'Mentions légales',
    title: 'Informations légales',
    lead: `Dernière mise à jour : ${legal.updatedAt}. Complète l’hébergeur avant une mise en ligne publique.`,
    sections: mentionsLegalesSections,
  },
  privacy: {
    eyebrow: 'Confidentialité',
    title: 'Politique de confidentialité',
    lead: 'Traitement des données conforme à l’esprit RGPD — portfolio personnel sans compte utilisateur.',
    sections: privacySections,
  },
  cookies: {
    eyebrow: 'Cookies',
    title: 'Politique cookies',
    lead: 'Transparence sur les traceurs techniques utilisés par ce site.',
    sections: cookiesSections,
  },
}

export function LegalPage({ kind }: { kind: Kind }) {
  const c = copy[kind]
  return (
    <PageTransition>
      <div className="page-pad wrap max-w-3xl">
        <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} />
        <div className="space-y-6">
          {c.sections.map((s) => (
            <section key={s.title} className="glass rounded-2xl p-5 md:p-6">
              <h2 className="font-display text-lg font-semibold">{s.title}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
