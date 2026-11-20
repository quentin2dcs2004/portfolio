export const site = {
  name: 'Quentin',
  fullName: 'Quentin Da Costa Soares',
  signature: 'QUENTIN – CREATE YOUR OWN UNIVERSE.',
  tagline:
    'Je suis un créatif polyvalent passionné par le graphisme, l’impression, la modélisation 3D, le développement numérique et la relation client.',
  greeting: 'Bonjour, je m’appelle Quentin.',
  photo: '/images/quentin.jpg',
  email: 'quentindacostaso@gmail.com',
  phone: '07 86 73 77 92',
  location: 'Marseille, France',
  socials: {
    linkedin: 'https://fr.linkedin.com/in/quentin-da-costa-soares-443b7b290',
    instagram: 'https://www.instagram.com/quentin_da_costa_soares/',
    instagramArt: 'https://www.instagram.com/luminart2dcs',
    facebook: 'https://www.facebook.com/profile.php?id=100010545675950',
    github: '',
  },
  rotatingRoles: [
    'Graphiste',
    'Imprimeur',
    'Modélisateur 3D',
    'Imprimeur 3D',
    'Développeur',
    'Vendeur',
    'Conseiller',
  ],
} as const

export const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/apprendre', label: 'Apprendre' },
  { to: '/story', label: 'Story' },
  { to: '/projets', label: 'Projets' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/materiel', label: 'Matériel' },
  { to: '/parcours', label: 'Parcours' },
  { to: '/passions', label: 'Passions' },
  { to: '/laboratoire', label: 'Laboratoire' },
  { to: '/contact', label: 'Contact' },
] as const

export type SkillId =
  | 'graphisme'
  | 'impression'
  | 'modelisation'
  | 'impression3d'
  | 'developpement'
  | 'vente'
  | 'conseil'

export interface SkillSection {
  id: SkillId
  title: string
  subtitle: string
  description: string
  items: string[]
  softwares: string[]
  accent: string
}

export const skills: SkillSection[] = [
  {
    id: 'graphisme',
    title: 'Graphisme',
    subtitle: 'Identités & supports visuels',
    description:
      'Créer des univers graphiques cohérents, du logo aux supports imprimés, avec une attention particulière aux couleurs, aux formes et au message.',
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
    accent: '#176BFF',
  },
  {
    id: 'impression',
    title: 'Impression',
    subtitle: 'Du fichier à l’objet imprimé',
    description:
      'Maîtriser la chaîne d’impression pour garantir un rendu fidèle : préparation des fichiers, gestion des couleurs et finitions.',
    items: [
      'Impression numérique',
      'Impression grand format',
      'Sérigraphie',
      'Préparation des fichiers',
      'Gestion des couleurs',
      'Façonnage',
      'Supports publicitaires',
    ],
    softwares: ['RIP / flux impression', 'Photoshop', 'Illustrator'],
    accent: '#00E5FF',
  },
  {
    id: 'modelisation',
    title: 'Modélisation 3D',
    subtitle: 'Concevoir des formes dans l’espace',
    description:
      'Modéliser des objets techniques ou artistiques, texturer et préparer des rendus pour la visualisation ou la fabrication.',
    items: [
      'Modélisation d’objets',
      'Création de pièces',
      'Conception technique',
      'Modélisation artistique',
      'Texturing',
      'Rendu 3D',
    ],
    softwares: ['Blender', 'Fusion 360', 'FreeCAD', 'SolidWorks'],
    accent: '#8B5CF6',
  },
  {
    id: 'impression3d',
    title: 'Impression 3D',
    subtitle: 'Prototyper et fabriquer',
    description:
      'Transformer un modèle numérique en objet réel : tranchage, calibration, optimisation et prototypage rapide.',
    items: [
      'Préparation des fichiers STL',
      'Tranchage',
      'Paramétrage des impressions',
      'Calibration des imprimantes',
      'Optimisation des impressions',
      'Prototypage',
    ],
    softwares: ['Cura', 'Simplify3D'],
    accent: '#176BFF',
  },
  {
    id: 'developpement',
    title: 'Développement',
    subtitle: 'Interfaces & web interactif',
    description:
      'Construire des interfaces web modernes, intégrer des designs et explorer le développement interactif.',
    items: [
      'HTML',
      'CSS',
      'JavaScript',
      'Création de sites web',
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
    subtitle: 'Relation client & conseil commercial',
    description:
      'Accueillir, écouter et accompagner les clients pour répondre à leurs besoins avec clarté et professionnalisme.',
    items: [
      'Accueil des clients',
      'Conseil commercial',
      'Argumentation commerciale',
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
    subtitle: 'Accompagner et trouver des solutions',
    description:
      'Analyser un besoin, proposer des solutions adaptées et assurer un suivi jusqu’à la satisfaction.',
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
]

export type ProjectCategory =
  | 'Graphisme'
  | 'Impression'
  | 'Modélisation 3D'
  | 'Impression 3D'
  | 'Développement web'
  | 'Projets personnels'
  | 'Communication visuelle'

export interface Project {
  id: string
  title: string
  category: ProjectCategory
  date: string
  summary: string
  description: string
  technologies: string[]
  image: string
  featured?: boolean
  placeholder?: boolean
}

/** Emplacements modifiables — ne pas inventer de réalisations réelles. */
export const projects: Project[] = [
  {
    id: 'identite-visuelle',
    title: 'Identité visuelle — à compléter',
    category: 'Graphisme',
    date: 'À renseigner',
    summary: 'Création d’une identité visuelle (logo, charte, déclinaisons).',
    description:
      'Ajoute ici la description complète du projet : brief, process, livrables et résultat.',
    technologies: ['Illustrator', 'Photoshop'],
    image: '/images/quentin.jpg',
    featured: true,
    placeholder: true,
  },
  {
    id: 'affiche-campagne',
    title: 'Affiche / campagne — à compléter',
    category: 'Communication visuelle',
    date: 'À renseigner',
    summary: 'Conception d’une affiche ou d’une campagne visuelle.',
    description: 'Remplace ce texte par le contexte, les objectifs et le rendu final.',
    technologies: ['Photoshop', 'InDesign'],
    image: '/images/quentin.jpg',
    featured: true,
    placeholder: true,
  },
  {
    id: 'piece-3d',
    title: 'Pièce 3D — à compléter',
    category: 'Modélisation 3D',
    date: 'À renseigner',
    summary: 'Modélisation et préparation d’une pièce pour visualisation ou impression.',
    description: 'Détaille le logiciel utilisé, les contraintes techniques et le résultat.',
    technologies: ['Blender', 'Fusion 360'],
    image: '/images/quentin.jpg',
    featured: true,
    placeholder: true,
  },
  {
    id: 'prototype-impression',
    title: 'Prototype imprimé — à compléter',
    category: 'Impression 3D',
    date: 'À renseigner',
    summary: 'Prototypage d’un objet via impression 3D.',
    description: 'Indique les paramètres d’impression, le filament et les itérations.',
    technologies: ['Cura', 'STL'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'site-web',
    title: 'Site web — à compléter',
    category: 'Développement web',
    date: 'À renseigner',
    summary: 'Conception et intégration d’une interface web.',
    description: 'Ajoute la stack, les pages réalisées et les points forts UX.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'support-imprime',
    title: 'Support imprimé — à compléter',
    category: 'Impression',
    date: 'À renseigner',
    summary: 'Préparation et impression d’un support publicitaire.',
    description: 'Précise le format, le type d’impression et les finitions.',
    technologies: ['InDesign', 'Impression numérique'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'projet-personnel',
    title: 'Projet personnel — à compléter',
    category: 'Projets personnels',
    date: 'À renseigner',
    summary: 'Expérimentation créative libre.',
    description: 'Documente ici une exploration personnelle (photo, dessin, 3D…).',
    technologies: ['Création', 'Exploration'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
]

export const projectCategories: Array<ProjectCategory | 'Tous'> = [
  'Tous',
  'Graphisme',
  'Impression',
  'Modélisation 3D',
  'Impression 3D',
  'Développement web',
  'Projets personnels',
  'Communication visuelle',
]

export interface BookPage {
  id: string
  title: string
  date: string
  softwares: string[]
  objectives: string
  challenges: string
  result: string
  image: string
  placeholder?: boolean
}

export const bookPages: BookPage[] = [
  {
    id: 'cover',
    title: 'Quentin – Creative Portfolio',
    date: '',
    softwares: [],
    objectives: '',
    challenges: '',
    result: '',
    image: '/images/quentin.jpg',
  },
  {
    id: 'page-1',
    title: 'Projet 01 — À compléter',
    date: 'À renseigner',
    softwares: ['Illustrator', 'Photoshop'],
    objectives: 'Décrire ici l’objectif du projet.',
    challenges: 'Décrire les difficultés rencontrées.',
    result: 'Décrire le résultat final.',
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'page-2',
    title: 'Projet 02 — À compléter',
    date: 'À renseigner',
    softwares: ['Blender'],
    objectives: 'Décrire ici l’objectif du projet.',
    challenges: 'Décrire les difficultés rencontrées.',
    result: 'Décrire le résultat final.',
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'page-3',
    title: 'Projet 03 — À compléter',
    date: 'À renseigner',
    softwares: ['HTML', 'CSS', 'JavaScript'],
    objectives: 'Décrire ici l’objectif du projet.',
    challenges: 'Décrire les difficultés rencontrées.',
    result: 'Décrire le résultat final.',
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'page-4',
    title: 'Projet 04 — À compléter',
    date: 'À renseigner',
    softwares: ['Cura'],
    objectives: 'Décrire ici l’objectif du projet.',
    challenges: 'Décrire les difficultés rencontrées.',
    result: 'Décrire le résultat final.',
    image: '/images/quentin.jpg',
    placeholder: true,
  },
]

export interface GearItem {
  id: string
  category: 'Ordinateurs' | 'Impression 3D' | 'Appareils photo' | 'Périphériques' | 'Logiciels' | 'Accessoires'
  name: string
  usage: string
  specs: string[]
  image: string
  placeholder?: boolean
}

export const gear: GearItem[] = [
  {
    id: 'pc',
    category: 'Ordinateurs',
    name: 'Station de travail — à compléter',
    usage: 'Création graphique, 3D et développement.',
    specs: ['CPU : à renseigner', 'GPU : à renseigner', 'RAM : à renseigner'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'printer-3d',
    category: 'Impression 3D',
    name: 'Imprimante 3D — à compléter',
    usage: 'Prototypage et fabrication de pièces.',
    specs: ['Technologie : FDM (à confirmer)', 'Volume : à renseigner'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'camera',
    category: 'Appareils photo',
    name: 'Appareil photo — à compléter',
    usage: 'Photographie et captation visuelle.',
    specs: ['Type : à renseigner', 'Objectif : à renseigner'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'peripherals',
    category: 'Périphériques',
    name: 'Tablette graphique / périphériques — à compléter',
    usage: 'Dessin, retouche et précision.',
    specs: ['Modèle : à renseigner'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'software',
    category: 'Logiciels',
    name: 'Suite créative',
    usage: 'Outils utilisés au quotidien.',
    specs: [
      'Photoshop, Illustrator, InDesign, Canva, GIMP',
      'Blender, Fusion 360, FreeCAD, SolidWorks',
      'Cura, Simplify3D',
      'VS Code, GitHub, Figma',
    ],
    image: '/images/quentin.jpg',
  },
  {
    id: 'accessories',
    category: 'Accessoires',
    name: 'Accessoires — à compléter',
    usage: 'Éclairage, stockage, outils de finition…',
    specs: ['À renseigner'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
]

export interface TimelineEvent {
  id: string
  year: string
  title: string
  type: 'Formation' | 'Diplôme' | 'Expérience' | 'Stage' | 'Projet' | 'Évolution'
  summary: string
  details: string
  verified: boolean
}

/** Uniquement les éléments confirmés dans le site existant + emplacements. */
export const timeline: TimelineEvent[] = [
  {
    id: 'bac-pro',
    year: 'Diplôme',
    title: 'Bac Pro RPIP',
    type: 'Diplôme',
    summary: 'Réalisation de Produits Imprimés et Plurimédia.',
    details:
      'Formation immersée dans le monde du numérique et de l’impression, base solide pour le graphisme et les supports imprimés.',
    verified: true,
  },
  {
    id: 'testeur',
    year: 'En cours',
    title: 'Formation testeur de jeux vidéo',
    type: 'Formation',
    summary: 'Combiner passion pour les jeux et compétences analytiques.',
    details:
      'Parcours de formation orienté qualité logicielle et test de jeux vidéo.',
    verified: true,
  },
  {
    id: 'exp-placeholder',
    year: 'À renseigner',
    title: 'Expérience professionnelle — à compléter',
    type: 'Expérience',
    summary: 'Ajoute ici tes expériences, stages et missions.',
    details:
      'Emplacement modifiable : poste, entreprise, missions, compétences mobilisées.',
    verified: false,
  },
  {
    id: 'stage-placeholder',
    year: 'À renseigner',
    title: 'Stage — à compléter',
    type: 'Stage',
    summary: 'Documente un stage important.',
    details: 'Emplacement modifiable : structure d’accueil, durée, apprentissages.',
    verified: false,
  },
  {
    id: '3d-ambition',
    year: 'Ambition',
    title: 'Développement en impression 3D',
    type: 'Évolution',
    summary: 'Acquérir une polyvalence complète dans la fabrication numérique.',
    details:
      'Objectifs : matières recyclables, design intérieur/extérieur, pièces cosplay, pièces mécaniques, et à terme créer une activité.',
    verified: true,
  },
]

export const passions = [
  {
    id: 'photo',
    title: 'Photographie',
    description: 'Capturer des ambiances, des détails et des histoires en images.',
  },
  {
    id: 'dessin',
    title: 'Dessin et manga',
    description: 'Donner forme aux idées à travers le trait et la narration visuelle.',
  },
  {
    id: 'jeux',
    title: 'Jeux vidéo',
    description: 'Univers interactifs, design de gameplay et culture digitale.',
  },
  {
    id: 'auto',
    title: 'Automobile',
    description: 'Design, mécanique et esthétique des véhicules.',
  },
  {
    id: 'impression3d',
    title: 'Impression 3D',
    description: 'Passer de l’idée à l’objet physique, itération après itération.',
  },
  {
    id: 'tech',
    title: 'Nouvelles technologies',
    description: 'Explorer les outils qui façonnent le futur créatif.',
  },
  {
    id: 'creation',
    title: 'Création',
    description: 'Expérimenter librement entre graphisme, 3D et digital.',
  },
  {
    id: 'voyages',
    title: 'Voyages',
    description: 'S’inspirer des lieux, des cultures et des architectures.',
  },
] as const

export interface StoryThread {
  id: string
  contact: string
  avatar: string
  preview: string
  messages: Array<{
    from: 'them' | 'me'
    text: string
    time: string
  }>
}

export const storyThreads: StoryThread[] = [
  {
    id: 'qui-es-tu',
    contact: 'Exemple · Qui es-tu ?',
    avatar: 'Q?',
    preview: 'Quentin, tu peux te présenter ?',
    messages: [
      {
        from: 'them',
        text: 'Quentin, tu peux te présenter ?',
        time: '10:02',
      },
      {
        from: 'me',
        text: 'Je suis une personne créative et polyvalente. J’aime apprendre, découvrir de nouveaux domaines et transformer mes idées en projets concrets.',
        time: '10:03',
      },
    ],
  },
  {
    id: 'graphisme',
    contact: 'Exemple · Graphisme',
    avatar: 'GR',
    preview: 'Pourquoi avoir choisi le graphisme ?',
    messages: [
      {
        from: 'them',
        text: 'Pourquoi avoir choisi le graphisme ?',
        time: '11:14',
      },
      {
        from: 'me',
        text: 'Parce que j’aime donner vie aux idées, travailler les couleurs, les formes et créer des identités visuelles.',
        time: '11:15',
      },
    ],
  },
  {
    id: '3d',
    contact: 'Exemple · La 3D',
    avatar: '3D',
    preview: 'Tu fais aussi de la modélisation 3D ?',
    messages: [
      {
        from: 'them',
        text: 'Tu fais aussi de la modélisation 3D ?',
        time: '14:21',
      },
      {
        from: 'me',
        text: 'Oui ! J’aime concevoir des objets en 3D et découvrir les possibilités offertes par la fabrication numérique.',
        time: '14:22',
      },
    ],
  },
  {
    id: 'passions',
    contact: 'Exemple · Passions',
    avatar: '♥',
    preview: 'Qu’est-ce que tu aimes faire ?',
    messages: [
      {
        from: 'them',
        text: 'Qu’est-ce que tu aimes faire ?',
        time: '16:05',
      },
      {
        from: 'me',
        text: 'La photographie, le dessin, les jeux vidéo, l’automobile, la création, la 3D et les nouvelles technologies.',
        time: '16:06',
      },
    ],
  },
  {
    id: 'avenir',
    contact: 'Exemple · Avenir',
    avatar: '→',
    preview: 'Quels sont tes objectifs ?',
    messages: [
      {
        from: 'them',
        text: 'Quels sont tes objectifs ?',
        time: '18:40',
      },
      {
        from: 'me',
        text: 'Continuer à apprendre, développer mes compétences et construire des projets professionnels ambitieux.',
        time: '18:41',
      },
    ],
  },
  {
    id: 'parcours',
    contact: 'Exemple · Parcours',
    avatar: 'PR',
    preview: 'Tu as suivi quelle formation ?',
    messages: [
      {
        from: 'them',
        text: 'Tu as suivi quelle formation ?',
        time: '09:12',
      },
      {
        from: 'me',
        text: 'Je suis diplômé d’un Bac Pro RPIP. Aujourd’hui je poursuis une formation de testeur de jeux vidéo, pour allier analyse et passion du jeu.',
        time: '09:13',
      },
    ],
  },
  {
    id: 'personnalite',
    contact: 'Exemple · Personnalité',
    avatar: '✦',
    preview: 'Comment tu te définis ?',
    messages: [
      {
        from: 'them',
        text: 'Comment tu te définis au quotidien ?',
        time: '20:01',
      },
      {
        from: 'me',
        text: 'Curieux, déterminé et créatif. J’aime comprendre comment les choses fonctionnent, puis les améliorer avec du design et de la technique.',
        time: '20:02',
      },
    ],
  },
  {
    id: 'impression3d',
    contact: 'Exemple · Impression 3D',
    avatar: '🖨️',
    preview: 'Pourquoi l’impression 3D ?',
    messages: [
      {
        from: 'them',
        text: 'Pourquoi tu t’intéresses autant à l’impression 3D ?',
        time: '12:30',
      },
      {
        from: 'me',
        text: 'Parce qu’elle relie l’idée à l’objet. Je veux devenir polyvalent dans ce domaine et, à terme, créer mon activité.',
        time: '12:31',
      },
    ],
  },
]

export const labExperiments = [
  {
    id: 'graphiques',
    title: 'Expériences graphiques',
    description: 'Tests de composition, néons, nuanciers et typographies.',
    kind: 'graphique' as const,
  },
  {
    id: '3d',
    title: 'Expérimentations 3D',
    description: 'Objets flottants, hologrammes et caméras expérimentales.',
    kind: '3d' as const,
  },
  {
    id: 'animation',
    title: 'Tests d’animation',
    description: 'Micro-interactions, morphings et transitions cinématiques.',
    kind: 'animation' as const,
  },
  {
    id: 'technique',
    title: 'Démonstrations techniques',
    description: 'Shaders légers, particules et effets de profondeur.',
    kind: 'technique' as const,
  },
  {
    id: 'prototype',
    title: 'Prototypes',
    description: 'Interfaces expérimentales et concepts d’interaction.',
    kind: 'prototype' as const,
  },
  {
    id: 'web',
    title: 'Expériences web',
    description: 'Composants interactifs et démos front-end.',
    kind: 'web' as const,
  },
]
