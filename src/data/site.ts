export const site = {
  name: 'Quentin',
  fullName: 'Quentin Da Costa Soares',
  brand: 'Luminart',
  signature: 'QUENTIN – CREATE YOUR OWN UNIVERSE.',
  greeting: 'Bonjour, je m’appelle Quentin.',
  tagline:
    'Je suis un créatif polyvalent passionné par le graphisme, l’impression, la modélisation 3D, le développement numérique et la relation client.',
  photo: '/images/quentin.jpg',
  email: 'quentindacostaso@gmail.com',
  phone: '07 86 73 77 92',
  location: 'Marseille, France',
  socials: {
    linkedin: 'https://fr.linkedin.com/in/quentin-da-costa-soares-443b7b290',
    instagram: 'https://www.instagram.com/quentin_da_costa_soares/',
    instagramArt: 'https://www.instagram.com/luminart2dcs',
    facebook: 'https://www.facebook.com/profile.php?id=100010545675950',
  },
  roles: [
    'Graphiste',
    'Imprimeur',
    'Modélisateur 3D',
    'Imprimeur 3D',
    'Développeur',
    'Vendeur',
    'Conseiller',
  ],
  stats: [
    { label: 'Spécialités', value: 7 },
    { label: 'Projets (emplacements)', value: 6 },
    { label: 'Passions', value: 8 },
  ],
} as const

/** Primary nav — simple, few links (galaxy / Aureus style). */
export const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/story', label: 'Story' },
  { to: '/projets', label: 'Projets' },
  { to: '/portfolio', label: 'Livre' },
  { to: '/arena', label: 'Jeu' },
  { to: '/contact', label: 'Contact' },
] as const

/** Secondary pages — footer / menu “Plus”. */
export const moreLinks = [
  { to: '/apprendre', label: 'Apprendre' },
  { to: '/materiel', label: 'Matériel' },
  { to: '/parcours', label: 'Parcours' },
  { to: '/passions', label: 'Passions' },
  { to: '/laboratoire', label: 'Laboratoire' },
] as const

export const legalLinks = [
  { to: '/mentions-legales', label: 'Mentions légales' },
  { to: '/confidentialite', label: 'Confidentialité' },
  { to: '/cookies', label: 'Cookies' },
] as const

export const skills = [
  {
    id: 'graphisme',
    title: 'Graphisme',
    description:
      'Donner une identité aux idées : logos, supports et communication visuelle cohérente.',
    items: [
      'Création de logos',
      'Identité visuelle',
      'Affiches publicitaires',
      'Flyers',
      'Communication visuelle',
      'Supports imprimés',
      'Design graphique',
    ],
    softwares: ['Photoshop', 'Illustrator', 'InDesign', 'Canva', 'GIMP'],
    accent: '#8B5CF6',
  },
  {
    id: 'impression',
    title: 'Impression',
    description: 'De la préparation fichier à la production, avec exigence couleur et finition.',
    items: [
      'Impression numérique',
      'Impression grand format',
      'Sérigraphie',
      'Préparation des fichiers',
      'Gestion des couleurs',
      'Façonnage',
      'Supports publicitaires',
    ],
    softwares: ['Photoshop', 'Illustrator', 'InDesign'],
    accent: '#176BFF',
  },
  {
    id: 'modelisation',
    title: 'Modélisation 3D',
    description: 'Concevoir des objets techniques ou artistiques, du volume au rendu.',
    items: [
      'Modélisation d’objets',
      'Création de pièces',
      'Conception technique',
      'Modélisation artistique',
      'Texturing',
      'Rendu 3D',
    ],
    softwares: ['Blender', 'Fusion 360', 'FreeCAD', 'SolidWorks'],
    accent: '#00E5FF',
  },
  {
    id: 'impression3d',
    title: 'Impression 3D',
    description: 'Transformer un fichier en prototype physique, avec méthode et calibration.',
    items: [
      'Préparation STL',
      'Tranchage',
      'Paramétrage',
      'Calibration',
      'Optimisation',
      'Prototypage',
    ],
    softwares: ['Cura', 'Simplify3D'],
    accent: '#176BFF',
  },
  {
    id: 'developpement',
    title: 'Développement',
    description: 'Interfaces web, intégration et premières expériences interactives.',
    items: [
      'HTML',
      'CSS',
      'JavaScript',
      'Création de sites',
      'Interfaces utilisateur',
      'Intégration web',
      'Développement interactif',
    ],
    softwares: ['Visual Studio Code', 'GitHub', 'Figma'],
    accent: '#00E5FF',
  },
  {
    id: 'vente',
    title: 'Vente',
    description: 'Accueillir, comprendre le besoin et accompagner jusqu’à la décision.',
    items: [
      'Accueil clients',
      'Conseil commercial',
      'Argumentation',
      'Vente',
      'Gestion des besoins',
      'Fidélisation',
      'Relation client',
    ],
    softwares: [],
    accent: '#8B5CF6',
  },
  {
    id: 'conseil',
    title: 'Conseil',
    description: 'Analyser, proposer et suivre pour une satisfaction durable.',
    items: [
      'Analyse des besoins',
      'Accompagnement',
      'Recherche de solutions',
      'Présentation de produits',
      'Assistance client',
      'Suivi et satisfaction',
    ],
    softwares: [],
    accent: '#176BFF',
  },
] as const

export const projectCategories = [
  'Tous',
  'Graphisme',
  'Impression',
  'Modélisation 3D',
  'Impression 3D',
  'Développement',
  'Personnel',
  'Communication',
] as const

export const projects = [
  {
    id: 'p1',
    title: 'Identité visuelle — à compléter',
    category: 'Graphisme',
    date: 'À renseigner',
    summary: 'Logo, charte et déclinaisons.',
    description: 'Emplacement pour le brief, le process et les livrables du projet.',
    technologies: ['Illustrator', 'Photoshop'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'p2',
    title: 'Pièce 3D — à compléter',
    category: 'Modélisation 3D',
    date: 'À renseigner',
    summary: 'Modélisation pour visualisation ou fabrication.',
    description: 'Détaille logiciels, contraintes et résultat final.',
    technologies: ['Blender', 'Fusion 360'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'p3',
    title: 'Prototype imprimé — à compléter',
    category: 'Impression 3D',
    date: 'À renseigner',
    summary: 'Prototypage via impression 3D.',
    description: 'Paramètres, filament et itérations.',
    technologies: ['Cura', 'STL'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'p4',
    title: 'Site web — à compléter',
    category: 'Développement',
    date: 'À renseigner',
    summary: 'Interface et intégration web.',
    description: 'Stack, pages et points forts UX.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'p5',
    title: 'Support imprimé — à compléter',
    category: 'Impression',
    date: 'À renseigner',
    summary: 'Préparation et impression publicitaire.',
    description: 'Format, type d’impression et finitions.',
    technologies: ['InDesign'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'p6',
    title: 'Campagne visuelle — à compléter',
    category: 'Communication',
    date: 'À renseigner',
    summary: 'Communication visuelle multi-supports.',
    description: 'Emplacement pour une campagne ou un ensemble de supports.',
    technologies: ['Illustrator', 'Photoshop'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
] as const

export const timeline = [
  {
    id: 'bac',
    year: 'Diplôme',
    title: 'Bac Pro RPIP',
    summary: 'Réalisation de Produits Imprimés et Plurimédia.',
    details: 'Base solide en numérique, graphisme et impression.',
    verified: true,
  },
  {
    id: 'jv',
    year: 'En cours',
    title: 'Formation testeur de jeux vidéo',
    summary: 'Allier passion du jeu et analyse qualité.',
    details: 'Parcours orienté test et qualité logicielle.',
    verified: true,
  },
  {
    id: 'exp',
    year: 'À renseigner',
    title: 'Expérience — à compléter',
    summary: 'Ajoute ici tes expériences et stages.',
    details: 'Emplacement modifiable dans src/data/site.ts.',
    verified: false,
  },
  {
    id: '3d',
    year: 'Ambition',
    title: 'Impression 3D & création d’activité',
    summary: 'Devenir polyvalent en fabrication numérique.',
    details: 'Matières recyclables, design, pièces techniques, entrepreneuriat.',
    verified: true,
  },
] as const

export const passions = [
  { id: 'photo', title: 'Photographie', text: 'Capturer ambiances et détails.' },
  { id: 'dessin', title: 'Dessin & manga', text: 'Le trait et la narration visuelle.' },
  { id: 'jeux', title: 'Jeux vidéo', text: 'Univers interactifs et design.' },
  { id: 'auto', title: 'Automobile', text: 'Design et esthétique mécanique.' },
  { id: 'i3d', title: 'Impression 3D', text: 'De l’idée à l’objet.' },
  { id: 'tech', title: 'Technologies', text: 'Outils du futur créatif.' },
  { id: 'crea', title: 'Création', text: 'Exploration libre.' },
  { id: 'voyage', title: 'Voyages', text: 'Inspiration des lieux.' },
] as const

export const gear = [
  {
    id: 'pc',
    category: 'Ordinateurs',
    name: 'Station de travail — à compléter',
    usage: 'Création, 3D et développement.',
    specs: ['CPU : à renseigner', 'GPU : à renseigner', 'RAM : à renseigner'],
  },
  {
    id: 'p3d',
    category: 'Impression 3D',
    name: 'Imprimante 3D — à compléter',
    usage: 'Prototypage et fabrication.',
    specs: ['Technologie : à renseigner', 'Volume : à renseigner'],
  },
  {
    id: 'cam',
    category: 'Appareils photo',
    name: 'Appareil photo — à compléter',
    usage: 'Captation visuelle.',
    specs: ['Modèle : à renseigner'],
  },
  {
    id: 'periph',
    category: 'Périphériques',
    name: 'Périphériques — à compléter',
    usage: 'Tablette graphique, écrans, stockage…',
    specs: ['À renseigner'],
  },
  {
    id: 'soft',
    category: 'Logiciels',
    name: 'Suite créative',
    usage: 'Outils du quotidien.',
    specs: ['Adobe / GIMP / Canva', 'Blender / Fusion / FreeCAD', 'Cura', 'VS Code / Figma'],
  },
  {
    id: 'acc',
    category: 'Accessoires',
    name: 'Accessoires — à compléter',
    usage: 'Éclairage, supports, câbles…',
    specs: ['À renseigner'],
  },
] as const

/** Book spreads: each entry is a left+right page pair after cover. */
export const bookSpreads = [
  {
    id: 'cover',
    kind: 'cover' as const,
    title: 'Quentin – Creative Portfolio',
    subtitle: 'Create your own universe',
  },
  {
    id: 's1',
    kind: 'spread' as const,
    left: {
      title: 'Identité visuelle',
      text: 'Emplacement : brief, process et livrables. Ajoute ta photo de projet à gauche.',
      image: '/images/quentin.jpg',
      caption: 'Photo projet — à remplacer',
    },
    right: {
      title: 'Notes techniques',
      text: 'Logiciels : Illustrator, Photoshop.\nObjectifs : identité claire et déclinable.\nRésultat : à documenter.',
      image: null as string | null,
      caption: null as string | null,
    },
  },
  {
    id: 's2',
    kind: 'spread' as const,
    left: {
      title: 'Modélisation 3D',
      text: 'Emplacement pour une pièce ou scène 3D — contraintes, rendu, itérations.',
      image: '/images/quentin.jpg',
      caption: 'Rendu / capture — à remplacer',
    },
    right: {
      title: 'Pipeline',
      text: 'Logiciels : Blender, Fusion 360.\nDifficultés : à documenter.\nLivrable : visualisation ou fabrication.',
      image: null,
      caption: null,
    },
  },
  {
    id: 's3',
    kind: 'spread' as const,
    left: {
      title: 'Prototype imprimé',
      text: 'Du STL à l’objet : tranchage, calibration, filament, essais.',
      image: '/images/quentin.jpg',
      caption: 'Photo du prototype — à remplacer',
    },
    right: {
      title: 'Paramètres',
      text: 'Outils : Cura, Simplify3D.\nObjectif : valider un prototype physique.\nNotes : à compléter.',
      image: null,
      caption: null,
    },
  },
  {
    id: 's4',
    kind: 'spread' as const,
    left: {
      title: 'Expérience web',
      text: 'Interfaces, motion, intégration — ce portfolio en est un exemple vivant.',
      image: '/images/quentin.jpg',
      caption: 'Capture UI — à remplacer',
    },
    right: {
      title: 'Stack',
      text: 'HTML, CSS, JavaScript, React, Three.js.\nFocus : immersion + clarté.\nSuite : à documenter.',
      image: null,
      caption: null,
    },
  },
  {
    id: 'end',
    kind: 'cover' as const,
    title: 'Fin du volume',
    subtitle: 'QUENTIN – CREATE YOUR OWN UNIVERSE.',
  },
] as const

export const labExperiments = [
  {
    id: 'particles',
    title: 'Champ de particules',
    type: 'Démo technique',
    text: 'Particules réactives au curseur sur l’accueil (Three.js).',
  },
  {
    id: 'intro-q',
    title: 'Intro cinématique Q',
    type: 'Animation',
    text: 'Construction lumineuse du logo Q façon intro Netflix.',
  },
  {
    id: 'cat',
    title: 'Chat noir & cadres',
    type: 'Jeu / UX',
    text: 'Personnage chat noir, flèches + Espace pour entrer dans un monde de livres magiques.',
  },
  {
    id: 'book',
    title: 'Livre double page',
    type: 'Prototype UX',
    text: 'Ouverture en double page photo + texte.',
  },
  {
    id: 'story-ui',
    title: 'Story messagerie',
    type: 'Expérience UI',
    text: 'Interface type Instagram DM pour découvrir Quentin.',
  },
  {
    id: 'placeholder',
    title: 'Essai à documenter',
    type: 'Emplacement',
    text: 'Ajoute ici une expérimentation 3D, un test d’animation ou un prototype.',
  },
] as const
