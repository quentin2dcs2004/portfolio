/** Fruitz-inspired, more classy — emoji intentions for Meetora profiles. */
export type Intention = {
  id: string;
  emoji: string;
  label: string;
  hint: string;
};

export const INTENTIONS: Intention[] = [
  { id: "serious", emoji: "💍", label: "Sérieux", hint: "Relation durable" },
  { id: "spark", emoji: "✨", label: "Étincelle", hint: "Voir où ça mène" },
  { id: "friends", emoji: "🥂", label: "Amitié+", hint: "D’abord des liens" },
  { id: "tonight", emoji: "🌙", label: "Ce soir", hint: "Rencontre légère" },
  { id: "travel", emoji: "✈️", label: "Aventure", hint: "Voyager / découvrir" },
  { id: "mind", emoji: "🧠", label: "Esprit", hint: "Connexion intellectuelle" },
  { id: "creative", emoji: "🎨", label: "Créatif", hint: "Arts & projets" },
  { id: "active", emoji: "🏃", label: "Actif", hint: "Sport & énergie" },
];

export function intentionById(id: string) {
  return INTENTIONS.find((i) => i.id === id);
}
