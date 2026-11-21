export type StoryCategory =
  | 'Identité'
  | 'Compétences'
  | 'Parcours'
  | 'Passions'
  | 'Projets'
  | 'Luminart'
  | 'Travail'
  | 'Futur'

export type StoryPersona = 'quentin' | 'luminart'

export type StoryQA = {
  id: string
  category: StoryCategory
  persona: StoryPersona
  question: string
  answer: string
}

export const storyCategories: { id: StoryCategory | 'Tous'; label: string; color: string }[] = [
  { id: 'Tous', label: 'Tous', color: '#ffffff' },
  { id: 'Identité', label: 'Identité', color: '#FF46A2' },
  { id: 'Compétences', label: 'Compétences', color: '#00F5D4' },
  { id: 'Parcours', label: 'Parcours', color: '#7C5CFF' },
  { id: 'Passions', label: 'Passions', color: '#FFB020' },
  { id: 'Projets', label: 'Projets', color: '#4CC9F0' },
  { id: 'Luminart', label: 'Luminart', color: '#FF46A2' },
  { id: 'Travail', label: 'Travail', color: '#00F5D4' },
  { id: 'Futur', label: 'Futur', color: '#7C5CFF' },
]

export const storyQA: StoryQA[] = [
  // Identité
  {
    id: 'id-1',
    category: 'Identité',
    persona: 'quentin',
    question: 'Quentin, tu peux te présenter ?',
    answer:
      'Je suis Quentin Da Costa Soares, créatif polyvalent basé à Marseille. J’aime relier graphisme, 3D, impression et numérique pour donner forme à des idées.',
  },
  {
    id: 'id-2',
    category: 'Identité',
    persona: 'quentin',
    question: 'C’est quoi ton style ?',
    answer:
      'Propre, lumineux, immersif. J’aime les univers soignés — un peu galaxy, un peu premium — sans surcharge inutile.',
  },
  {
    id: 'id-3',
    category: 'Identité',
    persona: 'quentin',
    question: 'Tu travailles comment au quotidien ?',
    answer:
      'Brief → exploration → prototype → itérations → livraison. Je communique clairement et je documente ce qui compte.',
  },
  {
    id: 'id-4',
    category: 'Identité',
    persona: 'quentin',
    question: 'Tu es plutôt solo ou en équipe ?',
    answer:
      'Les deux. Je sais avancer en autonomie, et j’apprécie collaborer quand le projet gagne en richesse à plusieurs.',
  },
  // Compétences
  {
    id: 'cp-1',
    category: 'Compétences',
    persona: 'quentin',
    question: 'Quelles sont tes spécialités ?',
    answer:
      'Graphisme, impression, modélisation 3D, impression 3D, développement web, vente et conseil client.',
  },
  {
    id: 'cp-2',
    category: 'Compétences',
    persona: 'quentin',
    question: 'Quels logiciels maîtrises-tu ?',
    answer:
      'Photoshop, Illustrator, InDesign, Canva, GIMP, Blender, Fusion 360, FreeCAD, SolidWorks, Cura, VS Code, Figma, GitHub…',
  },
  {
    id: 'cp-3',
    category: 'Compétences',
    persona: 'quentin',
    question: 'Tu codes aussi ?',
    answer:
      'Oui : HTML, CSS, JavaScript, bases d’interfaces modernes (React) et expériences 3D avec Three.js.',
  },
  {
    id: 'cp-4',
    category: 'Compétences',
    persona: 'quentin',
    question: 'Tu gères la chaîne print de A à Z ?',
    answer:
      'Oui : préparation fichier, gestion des couleurs, façonnage, grand format, sérigraphie selon le besoin.',
  },
  {
    id: 'cp-5',
    category: 'Compétences',
    persona: 'quentin',
    question: 'Niveau 3D / impression 3D ?',
    answer:
      'Modélisation d’objets, texturing, rendu, préparation STL, tranchage, calibration et prototypage.',
  },
  // Parcours
  {
    id: 'pc-1',
    category: 'Parcours',
    persona: 'quentin',
    question: 'Quelle formation as-tu ?',
    answer: 'Bac Pro RPIP — Réalisation de Produits Imprimés et Plurimédia.',
  },
  {
    id: 'pc-2',
    category: 'Parcours',
    persona: 'quentin',
    question: 'Tu étudies encore ?',
    answer:
      'Oui, une formation de testeur de jeux vidéo : qualité, bugs, UX et passion du jeu.',
  },
  {
    id: 'pc-3',
    category: 'Parcours',
    persona: 'quentin',
    question: 'Qu’est-ce que le RPIP t’a apporté ?',
    answer:
      'Une base solide en numérique, couleurs, supports et production — très utile pour créer et livrer.',
  },
  {
    id: 'pc-4',
    category: 'Parcours',
    persona: 'quentin',
    question: 'Tu as des stages / expériences ?',
    answer:
      'Certaines expériences sont encore à documenter sur le site (emplacements prévus dans Parcours).',
  },
  // Passions
  {
    id: 'ps-1',
    category: 'Passions',
    persona: 'quentin',
    question: 'Tes passions ?',
    answer:
      'Photo, dessin & manga, jeux vidéo, automobile, impression 3D, tech, création, voyages.',
  },
  {
    id: 'ps-2',
    category: 'Passions',
    persona: 'quentin',
    question: 'Pourquoi les jeux vidéo ?',
    answer:
      'Univers, level design, interaction… et maintenant aussi le métier de testeur (qualité & UX).',
  },
  {
    id: 'ps-3',
    category: 'Passions',
    persona: 'quentin',
    question: 'L’automobile t’inspire comment ?',
    answer: 'Les lignes, les matériaux, le design mécanique — une école visuelle permanente.',
  },
  // Projets
  {
    id: 'pj-1',
    category: 'Projets',
    persona: 'quentin',
    question: 'Où voir tes projets ?',
    answer:
      'Sur Projets (manoir jouable), Livre (portfolio) et Laboratoire. Beaucoup d’emplacements attendent tes vrais fichiers.',
  },
  {
    id: 'pj-2',
    category: 'Projets',
    persona: 'quentin',
    question: 'Tu prends des commandes ?',
    answer: 'Oui selon le brief : identité, print, 3D, web… Le plus simple est Contact.',
  },
  {
    id: 'pj-3',
    category: 'Projets',
    persona: 'quentin',
    question: 'Tu as un projet phare ?',
    answer:
      'Ce portfolio immersif en est un : intro, 3D, story, livre, jeu — un univers complet à faire évoluer.',
  },
  // Luminart persona
  {
    id: 'lu-1',
    category: 'Luminart',
    persona: 'luminart',
    question: 'C’est quoi Luminart ?',
    answer:
      'Luminart, c’est l’univers créatif de Quentin — lumière, identité visuelle, ambiance premium. On parle design qui brille sans crier.',
  },
  {
    id: 'lu-2',
    category: 'Luminart',
    persona: 'luminart',
    question: 'Quel est le style Luminart ?',
    answer:
      'Clean, lumineux, contrasté. Cyan / violet / accents rose, typo soignée, motion utile. Moins de bruit, plus de présence.',
  },
  {
    id: 'lu-3',
    category: 'Luminart',
    persona: 'luminart',
    question: 'Luminart fait quoi concrètement ?',
    answer:
      'Identités, supports, explorations graphiques et expériences digitales. Instagram : @luminart2dcs.',
  },
  {
    id: 'lu-4',
    category: 'Luminart',
    persona: 'luminart',
    question: 'Le logo Q vient de où ?',
    answer:
      'Le Q est le symbole personnel de Quentin, dessiné dans l’esprit Luminart : géométrie nette + glow maîtrisé.',
  },
  {
    id: 'lu-5',
    category: 'Luminart',
    persona: 'luminart',
    question: 'Vous travaillez sur ce portfolio ?',
    answer:
      'Oui — ce site est un terrain de jeu Luminart : intro Netflix, story immersive, livre, manoir, jeu 3D.',
  },
  {
    id: 'lu-6',
    category: 'Luminart',
    persona: 'luminart',
    question: 'Comment collabore-t-on avec Luminart ?',
    answer:
      'Envoie un brief clair via Contact. On cadre le besoin, on propose une direction, on itère jusqu’au rendu.',
  },
  {
    id: 'lu-7',
    category: 'Luminart',
    persona: 'luminart',
    question: 'Tu peux parler de ce portfolio immersif ?',
    answer:
      'Oui. Accueil galaxy + portrait orbital, Story type DM (couleurs GTA VI), manoir des cadres, livre à flips, jeu Nebula Whiskers — un seul univers cohérent.',
  },
  {
    id: 'lu-8',
    category: 'Luminart',
    persona: 'luminart',
    question: 'Quelles technos derrière le site ?',
    answer:
      'React, Vite, Tailwind, Framer Motion, Three.js / React Three Fiber. Motion utile, pas du bruit.',
  },
  {
    id: 'lu-9',
    category: 'Luminart',
    persona: 'luminart',
    question: 'C’est quoi la signature Luminart ?',
    answer:
      '« Create your own universe. » Chaque projet a ses règles, sa lumière, son identité — on les rend visibles.',
  },
  {
    id: 'lu-10',
    category: 'Projets',
    persona: 'luminart',
    question: 'Quels projets Luminart met en avant ?',
    answer:
      'Identités, print, proto 3D, expériences web. Les emplacements du manoir et du livre sont prêts à recevoir tes vrais livrables.',
  },
  {
    id: 'id-5',
    category: 'Identité',
    persona: 'quentin',
    question: 'Où es-tu basé ?',
    answer: 'Marseille, France. Dispo pour collabs en remote ou sur place selon le projet.',
  },
  {
    id: 'cp-6',
    category: 'Compétences',
    persona: 'quentin',
    question: 'Tu fais de la QA jeux vidéo ?',
    answer:
      'Oui, en formation : rapports de bugs, cas de test, regard critique UX / gameplay.',
  },
  {
    id: 'ps-4',
    category: 'Passions',
    persona: 'quentin',
    question: 'Tu fais de la photo ?',
    answer:
      'Oui — portrait, produit, lumière. Ça nourrit le graphisme et le portfolio.',
  },
  {
    id: 'ft-4',
    category: 'Futur',
    persona: 'luminart',
    question: 'Luminart, prochaine étape ?',
    answer:
      'Monter encore en immersion, documenter de vrais projets, et pousser la fabrication numérique.',
  },
  // Travail
  {
    id: 'tr-1',
    category: 'Travail',
    persona: 'quentin',
    question: 'Comment se passe une collab ?',
    answer:
      'Brief → proposition → itérations → livraison. Transparence sur délais et contraintes.',
  },
  {
    id: 'tr-2',
    category: 'Travail',
    persona: 'quentin',
    question: 'Tu fais aussi de la vente / conseil ?',
    answer:
      'Oui : accueil, écoute du besoin, argumentation, fidélisation et suivi client.',
  },
  {
    id: 'tr-3',
    category: 'Travail',
    persona: 'quentin',
    question: 'Tu préfères quel type de mission ?',
    answer:
      'Là où création et technique se croisent : identité + print, proto 3D, ou expérience web immersive.',
  },
  // Futur
  {
    id: 'ft-1',
    category: 'Futur',
    persona: 'quentin',
    question: 'Tes objectifs ?',
    answer:
      'Continuer à apprendre, monter en compétences et bâtir des projets ambitieux — notamment fabrication numérique.',
  },
  {
    id: 'ft-2',
    category: 'Futur',
    persona: 'quentin',
    question: 'Pourquoi « Create your own universe » ?',
    answer:
      'Parce que chaque projet est un univers : règles, ambiance, identité. Mon rôle : le rendre visible et vivant.',
  },
  {
    id: 'ft-3',
    category: 'Futur',
    persona: 'quentin',
    question: 'Tu veux créer une activité ?',
    answer:
      'Oui — polyvalence impression 3D / création d’activité fait partie de mon horizon.',
  },
]
