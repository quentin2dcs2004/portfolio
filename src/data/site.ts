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
    level: 'Fort',
    description: 'Identités, supports et communication visuelle cohérente.',
    items: ['Logos', 'Charte graphique', 'Affiches', 'Flyers', 'Réseaux sociaux', 'Packaging (bases)', 'Retouche photo'],
    softwares: ['Photoshop', 'Illustrator', 'InDesign', 'Canva', 'GIMP'],
    accent: '#FF46A2',
  },
  {
    id: 'impression',
    title: 'Impression',
    level: 'Fort',
    description: 'Chaîne graphique print : fichier, couleur, production, finitions.',
    items: ['Numérique', 'Grand format', 'Sérigraphie', 'BAT / contrôles', 'Façonnage', 'Gestion colorimétrique'],
    softwares: ['Photoshop', 'Illustrator', 'InDesign'],
    accent: '#00F5D4',
  },
  {
    id: 'modelisation',
    title: 'Modélisation 3D',
    level: 'En progression',
    description: 'Objets techniques et artistiques, du volume au rendu.',
    items: ['Modélisation', 'Conception technique', 'Texturing', 'Rendu', 'Assemblages'],
    softwares: ['Blender', 'Fusion 360', 'FreeCAD', 'SolidWorks'],
    accent: '#7C5CFF',
  },
  {
    id: 'impression3d',
    title: 'Impression 3D',
    level: 'En progression',
    description: 'Du STL au prototype physique.',
    items: ['Préparation STL', 'Tranchage', 'Calibration', 'Optimisation', 'Prototypage'],
    softwares: ['Cura', 'Simplify3D'],
    accent: '#4CC9F0',
  },
  {
    id: 'developpement',
    title: 'Développement web',
    level: 'En progression',
    description: 'Sites, UI et expériences interactives.',
    items: ['HTML', 'CSS', 'JavaScript', 'React (bases)', 'Three.js (bases)', 'Intégration', 'Git'],
    softwares: ['VS Code', 'GitHub', 'Figma'],
    accent: '#00F5D4',
  },
  {
    id: 'uiux',
    title: 'UI / UX',
    level: 'En progression',
    description: 'Maquettes, parcours utilisateur, clarté visuelle.',
    items: ['Wireframes', 'Maquettes', 'Design system (bases)', 'Accessibilité (bases)'],
    softwares: ['Figma', 'Canva'],
    accent: '#FFB020',
  },
  {
    id: 'photo',
    title: 'Photographie',
    level: 'Passion',
    description: 'Captation et cadrage pour la création.',
    items: ['Portrait', 'Produit (bases)', 'Lumière', 'Retouche'],
    softwares: ['Photoshop', 'Lightroom (bases)'],
    accent: '#FF46A2',
  },
  {
    id: 'qa',
    title: 'Test / QA jeux vidéo',
    level: 'En formation',
    description: 'Analyse qualité, bugs, scénarios de test.',
    items: ['Rapports de bugs', 'Cas de test', 'UX critique', 'Relecture build'],
    softwares: ['Outils QA (selon formation)'],
    accent: '#7C5CFF',
  },
  {
    id: 'vente',
    title: 'Vente',
    level: 'Solide',
    description: 'Accueil, argumentation, closing et relation client.',
    items: ['Accueil', 'Conseil', 'Argumentation', 'Fidélisation'],
    softwares: [],
    accent: '#FFB020',
  },
  {
    id: 'conseil',
    title: 'Conseil',
    level: 'Solide',
    description: 'Analyse du besoin et accompagnement jusqu’à la solution.',
    items: ['Écoute active', 'Diagnostic', 'Présentation produit', 'Suivi'],
    softwares: [],
    accent: '#00F5D4',
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
    title: 'Identité visuelle Luminart',
    category: 'Graphisme',
    date: '2024 — en cours',
    summary: 'Logo Q, charte et déclinaisons lumineuses.',
    description:
      'Construction d’une identité personnelle claire : symbole Q, palette cyan / rose / violet, règles de glow et typographies Syne + Sora.',
    brief:
      'Créer une marque reconnaissable pour Quentin / Luminart, utilisable en digital, print et intro cinématique.',
    process: [
      'Recherche moodboards & références galaxy / premium',
      'Esquisses du Q géométrique',
      'Palette GTA-VI-inspired (cyan, rose, violet)',
      'Déclinaisons logo, favicon, intro Netflix-like',
    ],
    deliverables: ['Logo Q', 'Charte couleurs', 'Templates social', 'Intro animée'],
    materials: ['Illustrator', 'Photoshop', 'Figma', 'After Effects (bases)'],
    technologies: ['Illustrator', 'Photoshop', 'Figma'],
    image: '/images/quentin.jpg',
    gallery: ['/images/quentin.jpg', '/images/quentin.jpg'],
    accent: '#FF46A2',
    roomTheme: 'atelier' as const,
    placeholder: false,
  },
  {
    id: 'p2',
    title: 'Objet 3D technique',
    category: 'Modélisation 3D',
    date: 'À documenter',
    summary: 'Volume, contraintes, rendu.',
    description:
      'Modélisation d’une pièce pour visualisation et/ou fabrication : topologie propre, contraintes d’assemblage, rendu lumière.',
    brief: 'Passer d’une idée à un volume exploitable (visuel ou usinage / impression).',
    process: [
      'Brief dimensions & usage',
      'Blocage volumes (Blender / Fusion)',
      'Détails, chanfreins, assemblages',
      'Rendu + export STL / captures',
    ],
    deliverables: ['Fichier 3D', 'Rendu', 'STL préparé'],
    materials: ['Blender', 'Fusion 360', 'Station GPU'],
    technologies: ['Blender', 'Fusion 360'],
    image: '/images/quentin.jpg',
    gallery: ['/images/quentin.jpg'],
    accent: '#7C5CFF',
    roomTheme: 'studio3d' as const,
    placeholder: true,
  },
  {
    id: 'p3',
    title: 'Prototype FDM',
    category: 'Impression 3D',
    date: 'À documenter',
    summary: 'Du STL à la pièce physique.',
    description:
      'Chaîne complète : tranchage, calibration, filament, itérations jusqu’au proto touchable.',
    brief: 'Produire un prototype fiable pour test forme / assemblage.',
    process: [
      'Préparation STL & orientation',
      'Profil Cura (couches, fills, supports)',
      'Impression + contrôle qualité',
      'Retouches & nouvelle itération',
    ],
    deliverables: ['Pièce imprimée', 'Fiche paramètres', 'Photos proto'],
    materials: ['PLA / PETG', 'Cura', 'Imprimante FDM'],
    technologies: ['Cura', 'STL'],
    image: '/images/quentin.jpg',
    gallery: ['/images/quentin.jpg'],
    accent: '#4CC9F0',
    roomTheme: 'atelier' as const,
    placeholder: true,
  },
  {
    id: 'p4',
    title: 'Portfolio immersif',
    category: 'Développement',
    date: '2025 — 2026',
    summary: 'Site univers React + Three.js.',
    description:
      'Expérience web complète : intro Q, Story DM, manoir projets, livre, jeu Nebula Whiskers, pages compétences.',
    brief: 'Montrer le savoir-faire créatif + technique dans un seul univers jouable.',
    process: [
      'Architecture React / Vite / Tailwind',
      'Scènes R3F (galaxy, manoir, arena)',
      'Story typing + livre flip',
      'Polish motion & accessibilité',
    ],
    deliverables: ['Site live', 'Composants 3D', 'Design system sombre'],
    materials: ['VS Code', 'GitHub', 'Three.js', 'Framer Motion'],
    technologies: ['React', 'Three.js', 'Tailwind', 'Vite'],
    image: '/images/quentin.jpg',
    gallery: ['/images/quentin.jpg', '/images/quentin.jpg'],
    accent: '#00F5D4',
    roomTheme: 'cyber' as const,
    placeholder: false,
  },
  {
    id: 'p5',
    title: 'Chaîne print atelier',
    category: 'Impression',
    date: 'Formation RPIP',
    summary: 'Fichier → couleur → façonnage.',
    description:
      'Mise en œuvre atelier : préparation fichier, BAT, numérique / grand format, finitions.',
    brief: 'Livrer un support print conforme, propre et contrôlé.',
    process: [
      'Mise en page InDesign / Illustrator',
      'Gestion colorimétrique & BAT',
      'Impression numérique / grand format',
      'Façonnage & contrôle final',
    ],
    deliverables: ['Fichier print', 'BAT', 'Tirage'],
    materials: ['InDesign', 'Illustrator', 'Atelier print'],
    technologies: ['InDesign', 'Photoshop'],
    image: '/images/quentin.jpg',
    gallery: ['/images/quentin.jpg'],
    accent: '#FFB020',
    roomTheme: 'print' as const,
    placeholder: true,
  },
  {
    id: 'p6',
    title: 'Campagne multi-supports',
    category: 'Communication',
    date: 'À documenter',
    summary: 'Cohérence visuelle cross-média.',
    description:
      'Ensemble d’affiches, stories et déclinaisons pour une prise de parole unifiée.',
    brief: 'Une intention, plusieurs formats — même ADN Luminart.',
    process: [
      'Message & ton',
      'Key visual',
      'Déclinaisons formats',
      'Adaptation réseaux / print',
    ],
    deliverables: ['Key visual', 'Stories', 'Affiche'],
    materials: ['Illustrator', 'Photoshop', 'Canva'],
    technologies: ['Illustrator', 'Photoshop'],
    image: '/images/quentin.jpg',
    gallery: ['/images/quentin.jpg'],
    accent: '#FF46A2',
    roomTheme: 'gallery' as const,
    placeholder: true,
  },
] as const

/** Rich skill map for /apprendre */
export const skillGroups = [
  {
    id: 'visuel',
    title: 'Création visuelle',
    blurb: 'Identité, print et image — le cœur du métier.',
    skills: [
      {
        name: 'Identité visuelle',
        level: 4,
        detail: 'Logos, chartes, déclinaisons multi-supports.',
        accent: '#FF46A2',
      },
      {
        name: 'Mise en page print',
        level: 4,
        detail: 'Affiches, flyers, catalogues, BAT.',
        accent: '#00F5D4',
      },
      {
        name: 'Retouche photo',
        level: 3,
        detail: 'Correction, détourage, ambiance.',
        accent: '#7C5CFF',
      },
      {
        name: 'Réseaux sociaux',
        level: 4,
        detail: 'Visuels story / feed, rythme, cohérence.',
        accent: '#FFB020',
      },
      {
        name: 'Packaging (bases)',
        level: 2,
        detail: 'Volumes simples, gabarits, contraintes print.',
        accent: '#4CC9F0',
      },
      {
        name: 'Direction artistique',
        level: 3,
        detail: 'Moodboards, intention, univers Luminart.',
        accent: '#FF46A2',
      },
    ],
  },
  {
    id: 'fab',
    title: 'Fabrication & 3D',
    blurb: 'Du volume numérique à la pièce physique.',
    skills: [
      {
        name: 'Modélisation Blender',
        level: 3,
        detail: 'Objets, scènes, rendus artistiques.',
        accent: '#7C5CFF',
      },
      {
        name: 'CAO (Fusion / FreeCAD)',
        level: 2,
        detail: 'Pièces techniques, assemblages.',
        accent: '#00F5D4',
      },
      {
        name: 'Impression 3D FDM',
        level: 3,
        detail: 'Tranchage, calibration, itérations.',
        accent: '#4CC9F0',
      },
      {
        name: 'Chaîne print atelier',
        level: 4,
        detail: 'Numérique, grand format, sérigraphie.',
        accent: '#FF46A2',
      },
      {
        name: 'Gestion colorimétrique',
        level: 3,
        detail: 'Profils, BAT, cohérence écran / papier.',
        accent: '#FFB020',
      },
      {
        name: 'Prototypage',
        level: 3,
        detail: 'Tests matière, ajustements, finitions.',
        accent: '#00F5D4',
      },
    ],
  },
  {
    id: 'digital',
    title: 'Numérique & UX',
    blurb: 'Sites, interfaces et expériences immersives.',
    skills: [
      {
        name: 'HTML / CSS',
        level: 3,
        detail: 'Intégration propre, responsive.',
        accent: '#00F5D4',
      },
      {
        name: 'JavaScript',
        level: 2,
        detail: 'Interactions, logique front.',
        accent: '#FFB020',
      },
      {
        name: 'React (bases)',
        level: 2,
        detail: 'Composants, pages, états.',
        accent: '#4CC9F0',
      },
      {
        name: 'Three.js / R3F',
        level: 2,
        detail: 'Scènes 3D, motion, immersion.',
        accent: '#7C5CFF',
      },
      {
        name: 'UI / maquettes Figma',
        level: 3,
        detail: 'Wireframes, design system léger.',
        accent: '#FF46A2',
      },
      {
        name: 'Git / GitHub',
        level: 2,
        detail: 'Versioning, branches, livraison.',
        accent: '#00F5D4',
      },
    ],
  },
  {
    id: 'humain',
    title: 'Relation & qualité',
    blurb: 'Conseil, vente et regard critique produit.',
    skills: [
      {
        name: 'Conseil client',
        level: 4,
        detail: 'Écoute, diagnostic, proposition.',
        accent: '#00F5D4',
      },
      {
        name: 'Vente & argumentation',
        level: 4,
        detail: 'Accueil, closing, fidélisation.',
        accent: '#FFB020',
      },
      {
        name: 'QA jeux vidéo',
        level: 2,
        detail: 'Bugs, cas de test, UX critique.',
        accent: '#7C5CFF',
      },
      {
        name: 'Communication écrite',
        level: 3,
        detail: 'Briefs, comptes-rendus, clarté.',
        accent: '#FF46A2',
      },
      {
        name: 'Organisation projet',
        level: 3,
        detail: 'Priorités, délais, livrables.',
        accent: '#4CC9F0',
      },
      {
        name: 'Photographie',
        level: 3,
        detail: 'Portrait, produit, lumière.',
        accent: '#FF46A2',
      },
    ],
  },
] as const

export const timeline = [
  {
    year: 'Diplôme',
    place: 'Formation',
    title: 'Bac Pro RPIP',
    body: 'Réalisation de Produits Imprimés et Plurimédia — chaîne graphique, couleurs, supports, plurimédia. Socle de production créative.',
    accent: '#00F5D4',
    tags: ['Print', 'Graphisme', 'Plurimédia'],
  },
  {
    year: 'Apprentissage',
    place: 'Continu',
    title: 'Montée en compétences créatives',
    body: 'Graphisme, print, 3D et web en parallèle : logiciels, projets perso, essais techniques documentés.',
    accent: '#7C5CFF',
    tags: ['Adobe', 'Blender', 'Web'],
  },
  {
    year: 'Marque',
    place: 'Identité',
    title: 'Luminart',
    body: 'Univers créatif personnel — direction artistique, glow maîtrisé, présence Instagram @luminart2dcs.',
    accent: '#FF46A2',
    tags: ['DA', 'Instagram', 'Brand'],
  },
  {
    year: 'Atelier',
    place: 'Pratique',
    title: 'Production print & prototypes',
    body: 'Mise en œuvre atelier : numériques, grand format, essais sérigraphie, et premiers prototypes 3D.',
    accent: '#FFB020',
    tags: ['Impression', '3D', 'Finitions'],
  },
  {
    year: 'En cours',
    place: 'Formation',
    title: 'Testeur de jeux vidéo',
    body: 'Qualité logicielle, rapports de bugs, regard critique UX / gameplay — passion du jeu + méthode.',
    accent: '#4CC9F0',
    tags: ['QA', 'UX', 'Jeux'],
  },
  {
    year: 'Stages',
    place: 'Expérience',
    title: 'Stages & missions',
    body: 'Emplacement pour tes stages et expériences terrain — à compléter avec tes vraies missions.',
    accent: '#7C5CFF',
    tags: ['Terrain', 'Client'],
  },
  {
    year: 'Projet',
    place: 'Portfolio',
    title: 'Portfolio immersif',
    body: 'Site-univers : intro cinématique, Story DM, manoir projets, livre, jeu 3D — vitrine technique Luminart.',
    accent: '#00F5D4',
    tags: ['React', 'Three.js', 'UX'],
  },
  {
    year: 'Ambition',
    place: 'Suite',
    title: 'Impression 3D & activité',
    body: 'Monter en fabrication numérique : design, pièces, matières, et une activité polyvalente.',
    accent: '#FF46A2',
    tags: ['Fab', 'Entrepreneuriat'],
  },
] as const

export const passions = [
  {
    id: 'photo',
    title: 'Photographie',
    body: 'Lumière, cadrage, ambiances — captation pour portfolio, produit et storytelling.',
    image: '/images/quentin.jpg',
    accent: '#FF46A2',
    tags: ['Portrait', 'Produit', 'Lumière'],
  },
  {
    id: 'dessin',
    title: 'Dessin & manga',
    body: 'Trait, narration, personnages — culture visuelle qui nourrit le graphisme.',
    image: '/images/quentin.jpg',
    accent: '#7C5CFF',
    tags: ['Illustration', 'Story'],
  },
  {
    id: 'jeux',
    title: 'Jeux vidéo',
    body: 'Univers, level design, QA — comprendre ce qui fait une expérience fluide.',
    image: '/images/quentin.jpg',
    accent: '#00F5D4',
    tags: ['QA', 'UX', 'Univers'],
  },
  {
    id: 'auto',
    title: 'Automobile',
    body: 'Design et esthétique mécanique — volumes, finitions, silence des lignes.',
    image: '/images/quentin.jpg',
    accent: '#FFB020',
    tags: ['Design', 'Forme'],
  },
  {
    id: 'i3d',
    title: 'Impression 3D',
    body: 'De l’idée à l’objet — itérations, filaments, prototypes touchables.',
    image: '/images/quentin.jpg',
    accent: '#4CC9F0',
    tags: ['FDM', 'Proto'],
  },
  {
    id: 'tech',
    title: 'Technologies',
    body: 'Outils du futur créatif : web, 3D temps réel, pipelines numériques.',
    image: '/images/quentin.jpg',
    accent: '#00F5D4',
    tags: ['Web', 'Three.js'],
  },
  {
    id: 'crea',
    title: 'Création Luminart',
    body: 'Exploration libre — glow, identité, univers immersifs.',
    image: '/images/quentin.jpg',
    accent: '#FF46A2',
    tags: ['DA', 'Brand'],
  },
  {
    id: 'voyage',
    title: 'Voyages',
    body: 'Inspiration des lieux, matières, lumières naturelles.',
    image: '/images/quentin.jpg',
    accent: '#7C5CFF',
    tags: ['Inspiration', 'Monde'],
  },
] as const

export const gearCategories = [
  {
    id: 'machines',
    title: 'Machines & stations',
    subtitle: 'Le banc de production',
    icon: 'PC',
    accent: '#00F5D4',
    items: [
      {
        name: 'Station de travail',
        note: 'Création, 3D, développement. CPU / GPU / RAM à documenter.',
        tag: 'Principal',
      },
      {
        name: 'Portable',
        note: 'Mobilité, brief client, retouches légères.',
        tag: 'Nomade',
      },
      {
        name: 'Imprimante 3D FDM',
        note: 'Prototypage : volume, filaments PLA / PETG à renseigner.',
        tag: 'Fab',
      },
      {
        name: 'Accès atelier print',
        note: 'Numérique, grand format, sérigraphie selon accès.',
        tag: 'Print',
      },
    ],
  },
  {
    id: 'capture',
    title: 'Captation',
    subtitle: 'Image & lumière',
    icon: '◎',
    accent: '#FF46A2',
    items: [
      {
        name: 'Appareil photo',
        note: 'Boîtier + objectifs pour portfolio et produits.',
        tag: 'Photo',
      },
      {
        name: 'Smartphone',
        note: 'Stories, tests UI, captation rapide.',
        tag: 'Mobile',
      },
      {
        name: 'Éclairage',
        note: 'Softbox / LED / réflecteurs — à compléter.',
        tag: 'Studio',
      },
      {
        name: 'Trépied & supports',
        note: 'Stabilité produit et portrait.',
      },
    ],
  },
  {
    id: 'periph',
    title: 'Périphériques',
    subtitle: 'Précision & confort',
    icon: '◇',
    accent: '#7C5CFF',
    items: [
      {
        name: 'Tablette graphique',
        note: 'Dessin, retouche précise.',
        tag: 'Draw',
      },
      {
        name: 'Écran calibré',
        note: 'Taille / résolution / colorimétrie à renseigner.',
        tag: 'Couleur',
      },
      {
        name: 'Stockage SSD',
        note: 'Archives projets, rendus, backups.',
      },
      {
        name: 'Périphériques audio',
        note: 'Casque / enceintes pour focus production.',
      },
    ],
  },
  {
    id: 'soft',
    title: 'Logiciels',
    subtitle: 'La boîte à outils',
    icon: '✦',
    accent: '#FFB020',
    items: [
      {
        name: 'Suite Adobe / GIMP / Canva',
        note: 'Photoshop, Illustrator, InDesign au quotidien.',
        tag: 'Visuel',
      },
      {
        name: 'Blender / Fusion / FreeCAD',
        note: 'Volume artistique et CAO technique.',
        tag: '3D',
      },
      {
        name: 'Cura / Simplify3D',
        note: 'Tranchage et préparation impression.',
        tag: 'Print 3D',
      },
      {
        name: 'VS Code / Figma / GitHub',
        note: 'Dev, maquettes, versioning.',
        tag: 'Digital',
      },
    ],
  },
  {
    id: 'atelier',
    title: 'Atelier & finitions',
    subtitle: 'Matière & détail',
    icon: '✦',
    accent: '#4CC9F0',
    items: [
      {
        name: 'Outils façonnage',
        note: 'Coupe, pliage, assemblage print.',
      },
      {
        name: 'Matières & supports',
        note: 'Papiers, vinyle, filaments — inventaire à enrichir.',
        tag: 'Stock',
      },
      {
        name: 'Contrôle qualité',
        note: 'BAT, loupe couleur, checklist livraison.',
        tag: 'QA',
      },
      {
        name: 'Espace Luminart',
        note: 'Moodboard physique, références, tests lumière.',
        tag: 'Brand',
      },
    ],
  },
] as const

/** Legacy flat gear list (compat). */
export const gear = gearCategories.flatMap((c) =>
  c.items.map((item, i) => {
    const tag = 'tag' in item ? item.tag : undefined
    return {
      id: `${c.id}-${i}`,
      category: c.title,
      name: item.name,
      usage: item.note,
      specs: tag ? [tag] : ([] as string[]),
    }
  }),
)

/** Book spreads: each entry is a left+right page pair after cover. */
export const bookSpreads = [
  {
    id: 'cover',
    kind: 'cover' as const,
    title: 'Quentin – Creative Portfolio',
    subtitle: 'Create your own universe',
  },
  {
    id: 'toc',
    kind: 'toc' as const,
    title: 'Sommaire',
    entries: [
      { label: 'Identité visuelle', page: 3 },
      { label: 'Modélisation 3D', page: 4 },
      { label: 'Prototype imprimé', page: 5 },
      { label: 'Expérience web', page: 6 },
      { label: 'Luminart', page: 7 },
    ],
  },
  {
    id: 's1',
    kind: 'spread' as const,
    left: {
      title: 'Identité visuelle',
      text: 'Brief, exploration, déclinaisons. Remplace la photo par un visuel projet.',
      image: '/images/quentin.jpg',
      caption: 'Visuel projet — à remplacer',
    },
    right: {
      title: 'Fiche technique',
      text: 'Logiciels : Illustrator, Photoshop.\nObjectifs : identité claire.\nMatériel : station + suite Adobe.\nRésultat : à documenter.',
      image: null as string | null,
      caption: null as string | null,
    },
  },
  {
    id: 's2',
    kind: 'spread' as const,
    left: {
      title: 'Modélisation 3D',
      text: 'Volume, contraintes, rendu. Emplacement pour capture Blender / Fusion.',
      image: '/images/quentin.jpg',
      caption: 'Rendu 3D — à remplacer',
    },
    right: {
      title: 'Fiche technique',
      text: 'Logiciels : Blender, Fusion 360.\nMatériel : GPU / station.\nDifficultés : à documenter.\nLivrable : visualisation ou fab.',
      image: null,
      caption: null,
    },
  },
  {
    id: 's3',
    kind: 'spread' as const,
    left: {
      title: 'Prototype imprimé',
      text: 'STL → tranchage → pièce. Photo du proto à gauche.',
      image: '/images/quentin.jpg',
      caption: 'Prototype — à remplacer',
    },
    right: {
      title: 'Fiche technique',
      text: 'Outils : Cura, Simplify3D.\nMatériel : imprimante 3D.\nFilament : à renseigner.\nItérations : à documenter.',
      image: null,
      caption: null,
    },
  },
  {
    id: 's4',
    kind: 'spread' as const,
    left: {
      title: 'Expérience web',
      text: 'UI immersive, motion, Three.js. Capture d’écran du site ou d’une maquette.',
      image: '/images/quentin.jpg',
      caption: 'UI — à remplacer',
    },
    right: {
      title: 'Fiche technique',
      text: 'Stack : HTML, CSS, JS, React, Three.js.\nOutils : VS Code, GitHub, Figma.\nFocus : immersion + clarté.',
      image: null,
      caption: null,
    },
  },
  {
    id: 's5',
    kind: 'spread' as const,
    left: {
      title: 'Univers Luminart',
      text: 'Direction artistique, glow maîtrisé, identité lumineuse.',
      image: '/images/quentin.jpg',
      caption: 'Moodboard Luminart — à remplacer',
    },
    right: {
      title: 'Fiche technique',
      text: 'Palette : cyan, violet, accents rose.\nSupports : digital + print.\nCompte : @luminart2dcs.',
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
