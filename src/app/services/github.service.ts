import { EXCLUDED_REPOSITORIES, GITHUB_USERNAME } from '../data/portfolio.config';

export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics: string[];
  updated_at: string;
  archived: boolean;
  fork: boolean;
  visibility?: string;
}

const API_BASE = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

/**
 * Load the complete list of public repositories, subject to GitHub's public
 * unauthenticated rate limit. No credentials are embedded in the browser.
 */
export async function loadGithubProjects(signal: AbortSignal): Promise<GithubRepository[]> {
  const repositories: GithubRepository[] = [];
  for (let page = 1; page <= 10; page++) {
    const url = `${API_BASE}?per_page=100&page=${page}&sort=updated&type=owner`;
    const response = await fetch(url, {
      signal,
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) {
      throw new Error(`GitHub API: ${response.status}`);
    }
    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error('Risposta GitHub inattesa');
    }
    const batch = payload as GithubRepository[];
    repositories.push(...batch);
    if (batch.length < 100) break;
  }
  return filterPortfolioProjects(repositories);
}

export function filterPortfolioProjects(repositories: GithubRepository[]): GithubRepository[] {
  return repositories
    .filter((repo) =>
      !!repo?.name &&
      typeof repo.html_url === 'string' &&
      !EXCLUDED_REPOSITORIES.has(repo.name.toLowerCase()) &&
      repo.full_name?.toLowerCase().startsWith(`${GITHUB_USERNAME.toLowerCase()}/`)
    )
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
}

/** Visible only if GitHub cannot be reached; transparently labeled in the UI. */
export const OFFLINE_FALLBACK: GithubRepository[] = [{
  id: -1,
  name: 'pokexplorer',
  full_name: 'nicolaloconte/pokexplorer',
  html_url: 'https://github.com/nicolaloconte/pokexplorer',
  description: 'Web Pokémon Game',
  homepage: null,
  language: 'JavaScript',
  topics: [],
  updated_at: '',
  archived: false,
  fork: false,
}];
