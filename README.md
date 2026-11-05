# Nico — Developer Portfolio

Portfolio **single-page** in italiano, realizzato con **Angular 21, TypeScript e SCSS**. Nessun CV, storico professionale o PDF.

## Avvio

```bash
npm ci
npm start
```

Visita `http://localhost:4200/`. Build produzione: `npm run build`.

## Progetti GitHub — aggiornamento automatico

Il portfolio carica i repository pubblici tramite la **GitHub REST API** in `src/app/services/github.service.ts` (nessun token nel browser). Mostra tutti i repository pubblici di `nicolaloconte`, tranne:

- `pokexplorer-test` (esclusione esplicita)
- `nicolaloconte` (repository di profilo, collegato separatamente nella sezione GitHub)

La lista viene aggiornata a ogni apertura o ricaricamento della pagina, ordinata per ultimo aggiornamento. GitHub applica un limite alle chiamate non autenticate (in genere **60 richieste per ora per IP**). In caso di errore viene mostrato un avviso e un solo progetto di esempio *esplicitamente indicato come fallback*, con possibilità di riprovare. Non è necessaria alcuna chiave API.

Le descrizioni personalizzate del progetto `pokexplorer` si trovano in `src/app/data/portfolio.config.ts` (`PROJECT_DETAILS`). Gli altri repository sono mostrati automaticamente con titolo, descrizione, linguaggio e topic disponibili nella API GitHub. Il dettaglio si apre senza lasciare la pagina.

## Contenuti e contatti

Modifica `src/app/data/portfolio.config.ts`:

- `SKILL_GROUPS`: tecnologie/strumenti in categorie con icone monogramma.
- `PROJECT_DETAILS`: schede editoriali facoltative per singoli repository.
- `CONTACTS`: email, GitHub, Discord e Instagram.

**Discord e Instagram sono vuoti di proposito:** non sono stati forniti gli URL verificati. Nel sito compaiono come *da configurare* invece di link inventati. Imposta gli URL reali per attivarli automaticamente.

## UI / accessibilità

Tema dark/light con preferenza salvata localmente, mobile responsive, animazioni rispettose di `prefers-reduced-motion`, navigazione da tastiera e modale con chiusura su Escape e gestione del focus. Nessuna libreria JS aggiuntiva.

## Deployment

È incluso `netlify.toml` per Netlify. Puoi anche usare altre piattaforme che supportino build Angular statiche (output `dist/nico-developer-portfolio/browser`). In hosting su sottopercorso, configura il base-href Angular.
