export type StoryCategory =
  | 'Identité'
  | 'Compétences'
  | 'Parcours'
  | 'Passions'
  | 'Projets'
  | 'Travail'
  | 'Futur'

export type StoryQA = {
  id: string
  category: StoryCategory
  question: string
  answer: string
}

/** Contacts fictifs clairement marqués — Q&R préparées, pas d’IA backend. */
export const storyCategories: StoryCategory[] = [
  'Identité',
  'Compétences',
  'Parcours',
  'Passions',
  'Projets',
  'Travail',
  'Futur',
]

export const storyQA: StoryQA[] = [
  {
    id: 'id-1',
    category: 'Identité',
    question: 'Quentin, tu peux te présenter ?',
    answer:
      'Je suis Quentin Da Costa Soares, créatif polyvalent. J’aime apprendre, relier le graphisme, la 3D, l’impression et le numérique, et transformer des idées en projets concrets.',
  },
  {
    id: 'id-2',
    category: 'Identité',
    question: 'D’où viens-tu ?',
    answer: 'Je suis basé à Marseille. C’est aussi là que je développe mes projets et mon univers créatif.',
  },
  {
    id: 'id-3',
    category: 'Identité',
    question: 'C’est quoi Luminart ?',
    answer:
      'Luminart est mon univers / marque créative (Instagram @luminart2dcs). Le logo Q de ce site s’inspire d’un style propre, lumineux et professionnel — dans le même esprit.',
  },
  {
    id: 'id-4',
    category: 'Identité',
    question: 'Comment tu travailles au quotidien ?',
    answer:
      'Je commence par comprendre le besoin, puis j’explore, je prototype et j’affine jusqu’à un rendu clair. Méthode + curiosité.',
  },
  {
    id: 'cp-1',
    category: 'Compétences',
    question: 'Pourquoi le graphisme ?',
    answer:
      'Parce que j’aime donner vie aux idées, travailler les couleurs, les formes et construire des identités visuelles.',
  },
  {
    id: 'cp-2',
    category: 'Compétences',
    question: 'Tu fais de la modélisation 3D ?',
    answer:
      'Oui. Je conçois des objets en 3D et j’explore la fabrication numérique — Blender, Fusion 360, FreeCAD, SolidWorks selon le besoin.',
  },
  {
    id: 'cp-3',
    category: 'Compétences',
    question: 'Et l’impression 3D ?',
    answer:
      'Je prépare les STL, je tranche, je calibres et j’optimise les impressions pour prototyper rapidement (Cura, Simplify3D).',
  },
  {
    id: 'cp-4',
    category: 'Compétences',
    question: 'Tu codes aussi ?',
    answer:
      'Oui : HTML, CSS, JavaScript, intégration web et interfaces. Ce portfolio est un exemple d’expérience interactive.',
  },
  {
    id: 'cp-5',
    category: 'Compétences',
    question: 'Quels logiciels maîtrises-tu ?',
    answer:
      'Côté image : Photoshop, Illustrator, InDesign, Canva, GIMP. Côté 3D : Blender, Fusion, FreeCAD, SolidWorks, Cura. Côté web : VS Code, GitHub, Figma.',
  },
  {
    id: 'cp-6',
    category: 'Compétences',
    question: 'Tu as une expérience vente / conseil ?',
    answer:
      'Oui : accueil, écoute du besoin, argumentation, fidélisation et suivi — autant en vente qu’en conseil.',
  },
  {
    id: 'pc-1',
    category: 'Parcours',
    question: 'Quelle formation as-tu suivie ?',
    answer: 'Je suis diplômé d’un Bac Pro RPIP (Réalisation de Produits Imprimés et Plurimédia).',
  },
  {
    id: 'pc-2',
    category: 'Parcours',
    question: 'Tu étudies encore ?',
    answer:
      'Oui, je poursuis une formation de testeur de jeux vidéo — allier passion du jeu et exigence qualité.',
  },
  {
    id: 'pc-3',
    category: 'Parcours',
    question: 'Qu’est-ce que le Bac Pro RPIP t’a apporté ?',
    answer:
      'Une base solide en chaîne graphique, couleurs, supports imprimés et plurimédia — très utile pour la création et la production.',
  },
  {
    id: 'ps-1',
    category: 'Passions',
    question: 'Qu’est-ce que tu aimes faire ?',
    answer:
      'La photographie, le dessin et le manga, les jeux vidéo, l’automobile, la création, la 3D et les nouvelles technologies.',
  },
  {
    id: 'ps-2',
    category: 'Passions',
    question: 'Pourquoi les jeux vidéo ?',
    answer:
      'Pour les univers, le level design, l’interactivité… et maintenant aussi pour le métier de testeur (qualité, bugs, UX).',
  },
  {
    id: 'ps-3',
    category: 'Passions',
    question: 'L’automobile, c’est quoi pour toi ?',
    answer: 'Le design, les lignes, la mécanique esthétique — une source d’inspiration visuelle permanente.',
  },
  {
    id: 'pj-1',
    category: 'Projets',
    question: 'Où voir tes réalisations ?',
    answer:
      'Sur ce site : Projets (galerie jouable), Portfolio (livre) et Laboratoire. Beaucoup d’emplacements sont prêts à recevoir tes vrais fichiers.',
  },
  {
    id: 'pj-2',
    category: 'Projets',
    question: 'Tu travailles sur commande ?',
    answer:
      'Oui, selon le brief : identité, supports, 3D, web… Le plus simple est de m’écrire via Contact.',
  },
  {
    id: 'tr-1',
    category: 'Travail',
    question: 'Comment se passe une collaboration avec toi ?',
    answer:
      'Brief clair → proposition → itérations → livraison soignée. Je communique régulièrement et je reste transparent sur les délais.',
  },
  {
    id: 'tr-2',
    category: 'Travail',
    question: 'Tu préfères quelle mission ?',
    answer:
      'Les projets où création et technique se croisent : identité + print, proto 3D, ou expérience web immersive.',
  },
  {
    id: 'ft-1',
    category: 'Futur',
    question: 'Quels sont tes objectifs ?',
    answer:
      'Continuer à apprendre, monter en compétences et construire des projets professionnels ambitieux — notamment autour de la fabrication numérique.',
  },
  {
    id: 'ft-2',
    category: 'Futur',
    question: 'Tu veux créer une activité ?',
    answer:
      'Oui, l’ambition d’être polyvalent en impression 3D / création d’activité fait partie de mon horizon (design, pièces, matières, entrepreneuriat).',
  },
  {
    id: 'ft-3',
    category: 'Futur',
    question: 'Pourquoi « Create your own universe » ?',
    answer:
      'Parce que chaque projet est un univers : une identité, des règles, une ambiance. Mon rôle est de le rendre visible et vivant.',
  },
]
