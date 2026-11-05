import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { CONTACTS, GITHUB_URL, PROJECT_DETAILS, ProjectEditorial, SKILL_GROUPS } from './data/portfolio.config';
import { GithubRepository, loadGithubProjects, OFFLINE_FALLBACK } from './services/github.service';

type Theme = 'dark' | 'light';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private requestController?: AbortController;
  private intersectionObserver?: IntersectionObserver;
  private previouslyFocused?: HTMLElement;

  readonly contacts = CONTACTS;
  readonly githubUrl = GITHUB_URL;
  readonly skillGroups = SKILL_GROUPS;
  readonly theme = signal<Theme>('dark');
  readonly menuOpen = signal(false);
  readonly projects = signal<GithubRepository[]>([]);
  readonly loading = signal(true);
  readonly githubError = signal(false);
  readonly selectedProject = signal<GithubRepository | null>(null);

  ngOnInit(): void {
    if (this.isBrowser) {
      let stored: string | null = null;
      try { stored = window.localStorage.getItem('nico-theme'); } catch { /* restricted storage */ }
      const systemPreference = window.matchMedia?.('(prefers-color-scheme: light)').matches;
      this.applyTheme(stored === 'dark' || stored === 'light' ? stored : systemPreference ? 'light' : 'dark');
      void this.refreshProjects();
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach((node) => node.classList.add('visible'));
      return;
    }
    this.intersectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -35px 0px' });
    document.querySelectorAll('.reveal').forEach((node) => this.intersectionObserver?.observe(node));
  }

  ngOnDestroy(): void {
    this.requestController?.abort();
    this.intersectionObserver?.disconnect();
    if (this.isBrowser) document.body.classList.remove('dialog-open');
  }

  async refreshProjects(): Promise<void> {
    if (!this.isBrowser) return;
    this.requestController?.abort();
    const controller = new AbortController();
    this.requestController = controller;
    this.loading.set(true);
    this.githubError.set(false);
    try {
      const data = await loadGithubProjects(controller.signal);
      if (!controller.signal.aborted) this.projects.set(data);
    } catch {
      if (!controller.signal.aborted) {
        this.githubError.set(true);
        this.projects.set(OFFLINE_FALLBACK);
      }
    } finally {
      if (!controller.signal.aborted) this.loading.set(false);
    }
  }

  toggleTheme(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    try { window.localStorage.setItem('nico-theme', next); } catch { /* restricted storage */ }
  }

  private applyTheme(value: Theme): void {
    this.theme.set(value);
    if (this.isBrowser) document.documentElement.setAttribute('data-theme', value);
  }

  toggleMenu(): void { this.menuOpen.update((open) => !open); }

  scrollToSection(id: string): void {
    if (!this.isBrowser) return;
    this.menuOpen.set(false);
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced ? 'instant' : 'smooth', block: 'start' });
  }

  editorial(repo: GithubRepository): ProjectEditorial | undefined {
    return PROJECT_DETAILS[repo.name.toLowerCase()];
  }

  projectTitle(repo: GithubRepository): string {
    return this.editorial(repo)?.name ?? repo.name.replace(/[-_]/g, ' ');
  }

  projectDescription(repo: GithubRepository): string {
    return this.editorial(repo)?.summary ?? repo.description ?? 'Scopri il repository, il codice sorgente e i dettagli del progetto su GitHub.';
  }

  projectTags(repo: GithubRepository): string[] {
    const curated = this.editorial(repo)?.tags;
    if (curated?.length) return curated;
    const tags = [...new Set([repo.language, ...(repo.topics ?? [])].filter((item): item is string => !!item))];
    return tags.slice(0, 4);
  }

  openProject(repo: GithubRepository, event?: MouseEvent): void {
    if (this.isBrowser) {
      this.previouslyFocused = (event?.currentTarget as HTMLElement) ?? undefined;
      document.body.classList.add('dialog-open');
    }
    this.selectedProject.set(repo);
    if (this.isBrowser) requestAnimationFrame(() => document.querySelector<HTMLElement>('.modal-close')?.focus());
  }

  closeProject(): void {
    this.selectedProject.set(null);
    if (this.isBrowser) {
      document.body.classList.remove('dialog-open');
      requestAnimationFrame(() => this.previouslyFocused?.focus());
    }
  }

  /** Minimal keyboard focus trap for the project dialog. */
  trapDialogFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.isBrowser) return;
    const dialog = document.querySelector<HTMLElement>('.project-modal');
    if (!dialog) return;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
    if (focusable.length === 0) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    if (this.selectedProject()) this.closeProject();
    else this.menuOpen.set(false);
  }

  safeDemoUrl(repo: GithubRepository): string | null {
    try {
      const value = new URL(repo.homepage ?? '');
      return value.protocol === 'https:' ? value.href : null;
    } catch { return null; }
  }
}
