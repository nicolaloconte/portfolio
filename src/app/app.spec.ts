import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { filterPortfolioProjects, GithubRepository } from './services/github.service';

describe('Nico portfolio', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents();
  });

  it('renders the developer-focused introduction', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Full Stack Developer');
    expect(html.textContent).toContain('Progetti');
  });

  it('excludes test and profile repositories', () => {
    const makeRepo = (name: string): GithubRepository => ({
      id: name.length, name, full_name: `nicolaloconte/${name}`,
      html_url: `https://github.com/nicolaloconte/${name}`, description: null,
      homepage: null, language: 'TypeScript', topics: [], updated_at: '2026-11-01',
      archived: false, fork: false,
    });
    const result = filterPortfolioProjects([
      makeRepo('pokexplorer'), makeRepo('pokexplorer-test'), makeRepo('nicolaloconte'), makeRepo('new-app'),
    ]);
    expect(result.map((repo) => repo.name)).toEqual(['pokexplorer', 'new-app']);
  });
});
