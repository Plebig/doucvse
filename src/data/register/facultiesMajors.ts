export type FacultyMajor = {
  [faculty: string]: string[];
};

export const facultiesMajors: FacultyMajor = {
  FIS: [
    "Aplikovaná informatika",
    "Data Analytics",
    "Informační média a služby",
    "Matematické metody v ekonomii",
    "Multimédia v ekonomické praxi",
  ],
  FFÚ: [
    "Bankovnictví a pojišťovnictví",
    "Zdanění a daňová politika",
    "Finance",
    "Účetnictví a finanční řízení podniku",
  ],
  FMW: [
    "Mezinárodní obchod",
    "Mezinárodní studia a diplomacie",
    "Turismus a hospitality management",
    "International Business",
    "International and Diplomatic Studies",
    "Manažer obchodu",
  ],
  FPH: [
    "Podniková ekonomika a management",
    "Arts management",
    "Business Administration",
  ],
  FM: ["Management", "Procesní řízení"],
  NF: ["Ekonomie", "Národní hospodářství", "Veřejná správa a regionální rozvoj"]
};
