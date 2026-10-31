export type FormQuestion = {
  id: string;
  prompt: string;
  options: string[];
};

export type SeasonalForm = {
  month: number; // 1-12
  season: string;
  title: string;
  subtitle: string;
  questions: FormQuestion[];
};

/** YoYoMatch-style: questionnaire changes by month/season. */
export const SEASONAL_FORMS: SeasonalForm[] = [
  {
    month: 1,
    season: "Hiver",
    title: "Janvier — nouveaux départs",
    subtitle: "Qu’est-ce qui te fait vibrer après les fêtes ?",
    questions: [
      {
        id: "q1",
        prompt: "Ton weekend idéal en janvier ?",
        options: ["Brunch & musée", "Ciné sous plaid", "Ski / montagne", "Soirée improvisée"],
      },
      {
        id: "q2",
        prompt: "Tu cherches plutôt…",
        options: ["Calme & profondeur", "Énergie & sorties", "Projets à deux", "Surprise totale"],
      },
      {
        id: "q3",
        prompt: "Un deal-breaker soft ?",
        options: ["Toujours en retard", "Zéro humour", "Pas curieux", "Trop de ghosting"],
      },
    ],
  },
  {
    month: 10,
    season: "Automne",
    title: "Octobre — lueurs d’automne",
    subtitle: "Matching saisonnier Meetora · signaux du mois",
    questions: [
      {
        id: "q1",
        prompt: "Ambiance d’octobre préférée ?",
        options: ["Feuilles & balade", "Concert intimiste", "Halloween créatif", "Café & bouquins"],
      },
      {
        id: "q2",
        prompt: "Premier date en automne ?",
        options: ["Marché de saison", "Expo / vernissage", "Bar à vin", "Parc au coucher du soleil"],
      },
      {
        id: "q3",
        prompt: "Ce qui t’attire en ce moment ?",
        options: ["Authenticité", "Ambition douce", "Sens de l’humour", "Chimie silencieuse"],
      },
      {
        id: "q4",
        prompt: "Rythme de discussion ?",
        options: ["Messages soignés", "Réponses rapides", "Vocaux", "Plans concrets vite"],
      },
    ],
  },
  {
    month: 11,
    season: "Automne",
    title: "Novembre — chaleur intérieure",
    subtitle: "On affine ton placement Meetora",
    questions: [
      {
        id: "q1",
        prompt: "Soirée novembre parfaite ?",
        options: ["Raclette entre amis", "Jazz club", "Série & thé", "Afterwork"],
      },
      {
        id: "q2",
        prompt: "Tu matches mieux avec…",
        options: ["Intro soft", "Extravertis", "Créatifs", "Sportifs"],
      },
      {
        id: "q3",
        prompt: "Intention du mois ?",
        options: ["Rencontres sérieuses", "Nouveaux cercles", "Fun sans pression", "Voyage bientôt"],
      },
    ],
  },
  {
    month: 12,
    season: "Hiver",
    title: "Décembre — lumières",
    subtitle: "Signaux de fin d’année",
    questions: [
      {
        id: "q1",
        prompt: "Décembre pour toi ?",
        options: ["Fêtes & paillettes", "Cocon calme", "Road trip", "Nouveaux projets"],
      },
      {
        id: "q2",
        prompt: "Cadeau idéal d’un crush ?",
        options: ["Playlist", "Expérience", "Objet fait main", "Lettre"],
      },
      {
        id: "q3",
        prompt: "En 2027 tu veux…",
        options: ["Plus d’audace", "Plus de stabilité", "Plus de voyages", "Plus de création"],
      },
    ],
  },
];

export function formForMonth(month = new Date().getMonth() + 1): SeasonalForm {
  return (
    SEASONAL_FORMS.find((f) => f.month === month) ||
    SEASONAL_FORMS.find((f) => f.month === 10)!
  );
}
