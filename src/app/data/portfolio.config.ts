/** Portfolio configuration: edit these values to customize the site. */
export const GITHUB_USERNAME = 'nicolcnt';
export const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;

/** Exclude the test repository. Profile README has a separate GitHub section. */
export const EXCLUDED_REPOSITORIES = new Set([
  'pokexplorer-test',
  GITHUB_USERNAME.toLowerCase(),
]);

export const CONTACTS = {
  email: 'nicola.lo.conte18@gmail.com',
  github: GITHUB_URL,
  // Fill these with the real public URLs when ready; empty strings disable the links.
  discord: 'https://discord.com/users/572861763905781790',
  instagram: 'https://www.instagram.com/nicola.lo.conte/',
} as const;

export interface Technology {
  name: string;
  mark: string;
  tone: 'violet' | 'blue' | 'mint' | 'orange' | 'neutral';
}

export interface SkillGroup {
  title: string;
  subtitle: string;
  icon: string;
  technologies: Technology[];
}

/** Only technologies supported by the original portfolio or past project work. */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Linguaggi', subtitle: 'Il codice con cui lavoro', icon: '⌘',
    technologies: [
      { name: 'C#', mark: 'C#', tone: 'violet' },
      { name: 'Java', mark: 'J', tone: 'orange' },
      { name: 'TypeScript', mark: 'TS', tone: 'blue' },
      { name: 'JavaScript', mark: 'JS', tone: 'orange' },
      { name: 'HTML', mark: 'H5', tone: 'orange' },
      { name: 'CSS / SCSS', mark: '{}', tone: 'blue' },
      { name: 'SQL', mark: 'DB', tone: 'mint' },
    ],
  },
  {
    title: 'Framework & runtime', subtitle: 'Strumenti per costruire', icon: '◈',
    technologies: [
      { name: '.NET', mark: '.N', tone: 'violet' },
      { name: 'Angular', mark: 'A', tone: 'orange' },
      { name: 'Spring Framework', mark: 'S', tone: 'mint' },
      { name: 'Angular Material', mark: 'M', tone: 'violet' },
    ],
  },
  {
    title: 'Dati & testing', subtitle: 'Persistenza e qualità', icon: '◇',
    technologies: [
      { name: 'MySQL', mark: 'SQL', tone: 'blue' },
      { name: 'XML', mark: '</>', tone: 'orange' },
      { name: 'xUnit', mark: 'xU', tone: 'mint' },
      { name: 'LINQ', mark: 'λ', tone: 'violet' },
      { name: 'OOP', mark: 'OOP', tone: 'neutral' },
    ],
  },
  {
    title: 'Tools & workflow', subtitle: 'Il mio ambiente di sviluppo', icon: '⌁',
    technologies: [
      { name: 'Visual Studio', mark: 'VS', tone: 'violet' },
      { name: 'VS Code', mark: 'VS', tone: 'blue' },
      { name: 'Git', mark: 'Git', tone: 'orange' },
      { name: 'GitHub', mark: 'GH', tone: 'neutral' },
      { name: 'Azure DevOps', mark: 'Az', tone: 'blue' },
      { name: 'Eclipse', mark: 'E', tone: 'violet' },
      { name: 'npm', mark: 'npm', tone: 'orange' },
    ],
  },
];

export interface ProjectEditorial {
  /** Name is matched case-insensitively to a GitHub repository. */
  name: string;
  kicker: string;
  summary: string;
  highlights: string[];
  tags: string[];
  style: 'arcade' | 'code';
}

/** Optional editorial details supplement public GitHub API metadata. */
export const PROJECT_DETAILS: Record<string, ProjectEditorial> = {
  taskmanager: {
    name: 'Task Manager',
    kicker: 'CONSOLE APP / C# + .NET',
    summary: 'Applicazione console sviluppata in C# e .NET 10 per organizzare e gestire attività, con stati, priorità, filtri e persistenza dei dati in JSON.',
    highlights: [
      'Creazione, modifica, ricerca ed eliminazione delle attività',
      'Gestione degli stati e delle priorità',
      'Architettura a livelli e programmazione OOP',
      'Persistenza JSON e ricerche LINQ',
      'Test automatici con xUnit'
    ],
    tags: ['C#', '.NET 10', 'OOP', 'LINQ', 'JSON', 'xUnit'],
    style: 'code'
  },

  pokexplorer: {
    name: 'Pokéxplorer',
    kicker: 'WEB GAME / INTERACTIVE',
    summary: 'Un gioco web a tema Pokémon con esplorazione, interazioni sulla mappa e un’interfaccia ispirata ai videogiochi classici.',
    highlights: [
      'Esplorazione di ambienti e mappe di gioco',
      'Interazioni e dialoghi in-game',
      'Modalità utente locale e configurazione Discord OAuth per il web',
    ],
    tags: ['JavaScript', 'HTML', 'CSS'],
    style: 'arcade',
  },
};
