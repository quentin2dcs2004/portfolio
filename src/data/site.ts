export const site = {
  name: 'Quentin',
  fullName: 'Quentin Da Costa Soares',
  tagline:
    'Créatif polyvalent passionné par le graphisme, l’impression, la modélisation 3D, le développement numérique et la relation client.',
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
} as const

export const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/competences', label: 'Compétences' },
  { to: '/projets', label: 'Projets' },
  { to: '/parcours', label: 'Parcours' },
  { to: '/contact', label: 'Contact' },
] as const

export interface SkillSection {
  id: string
  title: string
  description: string
  items: string[]
  softwares: string[]
}

export const skills: SkillSection[] = [
  {
    id: 'graphisme',
    title: 'Graphisme',
    description:
      'Création d’identités visuelles et de supports de communication.',
    items: [
      'Logos',
      'Identité visuelle',
      'Affiches',
      'Flyers',
      'Supports imprimés',
      'Design graphique',
    ],
    softwares: ['Photoshop', 'Illustrator', 'InDesign', 'Canva', 'GIMP'],
  },
  {
    id: 'impression',
    title: 'Impression',
    description: 'Préparation de fichiers et suivi de production imprimée.',
    items: [
      'Impression numérique',
      'Grand format',
      'Sérigraphie',
      'Gestion des couleurs',
      'Façonnage',
    ],
    softwares: ['Photoshop', 'Illustrator'],
  },
  {
    id: 'modelisation',
    title: 'Modélisation 3D',
    description: 'Conception d’objets techniques ou artistiques en 3D.',
    items: [
      'Modélisation',
      'Conception technique',
      'Texturing',
      'Rendu 3D',
    ],
    softwares: ['Blender', 'Fusion 360', 'FreeCAD', 'SolidWorks'],
  },
  {
    id: 'impression3d',
    title: 'Impression 3D',
    description: 'Prototypage et optimisation d’impressions 3D.',
    items: [
      'Fichiers STL',
      'Tranchage',
      'Calibration',
      'Prototypage',
    ],
    softwares: ['Cura', 'Simplify3D'],
  },
  {
    id: 'developpement',
    title: 'Développement',
    description: 'Création et intégration de sites et interfaces web.',
    items: ['HTML', 'CSS', 'JavaScript', 'Intégration web', 'UI'],
    softwares: ['Visual Studio Code', 'GitHub', 'Figma'],
  },
  {
    id: 'vente-conseil',
    title: 'Vente & conseil',
    description: 'Accueil client, conseil commercial et accompagnement.',
    items: [
      'Accueil',
      'Conseil',
      'Argumentation',
      'Fidélisation',
      'Suivi client',
    ],
    softwares: [],
  },
]

export type ProjectCategory =
  | 'Graphisme'
  | 'Impression'
  | 'Modélisation 3D'
  | 'Impression 3D'
  | 'Développement web'
  | 'Projets personnels'

export interface Project {
  id: string
  title: string
  category: ProjectCategory
  date: string
  summary: string
  description: string
  technologies: string[]
  image: string
  placeholder?: boolean
}

export const projects: Project[] = [
  {
    id: 'identite-visuelle',
    title: 'Identité visuelle — à compléter',
    category: 'Graphisme',
    date: 'À renseigner',
    summary: 'Création d’une identité visuelle (logo, charte, déclinaisons).',
    description:
      'Ajoute ici la description complète du projet : brief, process et livrables.',
    technologies: ['Illustrator', 'Photoshop'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'piece-3d',
    title: 'Pièce 3D — à compléter',
    category: 'Modélisation 3D',
    date: 'À renseigner',
    summary: 'Modélisation d’une pièce pour visualisation ou impression.',
    description: 'Détaille le logiciel utilisé, les contraintes et le résultat.',
    technologies: ['Blender', 'Fusion 360'],
    image: '/images/quentin.jpg',
    placeholder: true,
  },
  {
    id: 'prototype-impression',
    title: 'Prototype imprimé — à compléter',
    category: 'Impression 3D',
    date: 'À renseigner',
    summary: 'Prototypage d’un objet via impression 3D.',
    description: 'Indique les paramètres d’impression et les itérations.',
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
    description: 'Ajoute la stack et les pages réalisées.',
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
    description: 'Documente ici une exploration personnelle.',
    technologies: ['Création'],
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
]

export interface TimelineEvent {
  id: string
  year: string
  title: string
  type: string
  summary: string
  details: string
  verified: boolean
}

export const timeline: TimelineEvent[] = [
  {
    id: 'bac-pro',
    year: 'Diplôme',
    title: 'Bac Pro RPIP',
    type: 'Diplôme',
    summary: 'Réalisation de Produits Imprimés et Plurimédia.',
    details:
      'Formation orientée numérique et impression, base pour le graphisme et les supports imprimés.',
    verified: true,
  },
  {
    id: 'testeur',
    year: 'En cours',
    title: 'Formation testeur de jeux vidéo',
    type: 'Formation',
    summary: 'Allier passion du jeu et compétences analytiques.',
    details: 'Parcours orienté qualité logicielle et test de jeux vidéo.',
    verified: true,
  },
  {
    id: 'exp-placeholder',
    year: 'À renseigner',
    title: 'Expérience professionnelle — à compléter',
    type: 'Expérience',
    summary: 'Ajoute ici tes expériences, stages et missions.',
    details: 'Emplacement modifiable : poste, entreprise, missions.',
    verified: false,
  },
  {
    id: '3d-ambition',
    year: 'Objectif',
    title: 'Développement en impression 3D',
    type: 'Évolution',
    summary: 'Devenir polyvalent dans la fabrication numérique.',
    details:
      'Objectifs : matières recyclables, design, pièces techniques, et à terme créer une activité.',
    verified: true,
  },
]
