import { site } from './site'

/** Textes juridiques FR — à faire valider par un professionnel du droit si besoin. */
export const legal = {
  editor: {
    name: site.fullName,
    status: 'Personne physique — portfolio personnel',
    email: site.email,
    phone: site.phone,
    address: `${site.location} (adresse postale complète à renseigner)`,
    publicationDirector: site.fullName,
  },
  host: {
    name: 'À renseigner (ex. GitHub Pages, Vercel, Netlify, OVH…)',
    address: 'Adresse de l’hébergeur à renseigner',
    phone: 'Téléphone hébergeur à renseigner',
  },
  updatedAt: '20 novembre 2026',
} as const

export const mentionsLegalesSections = [
  {
    title: '1. Éditeur du site',
    body: `Le site « ${site.signature} » est édité par ${legal.editor.name}, ${legal.editor.status}.\nContact : ${legal.editor.email} — ${legal.editor.phone}\nLocalisation indiquée : ${legal.editor.address}\nDirecteur de la publication : ${legal.editor.publicationDirector}.`,
  },
  {
    title: '2. Hébergement',
    body: `Hébergeur : ${legal.host.name}\n${legal.host.address}\n${legal.host.phone}\nCes mentions doivent être complétées dès qu’un hébergeur public est choisi.`,
  },
  {
    title: '3. Propriété intellectuelle',
    body: `L’ensemble des contenus présents sur ce site (textes, visuels, logos, code, animations, photographies) est protégé par le droit d’auteur, sauf mention contraire.\nLe logo Q et la signature « ${site.signature} » appartiennent à ${site.fullName}.\nToute reproduction, représentation ou diffusion non autorisée est interdite.\nLes marques tierces (logiciels, réseaux sociaux) appartiennent à leurs détenteurs respectifs.`,
  },
  {
    title: '4. Contenu & exactitude',
    body: `Les informations sont fournies à titre indicatif. Les projets marqués « Placeholder » ou « à compléter » sont des emplacements éditoriaux.\nLes conversations de la page Story sont des exemples fictifs à but illustratif (pas une messagerie réelle).`,
  },
  {
    title: '5. Responsabilité',
    body: `L’éditeur ne saurait être tenu responsable des dommages directs ou indirects liés à l’accès ou à l’utilisation du site, ni du contenu des sites tiers pointés par des liens hypertextes.`,
  },
  {
    title: '6. Droit applicable',
    body: `Le présent site est soumis au droit français. En cas de litige, et à défaut d’accord amiable, les tribunaux français compétents seront saisis.`,
  },
] as const

export const privacySections = [
  {
    title: '1. Responsable de traitement',
    body: `${legal.editor.name} — contact : ${legal.editor.email}`,
  },
  {
    title: '2. Données collectées',
    body: `Via le formulaire de contact (mailto) : nom, e-mail, objet, message — uniquement si vous choisissez d’envoyer un message.\nAucune création de compte n’est proposée.\nPas de tracking publicitaire tiers configuré par défaut sur ce portfolio.`,
  },
  {
    title: '3. Finalités',
    body: `Répondre à vos demandes de contact et d’information professionnelle.\nBase légale : intérêt légitime / mesures précontractuelles à votre demande (art. 6 RGPD).`,
  },
  {
    title: '4. Destinataires & durée',
    body: `Les messages envoyés par e-mail sont reçus par l’éditeur. Conservation : le temps nécessaire au traitement de la demande, puis suppression ou archivage limité selon besoin légitime.`,
  },
  {
    title: '5. Vos droits (RGPD)',
    body: `Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité.\nPour les exercer : ${legal.editor.email}.\nVous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr).`,
  },
  {
    title: '6. Cookies',
    body: `Ce site peut utiliser le stockage local du navigateur (sessionStorage) pour se souvenir que l’intro a été vue, et un cookie / localStorage technique pour mémoriser votre choix de bannière cookies.\nPas de cookies publicitaires déposés par ce portfolio en l’état.\nVoir la page Cookies pour gérer votre choix.`,
  },
] as const

export const cookiesSections = [
  {
    title: 'Cookies & traceurs',
    body: `Conformément à la réglementation européenne et aux recommandations de la CNIL, seuls les dépôts strictement nécessaires au fonctionnement peuvent être placés sans consentement.\nLes traceurs non essentiels nécessitent votre accord préalable.`,
  },
  {
    title: 'Ce que fait ce site',
    body: `• sessionStorage « quentin-intro-seen » : mémorise le skip de l’intro (technique).\n• localStorage « quentin-cookie-consent » : mémorise votre choix de bannière.\nAucun outil analytics tiers n’est branché par défaut. Si un outil est ajouté plus tard, cette page et la bannière seront mises à jour.`,
  },
] as const
