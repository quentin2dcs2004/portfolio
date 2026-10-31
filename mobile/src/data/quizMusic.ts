export type QuizQuestion = {
  id: string;
  clipLabel: string;
  /** Simulated “playing” lyric / vibe hint — no real audio required for demo */
  vibe: string;
  choices: string[];
  correctIndex: number;
};

export const MUSIC_QUIZ = {
  id: "music_demo_v1",
  title: "Quiz passion · Musique",
  subtitle: "Écoute l’ambiance, trouve le titre. +25 pts par bonne réponse.",
  pointsPerCorrect: 25,
  boostThreshold: 75,
  questions: [
    {
      id: "m1",
      clipLabel: "♪ Clip A — 0:12",
      vibe: "Groove disco, voix féminine solaire, « …don’t stop the music… »",
      choices: ["Don’t Stop the Music — Rihanna", "Le Freak — Chic", "Get Lucky — Daft Punk", "Blurred Lines — Robin Thicke"],
      correctIndex: 0,
    },
    {
      id: "m2",
      clipLabel: "♪ Clip B — 0:08",
      vibe: "Synthés français, filtre robot, « Around the world… »",
      choices: ["One More Time — Daft Punk", "Around the World — Daft Punk", "Harder Better Faster — Daft Punk", "Instant Crush — Daft Punk"],
      correctIndex: 1,
    },
    {
      id: "m3",
      clipLabel: "♪ Clip C — 0:10",
      vibe: "Piano intime FR, « …je te trouve quand même… »",
      choices: ["Formidable — Stromae", "Alors on danse — Stromae", "Papaoutai — Stromae", "Santé — Stromae"],
      correctIndex: 0,
    },
    {
      id: "m4",
      clipLabel: "♪ Clip D — 0:09",
      vibe: "Indie dreamy, guitare, « …you belong with me… » (non — autre hit)",
      choices: ["Shake It Off — Taylor Swift", "Blank Space — Taylor Swift", "Love Story — Taylor Swift", "Anti-Hero — Taylor Swift"],
      correctIndex: 2,
    },
  ] as QuizQuestion[],
};
